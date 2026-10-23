import Link from "next/link";
import { Clapperboard, FileVideo, LayoutDashboard, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AppShellProps = { children: ReactNode; className?: string };

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-card/80 px-4 py-5 lg:flex">
        <Link className="flex items-center gap-3 px-2" href="/">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-violet-500/20"><Clapperboard className="size-5" /></span>
          <span className="font-semibold tracking-tight">Clipper</span>
        </Link>
        <nav aria-label="Primary navigation" className="mt-10 grid gap-1 text-sm">
          <Link className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 font-medium" href="/"><LayoutDashboard className="size-4" />Projects</Link>
          <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" href="/projects/new"><FileVideo className="size-4" />New project</Link>
        </nav>
        <div className="mt-auto rounded-xl border border-border bg-muted/50 p-3 text-xs leading-5 text-muted-foreground"><Sparkles className="mb-2 size-4 text-violet-300" />Your media stays local while this MVP is running on your computer.</div>
      </aside>
      <main className={cn("mx-auto min-h-svh w-full max-w-7xl px-5 py-6 sm:px-8 lg:ml-64 lg:max-w-none lg:px-10 lg:py-10", className)}>
        <header className="mb-8 flex items-center justify-between lg:hidden">
          <Link className="flex items-center gap-2 font-semibold" href="/"><span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Clapperboard className="size-4" /></span>Clipper</Link>
          <Link className="text-sm text-muted-foreground hover:text-foreground" href="/projects/new">New project</Link>
        </header>
        {children}
      </main>
    </div>
  );
}
