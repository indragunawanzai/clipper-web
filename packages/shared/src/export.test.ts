import { describe, expect, it } from "vitest";
import { createExportRequestSchema } from "./export.js";

describe("createExportRequestSchema", () => {
  it("accepts a vertical export request", () => {
    const result = createExportRequestSchema.safeParse({
      projectId: "4cc2f80c-00c0-4b46-a6dd-8915499ad0a3",
      startSeconds: 5,
      endSeconds: 35,
      preset: "vertical-9:16",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a negative start time", () => {
    const result = createExportRequestSchema.safeParse({
      projectId: "4cc2f80c-00c0-4b46-a6dd-8915499ad0a3",
      startSeconds: -1,
      endSeconds: 35,
      preset: "vertical-9:16",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an end time that is not after the start time", () => {
    const result = createExportRequestSchema.safeParse({
      projectId: "4cc2f80c-00c0-4b46-a6dd-8915499ad0a3",
      startSeconds: 35,
      endSeconds: 35,
      preset: "vertical-9:16",
    });

    expect(result.success).toBe(false);
  });
});
