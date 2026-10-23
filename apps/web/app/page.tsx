import Link from "next/link";
import { ArrowRight, Plus, Scissors, Sparkles, WandSparkles } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectList } from "../components/project-list";
import { listProjects } from "../lib/projects";

export default async function Home() {
  const projects = await listProjects();

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#151725] px-6 py-8 sm:px-10 sm:py-10">
        <div className="absolute -right-16 -top-20 size-64 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-end">
          <div className="max-w-2xl">
            <Badge className="mb-5 border border-violet-300/15 bg-violet-400/10 text-violet-200 hover:bg-violet-400/10"><WandSparkles className="mr-1 size-3" />Local video workspace</Badge>
            <h1 className="text-balance text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">Make one focused clip from a longer video.</h1>
            <p className="mt-4 max-w-xl text-pretty text-sm leading-6 text-slate-400 sm:text-base">Upload an MP4 or MOV, select the moment you need, and export a centered 9:16 cut—all on your computer.</p>
            <div className="mt-7 flex flex-wrap gap-3"><Link className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-500 px-4 text-sm font-semibold text-white transition hover:bg-violet-400" href="/projects/new"><Plus className="size-4" />New video project</Link><a className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white" href="#projects">View projects <ArrowRight className="size-4" /></a></div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/15 p-4"><div className="flex items-center justify-between text-xs text-slate-400"><span>Output</span><span className="rounded-full bg-violet-400/15 px-2 py-1 font-medium text-violet-200">9:16</span></div><div className="mt-6 flex items-end gap-1.5"><span className="h-5 flex-1 rounded-sm bg-violet-400/35" /><span className="h-9 flex-1 rounded-sm bg-violet-400/55" /><span className="h-7 flex-1 rounded-sm bg-violet-300/70" /><span className="h-12 flex-1 rounded-sm bg-violet-400" /><span className="h-8 flex-1 rounded-sm bg-violet-400/45" /><span className="h-4 flex-1 rounded-sm bg-violet-400/25" /></div><p className="mt-4 text-sm font-medium text-white">One video. One clear result.</p></div>
        </div>
      </section>
      <section className="mt-5 grid gap-4 md:grid-cols-[11rem_1fr]"><Card className="border-white/8 bg-[#12151e]"><CardContent className="p-5"><Scissors className="mb-7 size-5 text-violet-300" /><p className="text-3xl font-semibold text-white">{projects.length}</p><p className="mt-1 text-sm text-slate-400">Video projects</p></CardContent></Card><Card className="border-white/8 bg-[#12151e]"><CardContent className="flex h-full items-center gap-4 p-5"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300"><Sparkles className="size-5" /></span><div><p className="font-medium text-white">A focused, local workflow</p><p className="mt-1 text-sm text-slate-400">Your source files stay on this computer while you create a portrait MP4 cut.</p></div></CardContent></Card></section>
      <section className="mt-10" id="projects"><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-sm font-medium text-violet-300">Workspace</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">Your projects</h2></div><Link className="inline-flex items-center gap-1 text-sm font-semibold text-violet-300 hover:text-violet-200" href="/projects/new">Create project <ArrowRight className="size-4" /></Link></div><ProjectList projects={projects} /></section>
    </AppShell>
  );
}
