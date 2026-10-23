import { Worker } from "bullmq";

import type { ExportJobData } from "@clipper/shared";

import { renderExport, type CompletedExport } from "./media.js";
import { createRedisConnection, exportQueueName } from "./queue.js";

export async function startExportWorker(): Promise<Worker<ExportJobData, CompletedExport>> {
  const connection = createRedisConnection();
  const worker = new Worker<ExportJobData, CompletedExport>(
    exportQueueName,
    async (job) => {
      await job.updateProgress(10);
      const result = await renderExport(job.data);
      await job.updateProgress(100);
      return result;
    },
    { connection },
  );

  worker.on("failed", (job) => {
    console.error(`Export job ${job?.id ?? "unknown"} failed.`);
  });

  await worker.waitUntilReady();
  return worker;
}

if (import.meta.main) {
  void startExportWorker()
    .then(() => {
      console.info("Clipper export worker is ready.");
    })
    .catch(() => {
      console.error("Clipper export worker could not start.");
      process.exitCode = 1;
    });
}
