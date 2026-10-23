"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FileVideo, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UploadForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setUploading(true); setError(null);
    const response = await fetch("/api/projects", { method: "POST", body: formData });
    const result = await response.json() as { id?: string; error?: string };
    if (!response.ok || !result.id) { setError(result.error ?? "Upload failed."); setUploading(false); return; }
    router.push(`/projects/${result.id}`);
  }

  return <form className="grid gap-5" onSubmit={submit}>
    <label className="grid cursor-pointer gap-5 rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-6 transition hover:border-violet-400/60 hover:bg-violet-400/[0.04] sm:p-8"><span className="grid size-11 place-items-center rounded-xl border border-violet-400/15 bg-violet-400/10 text-violet-300"><FileVideo className="size-5" /></span><span><span className="block font-semibold text-white">Select your source video</span><span className="mt-1 block text-sm text-slate-400">MP4 or MOV, maximum 100 MB</span></span><Input accept="video/mp4,video/quicktime,.mp4,.mov" className="cursor-pointer border-white/10 bg-[#0b0d12] text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-white/8 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-white/12" name="file" required type="file" /></label>
    <p className="text-sm leading-6 text-slate-400">Upload only video you own or are authorized to edit. Files are stored locally for this MVP.</p>
    <Button className="w-full bg-violet-500 text-white hover:bg-violet-400 sm:w-fit" disabled={uploading} size="lg" type="submit"><Upload className="size-4" />{uploading ? "Uploading…" : "Upload video"}</Button>
    {error ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{error}</p> : null}
  </form>;
}
