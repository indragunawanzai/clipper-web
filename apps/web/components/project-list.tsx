import Link from "next/link";
import type { Project } from "@clipper/shared";

export function ProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <p>No projects yet. Upload an owned video to start your first clip.</p>;
  return <ul>{projects.map((project) => <li key={project.id}><Link href={`/projects/${project.id}`}>{project.sourceFilename}</Link><span>{Math.round(project.durationSeconds)} seconds</span></li>)}</ul>;
}
