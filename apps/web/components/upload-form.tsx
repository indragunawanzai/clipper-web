"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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

  return <form onSubmit={submit}>
    <label>Video file<input accept="video/mp4,video/quicktime,.mp4,.mov" name="file" required type="file" /></label>
    <p>Upload only video you own or are authorized to edit. MP4 or MOV, maximum 100 MB.</p>
    <button disabled={uploading} type="submit">{uploading ? "Uploading…" : "Upload video"}</button>
    {error ? <p role="alert">{error}</p> : null}
  </form>;
}
