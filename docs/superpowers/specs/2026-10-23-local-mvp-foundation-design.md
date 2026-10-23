# Clipper Local MVP Foundation Design

## Intent

Build the first working local version of Clipper: a web application that turns
a video owned by the user into a short, vertical MP4 clip. This foundation is
for validating the editing and export workflow before introducing cloud
storage, user accounts, AI features, subscriptions, or payment processing.

## Goals

- Keep the repository as a pnpm/Turborepo monorepo.
- Add a Next.js dashboard in `apps/web` for the local workflow.
- Add an independent Node.js worker in `apps/worker` that renders exports with
  FFmpeg.
- Add `packages/shared` for TypeScript models and Zod validation shared by the
  web app and worker.
- Use Redis and BullMQ locally so rendering runs outside the web request.
- Support one source-video workflow: upload an MP4 or MOV, trim it, crop it to
  a center-cropped 9:16 frame, export an MP4, and download the result.

## Non-goals

- Importing/downloading video from YouTube, TikTok, or other third-party links.
- Authentication, cloud storage, database persistence, billing, music library,
  automatic captions, translation, or AI highlight detection.
- Multi-user collaboration, production deployment, and mobile applications.
- Editing copyrighted video that the user does not own or have permission to
  process.

## User Flow

1. A local user opens the dashboard and creates a project by uploading an MP4
   or MOV file they own.
2. The application validates the file type and a 100 MB maximum size, then
   saves it under a generated UUID within an ignored local data directory.
3. The editor shows a video preview and accepts start time, end time, and a
   fixed vertical 9:16 export preset.
4. The user requests an export. The web app adds an `ExportJob` to Redis.
5. The worker reads the job, uses `ffprobe` to validate duration, then calls
   FFmpeg to trim and center-crop the video into an MP4 file.
6. The dashboard polls the job status and exposes the completed output for
   download.

## Architecture

```text
apps/web (Next.js)
  ├─ Route handlers: upload, projects, export, job status, download
  ├─ Redis: project metadata and BullMQ job status
  └─ .local-data/: source files and exported files

Redis (Docker)
  └─ BullMQ `exports` queue

apps/worker (Node.js)
  ├─ BullMQ worker
  ├─ ffprobe input validation
  └─ FFmpeg trim/crop/export
```

The web application must never run FFmpeg within a request. It creates jobs
only; the worker owns rendering. Local files use generated UUID names rather
than user-provided filenames. `.local-data/` is ignored by Git.

## Shared Contract

`packages/shared` owns the following contracts:

- `Project`: id, source filename, source path, created timestamp, duration,
  and latest export state.
- `CreateProjectInput`: validated upload metadata.
- `ExportJobData`: project id, input path, output path, start seconds, end
  seconds, and `vertical-9:16` preset.
- `ExportStatus`: `queued`, `processing`, `completed`, or `failed`.

The HTTP layer and BullMQ worker both validate untrusted data using Zod before
using it.

## Local Dependencies

- Node.js 22+
- pnpm 11+
- Docker Desktop for Redis
- FFmpeg and ffprobe installed on the host running `apps/worker`

The application starts with local infrastructure only. No provider account or
secret is required for this phase.

## Constraints and Safety

- Only accept MP4 and MOV uploads with a maximum 100 MB size.
- Validate that `startSeconds >= 0` and `endSeconds > startSeconds` before
  queuing an export; reject an end time beyond the measured video duration.
- Use generated paths only; never pass a user-provided filename directly to
  FFmpeg.
- Restrict the export preset to center-cropped 9:16 in this phase.
- Return a clear failed status when FFmpeg cannot read or export an input.

## Alternatives Considered

1. **Browser-only FFmpeg WebAssembly:** cheapest to host, but video memory and
   performance are unreliable for larger uploads and it does not exercise a
   sellable rendering architecture.
2. **Render inside a Next.js API route:** simpler at first, but long-running
   video processing is a poor fit for web requests and cannot scale safely.
3. **Selected: Next.js plus a queued Node.js worker:** keeps the editing UI
   responsive, mirrors the future production design, and can be developed
   locally without cloud cost.

## Future Evolution

After the local workflow is proven, replace the local data directory with
object storage, replace Redis project metadata with PostgreSQL, add
authentication, then introduce captions, translation, payment, and cloud
workers one capability at a time.
