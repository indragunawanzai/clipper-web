import { describe, expect, it } from "vitest";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import {
  buildVerticalExportArgs,
  renderExport,
  safeFilePath,
} from "./media.js";

describe("buildVerticalExportArgs", () => {
  it("builds an argument array for a trimmed 9:16 center-crop export", () => {
    const args = buildVerticalExportArgs(
      "/tmp/clipper/.local-data/uploads/source.mp4",
      "/tmp/clipper/.local-data/exports/output.mp4",
      5,
      35,
    );

    expect(args).toEqual(
      expect.arrayContaining([
        "-ss",
        "5",
        "-t",
        "30",
        "-i",
        "/tmp/clipper/.local-data/uploads/source.mp4",
        "-vf",
        expect.stringContaining("crop="),
        "/tmp/clipper/.local-data/exports/output.mp4",
      ]),
    );
    expect(args.join(" ")).not.toContain("ffmpeg ");
  });
});

describe("safeFilePath", () => {
  it("keeps a shell-like source filename out of the generated local path", () => {
    const localDataDirectory = "/tmp/clipper/.local-data";
    const path = safeFilePath({
      localDataDirectory,
      bucket: "uploads",
      originalFilename: "../source; rm -rf /.mp4",
      id: "0a7d8d6f-8c77-4f7d-8c3e-a0140750e4a9",
    });

    expect(path).toBe(
      "/tmp/clipper/.local-data/uploads/0a7d8d6f-8c77-4f7d-8c3e-a0140750e4a9.mp4",
    );
    expect(path).not.toContain("../");
    expect(path).not.toContain(";");
  });
});

describe("renderExport", () => {
  it("removes a partial output and returns a safe error when media probing fails", async () => {
    const localDataDirectory = await mkdtemp(join(tmpdir(), "clipper-data-"));
    const inputPath = join(localDataDirectory, "uploads", "input.mp4");
    const outputPath = join(localDataDirectory, "exports", "output.mp4");

    await mkdir(join(localDataDirectory, "exports"), { recursive: true });
    await writeFile(outputPath, "partial file");

    await expect(
      renderExport(
        {
          projectId: "4cc2f80c-00c0-4b46-a6dd-8915499ad0a3",
          startSeconds: 0,
          endSeconds: 10,
          preset: "vertical-9:16",
          inputPath,
          outputPath,
        },
        {
          redisUrl: "redis://127.0.0.1:6379",
          localDataDirectory,
          ffmpegPath: "ffmpeg",
          ffprobePath: "clipper-missing-ffprobe",
        },
      ),
    ).rejects.toThrow("Unable to export video.");

    await expect(import("node:fs/promises").then(({ access }) => access(outputPath))).rejects.toThrow();
    await rm(localDataDirectory, { recursive: true, force: true });
  });
});
