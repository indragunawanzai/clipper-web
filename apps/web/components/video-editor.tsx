"use client";

import { useState } from "react";
import { Clapperboard, Scissors, TimerReset } from "lucide-react";

import type { Project } from "@clipper/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <Card className="overflow-hidden bg-card"><div className="flex aspect-video items-center justify-center bg-[radial-gradient(circle_at_center,rgba(139,92,246,.25),transparent_38%),linear-gradient(135deg,#11111a,#0b0c11)]"><div className="text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white/8 text-violet-200"><Clapperboard className="size-6" /></span><p className="mt-4 font-medium">Source preview</p><p className="mt-1 text-sm text-muted-foreground">Video playback will appear here next.</p></div></div><CardContent className="flex items-center justify-between gap-3 p-4 text-sm text-muted-foreground"><span className="truncate">{project.sourceFilename}</span><Badge variant="secondary">9:16 export</Badge></CardContent></Card>
      <Card className="bg-card"><CardHeader className="border-b border-border"><CardTitle className="flex items-center gap-2 text-base"><Scissors className="size-4 text-violet-300" />Create your clip</CardTitle></CardHeader><CardContent className="grid gap-5 p-5"><p className="text-sm leading-6 text-muted-foreground">Choose a start and end time. The export is centered and cropped for portrait video.</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"><label className="grid gap-2 text-sm font-medium">Start time<Input aria-label="Start time" min="0" max={project.durationSeconds} onChange={(event) => setStartSeconds(Number(event.target.value))} type="number" value={startSeconds} /></label><label className="grid gap-2 text-sm font-medium">End time<Input aria-label="End time" min="0" max={project.durationSeconds} onChange={(event) => setEndSeconds(Number(event.target.value))} type="number" value={endSeconds} /></label></div><div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground"><TimerReset className="size-4 text-violet-300" />Maximum source duration: {Math.round(project.durationSeconds)} seconds</div><Button disabled={!isValidRange} onClick={submitExport} size="lg" type="button"><Scissors className="size-4" />Export clip</Button>{jobId ? <ExportStatus jobId={jobId} projectId={project.id} /> : null}{error ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{error}</p> : null}</CardContent></Card>
    </section>
  );
}
