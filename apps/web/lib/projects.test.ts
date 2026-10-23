import { access, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { saveUpload, type UploadDependencies } from "./projects";

const projectId = "4cc2f80c-00c0-4b46-a6dd-8915499ad0a3";

async function createDependencies(): Promise<{
  dependencies: UploadDependencies;
  localDataDirectory: string;
}> {
  const localDataDirectory = await mkdtemp(join(tmpdir(), "clipper-web-"));

  return {
    localDataDirectory,
    dependencies: {
      localDataDirectory,
      createId: () => projectId,
      now: () => new Date("2026-10-23T06:00:00.000Z"),
      probeDuration: async () => 42,
      projectStore: {
        get: async () => null,
        list: async () => [],
        save: async () => undefined,
      },
    },
  };
}

describe("saveUpload", () => {
  it("rejects a file larger than 100 MB before writing it", async () => {
    const { dependencies, localDataDirectory } = await createDependencies();
    const oversizedFile = {
      name: "large.mp4",
      size: 101 * 1024 * 1024,
      type: "video/mp4",
    } as File;

    await expect(saveUpload(oversizedFile, dependencies)).rejects.toThrow(
      "100 MB",
    );
    await rm(localDataDirectory, { recursive: true, force: true });
  });

  it("rejects an unsupported image upload", async () => {
    const { dependencies, localDataDirectory } = await createDependencies();
    const imageFile = new File(["image"], "photo.png", { type: "image/png" });

    await expect(saveUpload(imageFile, dependencies)).rejects.toThrow(
      "MP4 or MOV",
    );
    await rm(localDataDirectory, { recursive: true, force: true });
  });

  it("uses a UUID path instead of a filename with traversal characters", async () => {
    const { dependencies, localDataDirectory } = await createDependencies();
    const upload = new File(["video"], "../../bad;name.mp4", {
      type: "video/mp4",
    });

    const project = await saveUpload(upload, dependencies);

    expect(project.sourceFilename).toBe("../../bad;name.mp4");
    expect(project.sourcePath).toBe(
      join(localDataDirectory, "uploads", `${projectId}.mp4`),
    );
    await expect(access(project.sourcePath)).resolves.toBeUndefined();
    await rm(localDataDirectory, { recursive: true, force: true });
  });
});
