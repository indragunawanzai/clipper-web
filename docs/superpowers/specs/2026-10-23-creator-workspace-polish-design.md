# Creator Workspace Polish Design

## Intent

Turn the local Clipper MVP from a functional scaffold into a calm, credible creator workspace. The product has one main job: turn an owned source video into one vertical clip. The interface must make that next action unmistakable.

## Goals

- Give desktop users a persistent, legible navigation rail and page header.
- Make the dashboard feel intentionally composed: compact hero, clear primary action, useful empty state.
- Keep the upload and editor flows visually consistent with the dashboard.
- Preserve all local-only upload/export behavior, accessible labels, and API payloads.

## Non-goals

- No product analytics, account system, or new video-editing capability.
- No functional video preview or timeline in this polish pass.
- No changes to project, upload, export, or worker APIs.

## Chosen Direction

Use a dark, high-contrast creator workspace with one violet primary action. The desktop shell is a stable left rail; narrow screens use a compact top bar. Cards use restrained borders and elevation, not large decorative gradients. The dashboard hero explains the local workflow in one short block, then directs users to create a project.

## UX Rules

- Every empty state has a nearby path to `New project`.
- On desktop, navigation remains visible without taking over the content area.
- On narrow screens, content stacks without horizontal overflow.
- File input, number inputs, links, and buttons show visible keyboard focus.
- Long source filenames truncate inside their card or editor metadata area.
