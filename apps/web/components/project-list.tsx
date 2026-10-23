import Link from "next/link";
import type { Project } from "@clipper/shared";
import { ArrowRight, Clock3, FileVideo, MoveUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function ProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <Card className="border-white/8 bg-[#12151e]"><CardContent className="flex min-h-72 flex-col items-center justify-center px-6 text-center"><span className="mb-5 grid size-14 place-items-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-300"><FileVideo className="size-6" /></span><h3 className="text-lg font-semibold text-white">No projects yet</h3><p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">Upload an owned video, choose the highlight, then export one clean vertical clip.</p><Link className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400" href="/projects/new">Create your first project <ArrowRight className="size-4" /></Link></CardContent></Card>;
  }

  return <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{projects.map((project) => <li key={project.id}><Card className="group h-full overflow-hidden border-white/8 bg-[#12151e] transition hover:-translate-y-0.5 hover:border-violet-400/50 hover:shadow-xl hover:shadow-black/20" data-testid="project-card"><CardContent className="p-0"><div className="flex aspect-[16/9] items-end justify-between bg-[radial-gradient(circle_at_18%_15%,rgba(139,92,246,.45),transparent_30%),linear-gradient(135deg,#1b1a28,#10121a)] p-4"><span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-black/20 text-violet-200 backdrop-blur"><FileVideo className="size-5" /></span><Badge variant="secondary" className="border-white/10 bg-black/25 text-[10px] text-slate-200">MP4</Badge></div><div className="relative p-5"><div className="min-w-0"><Link className="block truncate font-medium text-white after:absolute after:inset-0" href={`/projects/${project.id}`}>{project.sourceFilename}</Link><div className="mt-2 flex items-center gap-2 text-xs text-slate-400"><Clock3 className="size-3.5" />{Math.round(project.durationSeconds)} sec source</div></div><div className="mt-6 flex items-center gap-1 text-sm font-semibold text-violet-300">Open editor <MoveUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div></div></CardContent></Card></li>)}</ul>;
}
