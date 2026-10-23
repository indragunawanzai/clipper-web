# Dark Creator Dashboard UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the existing local video-clipper dashboard a cohesive responsive dark creator interface without changing product behavior.

**Architecture:** Install Tailwind CSS v4 and initialize shadcn/ui in `apps/web`. Add a shared app shell for navigation and content framing, then compose existing home, upload, and editor components from Tailwind utilities and repository-owned shadcn primitives. Existing API routes, form names, accessible labels, and export request payloads remain unchanged.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS v4, shadcn/ui, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-23-dark-creator-dashboard-design.md`

## Global Constraints

- Preserve local-only upload and export workflow; no API or data-model changes.
- Keep existing accessible labels and export payload `{ startSeconds, endSeconds, preset: "vertical-9:16" }`.
- Use Tailwind CSS v4 plus shadcn/ui primitives; do not introduce another component library.
- Use the existing dark colour direction with violet as the sole primary accent.
- Stack layouts cleanly on narrow browser widths.

## Review Focus

- Narrow screens: sidebar navigation must not consume or horizontally overflow the editor workspace.
- Keyboard focus: file input, numeric controls, and buttons retain a visible focus indicator.
- Disabled export: visual disabled state remains distinct while the existing disabled behavior continues.
- Long filenames: project cards and editor metadata must wrap or truncate without breaking the layout.
- Empty projects: home retains a clear call to action and empty-state copy.

---

## File Structure

- Create: `apps/web/components/app-shell.tsx` — shared brand rail, navigation, page frame.
- Create: `apps/web/components/ui/*` — shadcn/ui primitives owned by this repository.
- Create: `apps/web/components/app-shell.tsx` — responsive shell styled with Tailwind utilities.
- Modify: `apps/web/app/globals.css` and add `apps/web/postcss.config.mjs` — Tailwind v4 and dark design tokens.
- Modify: `apps/web/app/page.tsx`, `apps/web/app/projects/new/page.tsx`, `apps/web/app/projects/[projectId]/page.tsx` — compose existing content inside the shared shell.
- Modify: `apps/web/app/page.module.css` — home dashboard layout and card treatment.
- Modify: existing components to attach semantic styling classes only.

### Task 1: Shared dashboard shell and project overview

**Files:**
- Create: `apps/web/components/app-shell.tsx`
- Create: `apps/web/components/ui/button.tsx`, `card.tsx`, `input.tsx`, `badge.tsx`
- Create: `apps/web/lib/utils.ts`
- Modify: `apps/web/app/globals.css`
- Create: `apps/web/postcss.config.mjs`
- Modify: `apps/web/app/page.tsx`
- Modify: `apps/web/app/page.module.css`
- Modify: `apps/web/components/project-list.tsx`
- Create: `apps/web/components/project-list.module.css`

**Interfaces:**
- Produces: `AppShell({ children }: { children: ReactNode })` used by all three page routes.
- Consumes: `Project[]` unchanged from `@clipper/shared`.

- [ ] **Step 1: Add a component test for the project-list empty state and a rendered project link**

Assert the empty-state copy remains visible for `[]` and the source filename links to `/projects/<id>` for one project.

- [ ] **Step 2: Run the new project-list test to verify it fails**

Run: `pnpm --filter web test -- project-list.test.tsx`
Expected: FAIL because the test file does not exist.

- [ ] **Step 3: Install Tailwind v4 and add the selected shadcn primitives, then implement `AppShell` and the dashboard/project-card styling**

Use semantic navigation links, Tailwind classes, and shadcn `Card`, `Badge`, and `Button` primitives. Preserve Home’s existing `listProjects()` call and CTA route.

- [ ] **Step 4: Run the project-list test to verify it passes**

Run: `pnpm --filter web test -- project-list.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/components/ui apps/web/components/app-shell.tsx apps/web/components/project-list.tsx apps/web/app/globals.css apps/web/app/page.tsx apps/web/components/project-list.test.tsx apps/web/lib/utils.ts apps/web/postcss.config.mjs apps/web/package.json pnpm-lock.yaml
git commit -m "feat(web): add dark creator dashboard shell"
```

### Task 2: Upload and editor workspace styling

**Files:**
- Modify: `apps/web/app/projects/new/page.tsx`
- Modify: `apps/web/app/projects/[projectId]/page.tsx`
- Modify: `apps/web/components/upload-form.tsx`
- Modify: `apps/web/components/video-editor.tsx`
- Modify: `apps/web/components/export-status.tsx`

**Interfaces:**
- Consumes: `AppShell`, unchanged `UploadForm`, `VideoEditor`, and `ExportStatus` props.
- Produces: a responsive upload card and two-column editor workspace; tests keep the existing labels and button name.

- [ ] **Step 1: Extend the video-editor test with a UI-state assertion**

Assert the export button remains disabled at initial render and carries the disabled attribute after styling classes are attached.

- [ ] **Step 2: Run the editor test to verify the assertion fails**

Run: `pnpm --filter web test -- video-editor.test.tsx`
Expected: FAIL because the expected styling state is not present.

- [ ] **Step 3: Attach the shared shell and shadcn/Tailwind layout to upload, editor, and export status components**

Maintain native file input behavior, labels `Start time`/`End time`, and the export request body. Use a non-functional preview placeholder and a responsive stack below the desktop breakpoint.

- [ ] **Step 4: Run the editor test to verify it passes**

Run: `pnpm --filter web test -- video-editor.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/projects apps/web/components/upload-form.tsx apps/web/components/video-editor.tsx apps/web/components/video-editor.test.tsx apps/web/components/export-status.tsx
git commit -m "feat(web): style upload and editor workspace"
```

### Task 3: Full UI regression verification

**Files:**
- Modify: only files required by failures found during verification.

- [ ] **Step 1: Run the full web quality suite**

Run: `pnpm --filter web test && pnpm --filter web check-types && pnpm --filter web lint`
Expected: all commands exit 0.

- [ ] **Step 2: Verify local runtime with Docker Redis available**

Run: `pnpm dev`, visit `/`, `/projects/new`, and an existing project route; verify project list, file picker, and export controls render.

- [ ] **Step 3: Commit any verification-only corrections**

```bash
git add <corrected-files>
git commit -m "fix(web): polish creator dashboard states"
```
