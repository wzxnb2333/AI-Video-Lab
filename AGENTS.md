# Repository Guidelines

## Project Structure & Module Organization
- `src/`: React + TypeScript frontend.
  - `pages/`: route-level views (`upscale.tsx`, `queue.tsx`).
  - `components/`: UI/layout/widgets (`layout/`, `video/`, `ui/`).
  - `hooks/`: stateful logic (`useProcessing`, `useVideoInfo`).
  - `lib/`: processing pipeline and Tauri shell integrations (`ffmpeg.ts`, `pipeline.ts`).
  - `stores/`: Zustand state stores.
  - `types/`: shared domain types and model configs.
- `src-tauri/`: Rust/Tauri host app, capabilities, and bundle config.
- `resources/models/`: bundled executables and model assets (ffmpeg, waifu2x, rife).
- `dist/`: production build output (generated).

## Build, Test, and Development Commands
- `npm run dev`: start Vite frontend dev server.
- `npm run tauri dev`: run desktop app in Tauri dev mode.
- `npm run build`: TypeScript build + Vite production bundle.
- `npm run tauri build`: create distributable desktop bundle.
- `npm run lint`: run ESLint checks.
- `npm run preview`: preview the built frontend.

## Coding Style & Naming Conventions
- Language: TypeScript with React function components.
- Prefer existing style in repo: concise functions, early returns, and explicit types for public interfaces.
- Indentation: 2 spaces; keep lines readable and avoid deeply nested logic.
- Naming:
  - Components/types: `PascalCase`
  - hooks: `useXxx`
  - files: `kebab-case` (e.g., `title-bar.tsx`, `settings-page.tsx`)
- Run `npm run lint` before opening a PR.

## Testing Guidelines
- There is currently no dedicated automated test suite.
- Minimum validation for each change:
  1. `npm run lint`
  2. `npm run build`
  3. Manual Tauri flow check for impacted features (queue status, model selection, file dialogs, window controls).
- If adding tests, place them near the feature (`src/**`) and use clear names like `feature-name.spec.ts`.

## Commit & Pull Request Guidelines
- Git history is not available in this workspace snapshot; use Conventional Commits going forward:
  - `feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`
- PRs should include:
  - What changed and why
  - Affected paths (e.g., `src/lib/pipeline.ts`)
  - Validation steps and results
  - Screenshots/GIFs for UI changes

## Security & Configuration Tips
- Do not commit private/local paths or secrets.
- Keep model/binary references inside `resources/models/` and validate existence before invoking commands.
- When updating permissions, keep `src-tauri/capabilities/default.json` least-privilege.
