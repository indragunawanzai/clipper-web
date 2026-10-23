"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

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
    return <Button className="w-full" render={<a href={`/api/projects/${projectId}/download`} /> as never}><CheckCircle2 className="size-4" />Download exported MP4</Button>;
  }
  if (status.status === "failed") {
    return <p role="alert">{status.error ?? "Export failed. Try again."}</p>;
  }
  return <p className="flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin text-violet-300" />Exporting your 9:16 clip…</p>;
}
