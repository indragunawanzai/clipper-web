import { Queue } from "bullmq";
import { Redis } from "ioredis";

import type { ExportJobData } from "@clipper/shared";

import { workerConfig } from "./config.js";
import type { CompletedExport } from "./media.js";

export const exportQueueName = "exports";

export function createRedisConnection(redisUrl = workerConfig.redisUrl): Redis {
  return new Redis(redisUrl, { maxRetriesPerRequest: null });
}

export function createExportQueue(connection = createRedisConnection()) {
  return new Queue<ExportJobData, CompletedExport>(exportQueueName, {
    connection,
  });
}
