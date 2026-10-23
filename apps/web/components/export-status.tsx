"use client";

import { useEffect, useState } from "react";

type ExportStatusProps = { jobId: string; projectId: string };

type JobStatus = { status: "processing" | "completed" | "failed"; error?: string };

export function ExportStatus({ jobId, projectId }: ExportStatusProps) {
  const [status, setStatus] = useState<JobStatus>({ status: "processing" });

  useEffect(() => {
    let active = true;
    const poll = async () => {
      const response = await fetch(`/api/jobs/${jobId}`);
      if (!response.ok || !active) return;
      const nextStatus = (await response.json()) as JobStatus;
      setStatus(nextStatus);
    };
    void poll();
    const timer = window.setInterval(() => void poll(), 2000);
    return () => { active = false; window.clearInterval(timer); };
  }, [jobId]);

  if (status.status === "completed") {
    return <a href={`/api/projects/${projectId}/download`}>Download exported MP4</a>;
  }
  if (status.status === "failed") {
    return <p role="alert">{status.error ?? "Export failed. Try again."}</p>;
  }
  return <p>Exporting your 9:16 clip…</p>;
}
