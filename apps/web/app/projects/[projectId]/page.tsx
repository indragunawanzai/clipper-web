import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { VideoEditor } from "../../../components/video-editor";
import { getProject } from "../../../lib/projects";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const project = await getProject((await params).projectId);
  if (!project) notFound();
  return <AppShell><Link className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white" href="/"><ArrowLeft className="size-4" />Back to projects</Link><div className="mt-8"><p className="text-sm font-medium text-violet-300">Clip editor</p><h1 className="mt-2 break-words text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">{project.sourceFilename}</h1><p className="mt-2 text-sm text-slate-400">{Math.round(project.durationSeconds)} seconds available to trim.</p></div><VideoEditor project={project} /></AppShell>;
}
