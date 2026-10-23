// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";

import { ProjectList } from "./project-list";

const project = {
  id: "4cc2f80c-00c0-4b46-a6dd-8915499ad0a3",
  sourceFilename: "launch-video.mp4",
  sourcePath: "/local/launch-video.mp4",
  createdAt: "2026-10-23T06:00:00.000Z",
  durationSeconds: 60,
};

describe("ProjectList", () => {
  it("shows the empty-state guidance when there are no projects", () => {
    render(createElement(ProjectList, { projects: [] }));

    expect(screen.getByText("No projects yet")).toBeTruthy();
    expect(screen.getByText("Upload an owned video, choose the highlight, then export one clean vertical clip.")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Create your first project" }).getAttribute("href")).toBe("/projects/new");
  });

  it("renders each project as a dashboard card that links to its workspace", () => {
    render(createElement(ProjectList, { projects: [project] }));

    expect(screen.getByTestId("project-card")).toBeTruthy();
    expect(screen.getByRole("link", { name: "launch-video.mp4" }).getAttribute("href")).toBe(`/projects/${project.id}`);
  });
});
