import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { VideoEditor } from "./video-editor";

const project = {
  id: "4cc2f80c-00c0-4b46-a6dd-8915499ad0a3",
  sourceFilename: "source.mp4",
  sourcePath: "/local/source.mp4",
  createdAt: "2026-10-23T06:00:00.000Z",
  durationSeconds: 60,
};

describe("VideoEditor", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    cleanup();
  });

  it("disables export when the end time is not after the start time", () => {
    render(createElement(VideoEditor, { project }));

    const exportButton = screen.getByRole("button", { name: "Export clip" });

    expect(exportButton.hasAttribute("disabled")).toBe(true);
    expect(exportButton.getAttribute("data-slot")).toBe("button");
  });

  it("posts numeric times with the fixed vertical preset", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify({ jobId: "job-1" }), { status: 202 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ status: "processing" }), { status: 200 }));
    render(createElement(VideoEditor, { project }));

    await user.clear(screen.getByLabelText("End time"));
    await user.type(screen.getByLabelText("End time"), "30");
    await user.click(screen.getByRole("button", { name: "Export clip" }));

    expect(fetchMock).toHaveBeenCalledWith(
      `/api/projects/${project.id}/exports`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ startSeconds: 0, endSeconds: 30, preset: "vertical-9:16" }),
      }),
    );
  });
});
// @vitest-environment jsdom
