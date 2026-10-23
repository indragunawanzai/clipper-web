import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";

import { createProjectSchema, type Project } from "@clipper/shared";
import { Redis } from "ioredis";

import { webConfig } from "./config.js";
import {
  acceptedVideoExtension,
  createUploadPath,
  maxUploadSizeBytes,
  persistUpload,
} from "./local-files.js";

const projectIndexKey = "projects";

export type ProjectStore = {
  get(id: string): Promise<Project | null>;
  list(): Promise<Project[]>;
  save(project: Project): Promise<void>;
};

export type UploadDependencies = {
  createId: () => Project["id"];
  localDataDirectory: string;
  now: () => Date;
  probeDuration: (sourcePath: string) => Promise<number>;
  projectStore: ProjectStore;
};

class RedisProjectStore implements ProjectStore {
  public constructor(private readonly redis: Redis) {}

  public async get(id: string): Promise<Project | null> {
    const rawProject = await this.redis.get(`project:${id}`);

    if (!rawProject) {
      return null;
    }

    const parsedProject = createProjectSchema.safeParse(JSON.parse(rawProject));
    return parsedProject.success ? parsedProject.data : null;
  }

  public async list(): Promise<Project[]> {
    const ids = await this.redis.zrevrange(projectIndexKey, 0, -1);
    const records = ids.length > 0 ? await this.redis.mget(ids.map((id) => `project:${id}`)) : [];

    return records.flatMap((record) => {
      if (!record) {
        return [];
      }

      const parsedProject = createProjectSchema.safeParse(JSON.parse(record));
      return parsedProject.success ? [parsedProject.data] : [];
    });
  }

  public async save(project: Project): Promise<void> {
    await this.redis
      .multi()
      .set(`project:${project.id}`, JSON.stringify(project))
      .zadd(projectIndexKey, Date.parse(project.createdAt), project.id)
      .exec();
  }
}

function probeDuration(sourcePath: string): Promise<number> {
  return new Promise((resolveDuration, rejectDuration) => {
    const process = spawn(webConfig.ffprobePath, [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      sourcePath,
    ]);
    let output = "";

    process.stdout.setEncoding("utf8");
    process.stdout.on("data", (chunk: string) => {
      output += chunk;
    });
    process.once("error", () => rejectDuration(new Error("Unable to inspect uploaded video.")));
    process.once("close", (code) => {
      const duration = Number.parseFloat(output.trim());
      if (code === 0 && Number.isFinite(duration) && duration > 0) {
        resolveDuration(duration);
      } else {
        rejectDuration(new Error("Unable to inspect uploaded video."));
      }
    });
  });
}

let defaultProjectStore: ProjectStore | undefined;

function getDefaultProjectStore(): ProjectStore {
  defaultProjectStore ??= new RedisProjectStore(new Redis(webConfig.redisUrl));
  return defaultProjectStore;
}

function defaultDependencies(): UploadDependencies {
  return {
    createId: crypto.randomUUID,
    localDataDirectory: webConfig.localDataDirectory,
    now: () => new Date(),
    probeDuration,
    projectStore: getDefaultProjectStore(),
  };
}

export async function saveUpload(
  file: File,
  dependencies: UploadDependencies = defaultDependencies(),
): Promise<Project> {
  if (file.size > maxUploadSizeBytes) {
    throw new Error("Upload a video smaller than 100 MB.");
  }

  const extension = acceptedVideoExtension(file);
  const id = dependencies.createId();
  const sourcePath = createUploadPath(dependencies.localDataDirectory, extension, id);

  try {
    await persistUpload(file, sourcePath);
    const durationSeconds = await dependencies.probeDuration(sourcePath);
    const project = createProjectSchema.parse({
      id,
      sourceFilename: file.name,
      sourcePath,
      createdAt: dependencies.now().toISOString(),
      durationSeconds,
    });

    await dependencies.projectStore.save(project);
    return project;
  } catch (error) {
    await rm(sourcePath, { force: true });
    throw error;
  }
}

export function getProject(id: string): Promise<Project | null> {
  return getDefaultProjectStore().get(id);
}

export function listProjects(): Promise<Project[]> {
  return getDefaultProjectStore().list();
}
