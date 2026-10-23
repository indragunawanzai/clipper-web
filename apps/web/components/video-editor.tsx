"use client";

import { useState } from "react";

import type { Project } from "@clipper/shared";
import { ExportStatus } from "./export-status";

type VideoEditorProps = {
  project: Project;
};

export function VideoEditor({ project }: VideoEditorProps) {
  const [startSeconds, setStartSeconds] = useState(0);
  const [endSeconds, setEndSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const isValidRange = endSeconds > startSeconds && endSeconds <= project.durationSeconds;

  async function submitExport() {
    if (!isValidRange) return;

    setError(null);
    const response = await fetch(`/api/projects/${project.id}/exports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startSeconds, endSeconds, preset: "vertical-9:16" }),
    });

    if (!response.ok) {
      setError("Could not queue the export. Adjust the range and try again.");
      return;
    }

    const result = (await response.json()) as { jobId: string };
    setJobId(result.jobId);
  }

  return (
    <section>
      <p>Preset: <strong>9:16 vertical</strong></p>
      <label>
        Start time
        <input aria-label="Start time" min="0" max={project.durationSeconds} onChange={(event) => setStartSeconds(Number(event.target.value))} type="number" value={startSeconds} />
      </label>
      <label>
        End time
        <input aria-label="End time" min="0" max={project.durationSeconds} onChange={(event) => setEndSeconds(Number(event.target.value))} type="number" value={endSeconds} />
      </label>
      <button disabled={!isValidRange} onClick={submitExport} type="button">Export clip</button>
      {jobId ? <ExportStatus jobId={jobId} projectId={project.id} /> : null}
      {error ? <p role="alert">{error}</p> : null}
    </section>
  );
}
