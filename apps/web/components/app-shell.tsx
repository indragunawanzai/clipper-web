import Link from "next/link";
import { Clapperboard, FilePlus2, FolderOpen, LayoutDashboard, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AppShellProps = { children: ReactNode; className?: string };

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="min-h-svh bg-[#0b0d12] text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col border-r border-white/8 bg-[#0e1017] px-4 py-5 lg:flex">
        <Link className="flex items-center gap-3 rounded-xl px-2 py-2" href="/">
          <span className="grid size-10 place-items-center rounded-xl bg-violet-500 text-white shadow-lg shadow-violet-500/20"><Clapperboard className="size-5" /></span>
          <span><span className="block text-sm font-semibold tracking-tight">Clipper</span><span className="block text-xs text-slate-500">Local video studio</span></span>
        </Link>
        <p className="mt-10 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">Workspace</p>
        <nav aria-label="Primary navigation" className="mt-3 grid gap-1 text-sm">
          <Link className="flex items-center gap-3 rounded-xl bg-white/8 px-3 py-2.5 font-medium text-white" href="/"><LayoutDashboard className="size-4 text-violet-300" />Projects</Link>
          <Link className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white" href="/projects/new"><FilePlus2 className="size-4" />New project</Link>
        </nav>
        <div className="mt-auto rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-xs leading-5 text-slate-400"><Sparkles className="mb-3 size-4 text-violet-300" />Your media stays on this computer while this local MVP is running.</div>
      </aside>
      <main className={cn("min-h-svh w-full lg:pl-72", className)}>
        <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-10">
        <header className="mb-8 flex items-center justify-between border-b border-white/8 pb-4 lg:mb-10 lg:border-0 lg:pb-0">
          <Link className="flex items-center gap-2.5 font-semibold lg:hidden" href="/"><span className="grid size-9 place-items-center rounded-xl bg-violet-500 text-white"><Clapperboard className="size-4" /></span><span>Clipper</span></Link>
          <div className="hidden lg:block"><p className="text-sm font-medium text-slate-200">Creator workspace</p><p className="mt-1 text-xs text-slate-500">Create focused vertical clips from your own videos.</p></div>
          <Link className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-violet-400" href="/projects/new"><FolderOpen className="size-4" />New project</Link>
        </header>
        {children}
        </div>
      </main>
    </div>
  );
}
