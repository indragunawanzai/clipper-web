# Clipper Local MVP Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local, working web workflow that uploads an owned video, trims and center-crops it to 9:16 through an FFmpeg worker, and makes the resulting MP4 downloadable.

**Architecture:** `apps/web` owns the dashboard and HTTP route handlers. `apps/worker` owns BullMQ consumption and FFmpeg rendering. Both depend on `@clipper/shared` for schemas and queue contracts, use Redis for project/job metadata, and access the same ignored `.local-data/` directory during local development.

**Tech Stack:** Next.js 16, TypeScript, React, Tailwind CSS, Zod, BullMQ, Redis, Docker Compose, Node.js 22, FFmpeg/ffprobe, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-23-local-mvp-foundation-design.md`

## Global Constraints

- Process only locally uploaded MP4/MOV videos owned or authorized by the user; no third-party-link downloader/importer.
- Reject source files larger than 100 MB.
- Store source/output assets only under ignored `.local-data/` paths generated from UUIDs.
- Use `vertical-9:16` as the only export preset and center-crop it.
- Never execute FFmpeg in a Next.js request handler; export must flow through BullMQ.
- Require Node.js 22+, pnpm 11+, Docker Desktop, FFmpeg, and ffprobe.
- Do not add cloud storage, authentication, payment, music, captions, translation, or AI features in this plan.

## Review Focus

- An upload with an unsupported extension, MIME type, or size above 100 MB must be rejected before any local file is persisted — Task 3 tests.
- A request with negative start time, equal start/end time, or end time beyond the probed duration must fail without a queue job — Tasks 1 and 4 tests.
- User filenames containing path separators or shell metacharacters must never affect the source/output path passed to FFmpeg — Task 3 tests.
- A failed `ffprobe` or FFmpeg process must result in a terminal `failed` job state with a safe error message — Task 2 tests.
- A browser refresh while an export runs must recover current project/job state from Redis and must not enqueue the same export again — Tasks 3 and 4 tests.

---

### Task 1: Add shared project and export contracts

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/src/project.ts`
- Create: `packages/shared/src/export.ts`
- Create: `packages/shared/src/export.test.ts`
- Modify: `pnpm-workspace.yaml`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Produces `Project`, `ExportStatus`, `ExportPreset`, `createProjectSchema`, and `createExportRequestSchema` from `@clipper/shared`.
- `createExportRequestSchema` accepts `{ projectId, startSeconds, endSeconds, preset: "vertical-9:16" }`.
- `createExportRequestSchema` rejects negative start time and `endSeconds <= startSeconds`.
- Later tasks use these schemas before reading/writing Redis or queueing work.

- [ ] **Step 1: Write failing schema tests**

Create `packages/shared/src/export.test.ts` with tests named `accepts a vertical export request`, `rejects a negative start time`, and `rejects an end time that is not after the start time`.

- [ ] **Step 2: Run the shared test to verify it fails**

Run: `pnpm --filter @clipper/shared test`

Expected: FAIL because `@clipper/shared` and its test script do not exist.

- [ ] **Step 3: Create the shared package and schemas**

Implement `createExportRequestSchema` with Zod and export exact TypeScript types inferred from schemas. Add a `test` script using Vitest and a `check-types` script using `tsc --noEmit`.

- [ ] **Step 4: Run shared verification**

Run: `pnpm --filter @clipper/shared test && pnpm --filter @clipper/shared check-types`

Expected: all schema tests pass and TypeScript exits 0.

- [ ] **Step 5: Commit the contract package**

```bash
git add packages/shared package.json pnpm-workspace.yaml pnpm-lock.yaml
git commit -m "feat: add shared clipper contracts"
```

### Task 2: Create the local Redis queue and FFmpeg worker

**Files:**
- Create: `docker-compose.yml`
- Create: `.env.example`
- Create: `apps/worker/package.json`
- Create: `apps/worker/tsconfig.json`
- Create: `apps/worker/src/config.ts`
- Create: `apps/worker/src/queue.ts`
- Create: `apps/worker/src/media.ts`
- Create: `apps/worker/src/worker.ts`
- Create: `apps/worker/src/media.test.ts`
- Modify: `.gitignore`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes `ExportJobData` and `ExportStatus` from `@clipper/shared`.
- Produces an `exports` BullMQ queue and `renderExport(job: ExportJobData): Promise<CompletedExport>`.
- `renderExport` probes duration before constructing the FFmpeg argument array; it must not use a shell command string.
- `docker-compose.yml` provides Redis on `localhost:6379` for local development.

- [ ] **Step 1: Write failing media-command tests**

In `apps/worker/src/media.test.ts`, cover `buildVerticalExportArgs` with a normal trim/crop request and `safeFilePath` with a filename containing `../` and shell-like characters. Assert the command is an argument array and generated paths remain inside `.local-data/`.

- [ ] **Step 2: Run the worker test to verify it fails**

Run: `pnpm --filter @clipper/worker test`

Expected: FAIL because the worker package and media helpers do not exist.

- [ ] **Step 3: Implement worker configuration, queue, and FFmpeg helpers**

Create `config.ts` to read `REDIS_URL`, `LOCAL_DATA_DIR`, `FFMPEG_PATH`, and `FFPROBE_PATH`. Add defaults suitable for local development. Implement `buildVerticalExportArgs(inputPath, outputPath, startSeconds, endSeconds)` using FFmpeg’s center-crop filter for 9:16. Implement duration probing through `spawn`, never `exec`.

- [ ] **Step 4: Implement queue consumption and failure handling**

Create `worker.ts` to start a BullMQ Worker for `exports`. On success, save a completed result/status. On probe or render failure, save the terminal `failed` status with a non-sensitive error message and do not leave a partial file available for download.

- [ ] **Step 5: Run worker verification**

Run: `pnpm --filter @clipper/worker test && pnpm --filter @clipper/worker check-types`

Expected: all worker tests pass and TypeScript exits 0.

- [ ] **Step 6: Commit the local worker**

```bash
git add apps/worker docker-compose.yml .env.example .gitignore pnpm-lock.yaml
git commit -m "feat: add local video export worker"
```

### Task 3: Add local project storage and upload API

**Files:**
- Create: `apps/web/lib/config.ts`
- Create: `apps/web/lib/local-files.ts`
- Create: `apps/web/lib/projects.ts`
- Create: `apps/web/lib/projects.test.ts`
- Create: `apps/web/app/api/projects/route.ts`
- Create: `apps/web/app/api/projects/[projectId]/route.ts`
- Modify: `apps/web/package.json`
- Modify: `apps/web/next.config.js`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes `createProjectSchema` and `Project` from `@clipper/shared`.
- `saveUpload(file: File): Promise<Project>` validates extension/MIME/size, generates a UUID, persists source video under `.local-data/uploads/<uuid>`, probes duration, and stores project metadata in Redis.
- `GET /api/projects` returns local projects ordered newest first.
- `GET /api/projects/:projectId` returns a project or 404.
- Later tasks use `Project.id` to request exports.

- [ ] **Step 1: Write failing local-storage tests**

In `apps/web/lib/projects.test.ts`, test rejection for a 101 MB mock file, an unsupported image file, and a filename such as `../../bad;name.mp4`. Test that an accepted upload produces a UUID-based path under the configured local data directory.

- [ ] **Step 2: Run storage tests to verify they fail**

Run: `pnpm --filter web test -- projects.test.ts`

Expected: FAIL because the local project storage module and test script do not exist.

- [ ] **Step 3: Implement configuration and safe local files**

Implement `local-files.ts` using `crypto.randomUUID()` for paths, not original filenames. Add `.local-data/` to `.gitignore`. Keep the original display filename only as Redis metadata.

- [ ] **Step 4: Implement Redis-backed project storage and routes**

Store project JSON under `project:<id>` and maintain ordered IDs in a Redis sorted set. Use route handlers to accept `multipart/form-data`, delegate to `saveUpload`, and return JSON with no filesystem paths exposed to the client.

- [ ] **Step 5: Run web upload verification**

Run: `pnpm --filter web test -- projects.test.ts && pnpm --filter web check-types && pnpm --filter web lint`

Expected: upload validation tests pass, type check exits 0, and lint has zero warnings.

- [ ] **Step 6: Commit project upload support**

```bash
git add apps/web .gitignore pnpm-lock.yaml
git commit -m "feat: add local video project uploads"
```

### Task 4: Add export API and job-status contract

**Files:**
- Create: `apps/web/lib/exports.ts`
- Create: `apps/web/lib/exports.test.ts`
- Create: `apps/web/app/api/projects/[projectId]/exports/route.ts`
- Create: `apps/web/app/api/jobs/[jobId]/route.ts`
- Create: `apps/web/app/api/projects/[projectId]/download/route.ts`
- Modify: `apps/web/package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes `Project`, `createExportRequestSchema`, and queue names from Tasks 1–3.
- `queueExport(request): Promise<{ jobId: string }>` probes known project duration, refuses invalid end time, adds one BullMQ job, and records the latest job ID on the project.
- `GET /api/jobs/:jobId` returns normalized status `{ id, status, progress?, error? }`.
- `GET /api/projects/:projectId/download` streams only a completed output file belonging to that project.

- [ ] **Step 1: Write failing export tests**

Test that an end time larger than the project duration does not call `queue.add`, that a valid request queues one `exports` job, and that a repeated request with the same export parameters returns the existing active job rather than creating a duplicate.

- [ ] **Step 2: Run export tests to verify they fail**

Run: `pnpm --filter web test -- exports.test.ts`

Expected: FAIL because the export module does not exist.

- [ ] **Step 3: Implement export queueing and normalized status lookup**

Use a deterministic job ID derived from `projectId`, start time, end time, and preset while a job is queued/processing. Query BullMQ for status; do not expose raw BullMQ or Redis internals to the browser.

- [ ] **Step 4: Implement guarded download route**

Only return a file if the project’s latest export reports `completed` and the resolved path is beneath `.local-data/exports`. Otherwise return 404/409 without directory details.

- [ ] **Step 5: Run export verification**

Run: `pnpm --filter web test -- exports.test.ts && pnpm --filter web check-types && pnpm --filter web lint`

Expected: export tests pass, type check exits 0, and lint has zero warnings.

- [ ] **Step 6: Commit export API support**

```bash
git add apps/web pnpm-lock.yaml
git commit -m "feat: queue local video exports"
```

### Task 5: Build the local dashboard, upload screen, and editor

**Files:**
- Create: `apps/web/app/projects/new/page.tsx`
- Create: `apps/web/app/projects/[projectId]/page.tsx`
- Create: `apps/web/components/project-list.tsx`
- Create: `apps/web/components/upload-form.tsx`
- Create: `apps/web/components/video-editor.tsx`
- Create: `apps/web/components/export-status.tsx`
- Create: `apps/web/components/video-editor.test.tsx`
- Modify: `apps/web/app/page.tsx`
- Modify: `apps/web/app/page.module.css`
- Modify: `apps/web/app/globals.css`
- Modify: `apps/web/app/layout.tsx`

**Interfaces:**
- Consumes project and export API responses from Tasks 3–4.
- `VideoEditor` accepts `{ project: Project }`, allows a user to set start/end seconds, provides only a fixed 9:16 preset, and calls `POST /api/projects/:id/exports`.
- `ExportStatus` polls a known job ID until it reaches `completed` or `failed`, then shows a download action or recoverable error.

- [ ] **Step 1: Write failing editor interaction tests**

In `video-editor.test.tsx`, verify the export action remains disabled when end time is not greater than start time and that a valid submission posts `vertical-9:16` with numeric start/end values.

- [ ] **Step 2: Run editor tests to verify they fail**

Run: `pnpm --filter web test -- video-editor.test.tsx`

Expected: FAIL because `VideoEditor` and the web test setup do not exist.

- [ ] **Step 3: Implement the dashboard and upload route**

Replace the temporary homepage with a project list and clear empty state. Add `/projects/new` with ownership copy, accepted formats, maximum size, upload progress, and validation errors returned by the API.

- [ ] **Step 4: Implement the project editor and export status UI**

Show the source video with native controls, numeric start/end fields constrained by project duration, a visible `9:16` preset, and job polling. Show download only after a completed job and a clear retry message after failure.

- [ ] **Step 5: Run end-to-end local manual verification**

Run Redis with `docker compose up -d redis`, run the worker, run `pnpm --filter web dev`, then upload a small owned MP4 and verify an exported 9:16 MP4 can be downloaded.

Expected: one completed export with a playable vertical MP4.

- [ ] **Step 6: Run final automated verification**

Run: `pnpm lint && pnpm check-types && pnpm build`

Expected: all workspace lint, type checks, and builds exit 0.

- [ ] **Step 7: Commit the local MVP interface**

```bash
git add apps/web
git commit -m "feat: add local clip export dashboard"
```

## Self-Review

- **Spec coverage:** Tasks 1–4 cover safe upload, Redis metadata, queueing, FFmpeg worker, status, and download. Task 5 covers the dashboard and editor. Cloud services and monetization are intentionally excluded as non-goals.
- **Step scan:** Every task begins with a failing test, defines the exact module contract, implements a narrow unit, verifies it, and ends in a focused commit.
- **Type consistency:** `Project`, `ExportJobData`, `ExportPreset`, and `ExportStatus` originate in `@clipper/shared`; web and worker import them rather than redefining structures.
- **Review focus:** Each listed edge case is assigned to Tasks 2–4 test suites, with a manual real-video check in Task 5.
- **Proportion:** The plan specifies interfaces, ownership, checks, and boundaries without prescribing component implementation details.
