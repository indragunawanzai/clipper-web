import Link from "next/link";
import { ArrowUpRight, Plus, Scissors, WandSparkles } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectList } from "../components/project-list";
import { listProjects } from "../lib/projects";

export default async function Home() {
  const projects = await listProjects();

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-8 sm:px-10 sm:py-12">
        <div className="absolute -right-20 -top-28 size-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <Badge className="mb-5 bg-violet-400/15 text-violet-200 hover:bg-violet-400/15"><WandSparkles className="mr-1 size-3" />Local video workspace</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Turn your videos into vertical clips.</h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground">Upload an MP4 or MOV, select the moment you need, and export a centered 9:16 cut—all on your computer.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Link className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90" href="/projects/new"><Plus className="size-4" />New video project</Link><a className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground" href="#projects">View projects <ArrowUpRight className="size-4" /></a></div>
        </div>
      </section>
      <section className="mt-9 grid gap-4 md:grid-cols-3"><Card className="bg-card/60"><CardContent className="p-5"><Scissors className="mb-6 size-5 text-violet-300" /><p className="text-2xl font-semibold">{projects.length}</p><p className="mt-1 text-sm text-muted-foreground">Video projects</p></CardContent></Card><Card className="bg-card/60 md:col-span-2"><CardContent className="flex h-full items-center gap-4 p-5"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300"><WandSparkles className="size-5" /></span><div><p className="font-medium">Made for one clear outcome</p><p className="mt-1 text-sm text-muted-foreground">Crop one selected range into a portrait 9:16 MP4 clip.</p></div></CardContent></Card></section>
      <section className="mt-10" id="projects"><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-sm font-medium text-violet-300">Workspace</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Your projects</h2></div><Link className="text-sm font-medium text-muted-foreground hover:text-foreground" href="/projects/new">Create project</Link></div><ProjectList projects={projects} /></section>
    </AppShell>
  );
}
