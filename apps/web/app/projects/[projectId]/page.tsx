import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoEditor } from "../../../components/video-editor";
import { getProject } from "../../../lib/projects";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const project = await getProject((await params).projectId);
  if (!project) notFound();
  return <main><Link href="/">← Projects</Link><h1>{project.sourceFilename}</h1><p>{Math.round(project.durationSeconds)} seconds available</p><VideoEditor project={project} /></main>;
}
