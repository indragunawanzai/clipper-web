# Creator Workspace Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Clipper local MVP feel like a polished, responsive creator workspace while preserving every existing workflow.

**Architecture:** Refine the existing Tailwind and repository-owned shadcn primitives rather than adding a new library. `AppShell` owns responsive navigation, pages own hierarchy and copy, and reusable components retain their existing behavior with updated presentation.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS v4, shadcn/ui primitives, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-23-creator-workspace-polish-design.md`

## Global Constraints

- Keep upload and export APIs, accessible labels, file limits, and export payload unchanged.
- Use the existing Tailwind and shadcn component source only.
- Keep violet as the only primary accent in the dark theme.
- Support narrow screens without horizontal overflow.

## Review Focus

- Desktop navigation has visible brand, links, and clear active state.
- Mobile navigation does not leave a blank rail or overlap page content.
- Empty project state offers a direct new-project action.
- Long filenames remain contained in cards and editor metadata.
- Inputs and buttons retain focus visibility and disabled state.

### Task 1: Strengthen the shell and dashboard hierarchy

**Files:**
- Modify: `apps/web/app/globals.css`
- Modify: `apps/web/components/app-shell.tsx`
- Modify: `apps/web/app/page.tsx`
- Modify: `apps/web/components/project-list.tsx`
- Test: `apps/web/components/project-list.test.tsx`

**Interfaces:**
- Consumes: existing `AppShell`, `ProjectList`, and `Project[]` interfaces.
- Produces: the same routes and project links with stronger visual hierarchy.

- [ ] **Step 1: Add a failing empty-state CTA assertion**

Assert the empty project state offers an accessible link to `/projects/new`.

- [ ] **Step 2: Run the project-list test and verify it fails**

Run: `pnpm --filter web test -- project-list.test.tsx`
Expected: FAIL because the empty-state CTA does not yet exist.

- [ ] **Step 3: Implement the responsive shell, dashboard hierarchy, and empty-state CTA**

Use the existing primitives. Make desktop navigation explicit, add a page-level header, and keep the dashboard CTA within the content flow.

- [ ] **Step 4: Run the project-list test and verify it passes**

Run: `pnpm --filter web test -- project-list.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/globals.css apps/web/components/app-shell.tsx apps/web/app/page.tsx apps/web/components/project-list.tsx apps/web/components/project-list.test.tsx
git commit -m "feat(web): refine creator workspace dashboard"
```

### Task 2: Align upload and editor surfaces

**Files:**
- Modify: `apps/web/app/projects/new/page.tsx`
- Modify: `apps/web/app/projects/[projectId]/page.tsx`
- Modify: `apps/web/components/upload-form.tsx`
- Modify: `apps/web/components/video-editor.tsx`
- Test: `apps/web/components/video-editor.test.tsx`

**Interfaces:**
- Consumes: unchanged upload and export component props.
- Produces: a consistent upload and editing workspace that keeps the current controls functional.

- [ ] **Step 1: Add a failing control-state assertion**

Assert the disabled export button still includes the existing accessible name after the workspace styling changes.

- [ ] **Step 2: Run the editor test and verify it fails**

Run: `pnpm --filter web test -- video-editor.test.tsx`
Expected: FAIL because the new state marker is not rendered.

- [ ] **Step 3: Implement consistent upload/editor hierarchy and responsive control groups**

Retain native input behavior and the current export request body. Give preview, trim inputs, and export state distinct visual grouping.

- [ ] **Step 4: Run the editor test and verify it passes**

Run: `pnpm --filter web test -- video-editor.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/projects apps/web/components/upload-form.tsx apps/web/components/video-editor.tsx apps/web/components/video-editor.test.tsx
git commit -m "feat(web): polish upload and editor workspace"
```

### Task 3: Verify polished UI

**Files:**
- Modify: only files required by verification failures.

- [ ] **Step 1: Run web tests, type check, lint, and build**

Run: `pnpm --filter web test && pnpm --filter web check-types && pnpm --filter web lint && pnpm --filter web build`
Expected: all checks pass.

- [ ] **Step 2: Verify the active dev server routes**

Visit `/` and `/projects/new`; confirm the creator dashboard and upload screen have coherent spacing and visible primary actions.
