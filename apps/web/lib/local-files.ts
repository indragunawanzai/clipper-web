import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, dirname, extname, resolve } from "node:path";

export const maxUploadSizeBytes = 100 * 1024 * 1024;

const acceptedVideoTypes = new Map([
  [".mp4", "video/mp4"],
  [".mov", "video/quicktime"],
]);

export function acceptedVideoExtension(file: Pick<File, "name" | "type">): string {
  const extension = extname(basename(file.name)).toLowerCase();
  const expectedType = acceptedVideoTypes.get(extension);

  if (!expectedType || file.type !== expectedType) {
    throw new Error("Upload an MP4 or MOV video file.");
  }

  return extension;
}

export function createUploadPath(
  localDataDirectory: string,
  extension: string,
  id: string = randomUUID(),
): string {
  const uploadDirectory = resolve(localDataDirectory, "uploads");
  const uploadPath = resolve(uploadDirectory, `${id}${extension}`);

  if (!uploadPath.startsWith(`${uploadDirectory}/`)) {
    throw new Error("Generated upload path is outside the local data directory.");
  }

  return uploadPath;
}

export async function persistUpload(file: File, uploadPath: string): Promise<void> {
  await mkdir(dirname(uploadPath), { recursive: true });
  await writeFile(uploadPath, Buffer.from(await file.arrayBuffer()));
}
