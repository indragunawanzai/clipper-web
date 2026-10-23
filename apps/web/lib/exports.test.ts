import { describe, expect, it } from "vitest";

import { queueExport, type ExportDependencies } from "./exports";

const project = {
  id: "4cc2f80c-00c0-4b46-a6dd-8915499ad0a3",
  sourceFilename: "source.mp4",
  sourcePath: "/tmp/clipper/.local-data/uploads/source.mp4",
  createdAt: "2026-10-23T06:00:00.000Z",
  durationSeconds: 60,
};

function dependencies(existingState?: "waiting" | "active") {
  let adds = 0;
  const value: ExportDependencies = {
    localDataDirectory: "/tmp/clipper/.local-data",
    projectStore: {
      get: async () => project,
      list: async () => [project],
      save: async () => undefined,
    },
    queue: {
      add: async () => {
        adds += 1;
        return { id: "new-export" };
      },
      getJob: async () => (existingState ? { getState: async () => existingState } : null),
    },
  };

  return { dependencies: value, getAdds: () => adds };
}

describe("queueExport", () => {
  it("does not queue an export beyond the source duration", async () => {
    const { dependencies: testDependencies, getAdds } = dependencies();

    await expect(
      queueExport(
        {
          projectId: project.id,
          startSeconds: 0,
          endSeconds: 61,
          preset: "vertical-9:16",
        },
        testDependencies,
      ),
    ).rejects.toThrow("duration");

    expect(getAdds()).toBe(0);
  });

  it("queues one valid vertical export", async () => {
    const { dependencies: testDependencies, getAdds } = dependencies();

    await queueExport(
      { projectId: project.id, startSeconds: 0, endSeconds: 30, preset: "vertical-9:16" },
      testDependencies,
    );

    expect(getAdds()).toBe(1);
  });

  it("returns an active matching job without adding another export", async () => {
    const { dependencies: testDependencies, getAdds } = dependencies("active");

    const result = await queueExport(
      { projectId: project.id, startSeconds: 0, endSeconds: 30, preset: "vertical-9:16" },
      testDependencies,
    );

    expect(result.jobId).toBeDefined();
    expect(getAdds()).toBe(0);
  });
});
