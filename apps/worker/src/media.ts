import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { basename, dirname, extname, relative, resolve } from "node:path";

import type { ExportJobData, ExportStatus } from "@clipper/shared";

import { workerConfig, type WorkerConfig } from "./config.js";

type SafeFilePathOptions = {
  localDataDirectory: string;
  bucket: "uploads" | "exports";
  originalFilename: string;
  id?: string;
};

const supportedExtensions = new Set([".mov", ".mp4"]);

export type CompletedExport = {
  status: Extract<ExportStatus, "completed">;
  outputPath: string;
  durationSeconds: number;
};

export function safeFilePath({
  localDataDirectory,
  bucket,
  originalFilename,
  id = randomUUID(),
}: SafeFilePathOptions): string {
  const extension = extname(basename(originalFilename)).toLowerCase();
  const safeExtension = supportedExtensions.has(extension) ? extension : ".mp4";
  const bucketDirectory = resolve(localDataDirectory, bucket);
  const filePath = resolve(bucketDirectory, `${id}${safeExtension}`);
  const pathFromBucket = relative(bucketDirectory, filePath);

  if (pathFromBucket.startsWith("..") || pathFromBucket === "") {
    throw new Error("Generated local file path is outside its bucket.");
  }

  return filePath;
}

export function buildVerticalExportArgs(
  inputPath: string,
  outputPath: string,
  startSeconds: number,
  endSeconds: number,
): string[] {
  const duration = endSeconds - startSeconds;

  if (startSeconds < 0 || duration <= 0) {
    throw new Error("Export times must describe a positive video range.");
  }

  const centerCropFilter = [
    "crop=if(gte(iw/ih\\,9/16)\\,ih*9/16\\,iw)",
    "if(gte(iw/ih\\,9/16)\\,ih\\,iw*16/9)",
    "(iw-ow)/2",
    "(ih-oh)/2",
  ].join(":");

  return [
    "-y",
    "-ss",
    String(startSeconds),
    "-t",
    String(duration),
    "-i",
    inputPath,
    "-map",
    "0:v:0",
    "-map",
    "0:a?",
    "-vf",
    `${centerCropFilter},scale=1080:1920`,
    "-c:v",
    "libx264",
    "-c:a",
    "aac",
    "-movflags",
    "+faststart",
    outputPath,
  ];
}

function assertPathInsideDirectory(directory: string, filePath: string): void {
  const pathFromDirectory = relative(resolve(directory), resolve(filePath));

  if (pathFromDirectory.startsWith("..") || pathFromDirectory === "") {
    throw new Error("Local media path is outside the data directory.");
  }
}

function runProcess(command: string, args: string[]): Promise<string> {
  return new Promise((resolveProcess, rejectProcess) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";

    child.stdout?.setEncoding("utf8");
    child.stdout?.on("data", (chunk: string) => {
      output += chunk;
    });

    child.once("error", () => {
      rejectProcess(new Error("Media process could not start."));
    });
    child.once("close", (code) => {
      if (code === 0) {
        resolveProcess(output);
        return;
      }

      rejectProcess(new Error("Media process failed."));
    });
  });
}

export async function probeVideoDuration(
  inputPath: string,
  ffprobePath = workerConfig.ffprobePath,
): Promise<number> {
  const output = await runProcess(ffprobePath, [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    inputPath,
  ]);
  const duration = Number.parseFloat(output.trim());

  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error("Unable to inspect input video.");
  }

  return duration;
}

export async function renderExport(
  job: ExportJobData,
  config: WorkerConfig = workerConfig,
): Promise<CompletedExport> {
  assertPathInsideDirectory(config.localDataDirectory, job.inputPath);
  assertPathInsideDirectory(config.localDataDirectory, job.outputPath);

  try {
    const sourceDuration = await probeVideoDuration(job.inputPath, config.ffprobePath);

    if (job.endSeconds > sourceDuration) {
      throw new Error("Export range exceeds input video duration.");
    }

    await mkdir(dirname(job.outputPath), { recursive: true });
    await runProcess(
      config.ffmpegPath,
      buildVerticalExportArgs(
        job.inputPath,
        job.outputPath,
        job.startSeconds,
        job.endSeconds,
      ),
    );

    return {
      status: "completed",
      outputPath: job.outputPath,
      durationSeconds: job.endSeconds - job.startSeconds,
    };
  } catch {
    await rm(job.outputPath, { force: true });
    throw new Error("Unable to export video.");
  }
}

