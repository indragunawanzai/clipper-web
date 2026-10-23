# Dark Creator Dashboard UI

## Intent

Turn the existing functional local video-clipper flow into a coherent, desktop-first creator dashboard. The UI should make the next action obvious—create a project, upload an owned video, select a clip range, and export it—without changing the existing local-only workflow.

## Goals

- Apply one dark visual system across the project list, upload, and editor pages.
- Make upload and export actions prominent and easy to scan.
- Preserve the current routes, API calls, validation, and accessible labels used by tests.
- Remain responsive for narrow browser windows.

## Non-goals

- No authentication, cloud storage, new editor features, or API changes.
- No CapCut-style timeline, waveform, or video-preview implementation in this styling pass.

## Approaches considered

1. Minimal light dashboard: fast but does not match a video-creator product.
2. Dark creator dashboard: selected. A clear high-contrast workspace with a compact sidebar, cards, and an accent color makes the MVP feel like a focused editing tool without feature scope creep.
3. CapCut-like editor: intentionally deferred because a timeline/preview system requires additional product and streaming work.

## Design

- Tailwind CSS v4 provides global tokens and responsive utility styling; shadcn/ui provides repository-owned `Button`, `Card`, `Input`, and `Badge` primitives.
- A reusable `AppShell` provides a compact brand rail, workspace navigation, and responsive content frame.
- Home becomes a dashboard with an action-oriented hero, project counter, and project cards.
- Upload becomes a centered drop-zone-like card while retaining the native file input and existing ownership notice.
- The editor becomes a two-column workspace: source summary/preview placeholder on the left, clip range and export controls on the right. On narrow screens it stacks vertically.
- Typography uses the existing app font stack; colours use neutral dark surfaces, white text, subdued metadata, and a single violet accent exposed as Tailwind/shadcn design tokens.
- Interactive controls retain visible focus indicators, disabled styles, and sufficient contrast.

## Validation

- Existing upload and video-editor tests must continue to pass.
- Web type check, lint, and a production build must pass with Redis running.
