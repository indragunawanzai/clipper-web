import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { UploadForm } from "../../../components/upload-form";

export default function NewProjectPage() {
  return (
    <AppShell className="max-w-5xl">
      <Link className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground" href="/"><ArrowLeft className="size-4" />Projects</Link>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start"><div><p className="text-sm font-medium text-violet-300">New project</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em]">Upload a video</h1><p className="mt-3 max-w-xl leading-7 text-muted-foreground">Choose a source video you own or are authorized to edit. It remains on this computer while you work.</p><Card className="mt-8 border-border bg-card"><CardContent className="p-6 sm:p-8"><UploadForm /></CardContent></Card></div><Card className="bg-card/60"><CardContent className="p-5"><span className="grid size-10 place-items-center rounded-xl bg-violet-400/10 text-violet-300"><Upload className="size-5" /></span><h2 className="mt-5 font-medium">Before you start</h2><ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground"><li>MP4 or MOV only</li><li>Maximum 100 MB</li><li>Export one vertical 9:16 clip</li></ul></CardContent></Card></div>
    </AppShell>
  );
}
