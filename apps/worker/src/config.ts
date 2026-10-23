import { resolve } from "node:path";

function localDataDirectory(value = ".local-data"): string {
  return resolve(value);
}

export const workerConfig = {
  redisUrl: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
  localDataDirectory: localDataDirectory(process.env.LOCAL_DATA_DIR),
  ffmpegPath: process.env.FFMPEG_PATH ?? "ffmpeg",
  ffprobePath: process.env.FFPROBE_PATH ?? "ffprobe",
};

export type WorkerConfig = typeof workerConfig;
