import { resolve } from "node:path";

export const webConfig = {
  redisUrl: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
  localDataDirectory: resolve(process.env.LOCAL_DATA_DIR ?? ".local-data"),
  ffprobePath: process.env.FFPROBE_PATH ?? "ffprobe",
};
