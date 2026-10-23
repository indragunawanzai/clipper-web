import { describe, expect, it } from "vitest";
import { createProjectSchema } from "./project";

describe("createProjectSchema", () => {
  it("accepts a local project record", () => {
    const result = createProjectSchema.safeParse({
      id: "4cc2f80c-00c0-4b46-a6dd-8915499ad0a3",
      sourceFilename: "recording.mp4",
      sourcePath: ".local-data/uploads/4cc2f80c.mp4",
      createdAt: "2026-10-23T06:00:00.000Z",
      durationSeconds: 90,
      latestExportStatus: "queued",
    });

    expect(result.success).toBe(true);
  });
});
