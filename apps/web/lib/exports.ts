import { createHash } from "node:crypto";
import { resolve } from "node:path";

import { Queue } from "bullmq";
import {
  createExportRequestSchema,
  type CreateExportRequest,
  type ExportJobData,
  type Project,
} from "@clipper/shared";
import { Redis } from "ioredis";

import { webConfig } from "./config.js";
import { getDefaultProjectStore, type ProjectStore } from "./projects.js";

const exportQueueName = "exports";
const activeStates = new Set(["waiting", "active", "delayed", "prioritized"]);

type ExportQueue = {
  add: (name: string, data: ExportJobData, options: { jobId: string }) => Promise<{ id?: string }>;
  getJob: (id: string) => Promise<{ getState: () => Promise<string> } | null | undefined>;
};

export type ExportDependencies = {
  localDataDirectory: string;
  projectStore: ProjectStore;
  queue: ExportQueue;
};

function createJobId(request: CreateExportRequest): string {
  return createHash("sha256")
    .update(`${request.projectId}:${request.startSeconds}:${request.endSeconds}:${request.preset}`)
    .digest("hex");
}

let defaultQueue: Queue<ExportJobData> | undefined;

function getDefaultQueue(): Queue<ExportJobData> {
  defaultQueue ??= new Queue<ExportJobData>(exportQueueName, {
    connection: new Redis(webConfig.redisUrl, { maxRetriesPerRequest: null }),
  });
  return defaultQueue!;
}

function defaultDependencies(): ExportDependencies {
  return {
    localDataDirectory: webConfig.localDataDirectory,
    projectStore: getDefaultProjectStore(),
    queue: getDefaultQueue(),
  };
}

export async function queueExport(
  input: CreateExportRequest,
  dependencies: ExportDependencies = defaultDependencies(),
): Promise<{ jobId: string }> {
  const request = createExportRequestSchema.parse(input);
  const project = await dependencies.projectStore.get(request.projectId);

  if (!project) {
    throw new Error("Project not found.");
  }

  if (request.endSeconds > project.durationSeconds) {
    throw new Error("Export end time exceeds the source duration.");
  }

  const jobId = createJobId(request);
  const existingJob = await dependencies.queue.getJob(jobId);

  if (existingJob && activeStates.has(await existingJob.getState())) {
    return { jobId };
  }

  const outputPath = resolve(dependencies.localDataDirectory, "exports", `${jobId}.mp4`);
  const job = await dependencies.queue.add(exportQueueName, {
    ...request,
    inputPath: project.sourcePath,
    outputPath,
  }, { jobId });

  await dependencies.projectStore.save({
    ...project,
    latestExportJobId: job.id ?? jobId,
    latestExportStatus: "queued",
  } satisfies Project);

  return { jobId: job.id ?? jobId };
}

export async function getExportJobStatus(jobId: string): Promise<{
  id: string;
  status: "queued" | "processing" | "completed" | "failed";
  error?: string;
} | null> {
  const job = await getDefaultQueue().getJob(jobId);
  if (!job) {
    return null;
  }

  const state = await job.getState();
  if (state === "completed") {
    return { id: jobId, status: "completed" };
  }
  if (state === "failed") {
    return { id: jobId, status: "failed", error: "Unable to export video." };
  }

  return { id: jobId, status: "processing" };
}
