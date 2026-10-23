import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { UploadForm } from "../../../components/upload-form";

export default function NewProjectPage() {
  return (
    <AppShell>
      <Link className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white" href="/"><ArrowLeft className="size-4" />Back to projects</Link>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start"><div><p className="text-sm font-medium text-violet-300">New project</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">Start with your source video.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">Choose a video you own or are authorized to edit. It stays on this computer while you create your clip.</p><Card className="mt-8 border-white/8 bg-[#12151e]"><CardContent className="p-5 sm:p-8"><UploadForm /></CardContent></Card></div><Card className="border-white/8 bg-[#12151e]"><CardContent className="p-5"><span className="grid size-10 place-items-center rounded-xl border border-violet-400/15 bg-violet-400/10 text-violet-300"><Upload className="size-5" /></span><h2 className="mt-5 font-semibold text-white">Before you start</h2><ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-400"><li>MP4 or MOV source file</li><li>Up to 100 MB</li><li>Export one vertical 9:16 clip</li></ul></CardContent></Card></div>
    </AppShell>
  );
}
