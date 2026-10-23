import Link from "next/link";
import type { Project } from "@clipper/shared";
import { Clock3, FileVideo, MoveUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function ProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <Card className="border-dashed bg-card/50"><CardContent className="flex min-h-52 flex-col items-center justify-center px-6 text-center"><span className="mb-4 grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><FileVideo className="size-5" /></span><h3 className="font-medium">No projects yet</h3><p className="mt-1 max-w-sm text-sm text-muted-foreground">Upload an owned video to start your first clip.</p></CardContent></Card>;
  }

  return <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{projects.map((project) => <li key={project.id}><Card className="group h-full overflow-hidden border-border/80 bg-card transition hover:-translate-y-0.5 hover:border-violet-400/50 hover:shadow-lg hover:shadow-black/20" data-testid="project-card"><CardContent className="p-0"><div className="flex aspect-video items-end bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,.55),transparent_34%),linear-gradient(135deg,#16151f,#0f1017)] p-4"><span className="grid size-10 place-items-center rounded-xl bg-black/30 text-violet-200 backdrop-blur"><FileVideo className="size-5" /></span></div><div className="relative p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><Link className="block truncate font-medium text-foreground after:absolute after:inset-0" href={`/projects/${project.id}`}>{project.sourceFilename}</Link><div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="size-3.5" />{Math.round(project.durationSeconds)} sec</div></div><Badge variant="secondary" className="shrink-0 text-[10px]">MP4</Badge></div><div className="mt-5 flex items-center gap-1 text-sm font-medium text-violet-300">Open editor <MoveUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div></div></CardContent></Card></li>)}</ul>;
}
