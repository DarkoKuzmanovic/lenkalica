# Lenkalica Project Memories

This file captures lessons learned, debugging insights, and solutions to tricky problems encountered during development.

## 2026-02-06: Vercel Runtime Limitations - Podcasts Not Showing in Production

### Problem

Podcasts worked perfectly on localhost but showed zero results on Vercel production deployment. The `/api/podcasts` endpoint was filtering out all articles.

### Root Cause

Runtime filesystem checks like `fs.existsSync(path.join(process.cwd(), "public", "audio", "file.mp3"))` and `fs.statSync()` always return `false` on Vercel serverless functions, even though the files exist and are served correctly.

**Why**: Vercel serves the `public/` directory via CDN — it's not available on the filesystem at runtime in serverless functions.

### Solution

Build-time manifest generation approach:

1. **Created prebuild script**: `scripts/generate-audio-manifest.mjs`
   - Runs automatically before every build via `"prebuild"` npm script
   - Scans `public/audio/` directory
   - Generates `src/lib/audio-manifest.json` with file names and sizes

2. **Updated runtime code** in `src/lib/articles.ts` and `src/app/api/podcast-xml/route.ts`:

   ```typescript
   import audioManifest from "./audio-manifest.json";
   const manifest = audioManifest as Record<string, { file: string; size: number }>;

   // Instead of: fs.existsSync(audioFilePath)
   const hasAudio = id in manifest;

   // Instead of: fs.statSync(audioFilePath).size
   const size = manifest[id]?.size ?? 0;
   ```

3. **Committed the manifest** to git so it's available during Vercel builds

### Prevention

**Pattern**: Any runtime filesystem checks on static assets in `public/` must use a build-time manifest approach on Vercel. Never use `fs.existsSync()`, `fs.statSync()`, or `fs.readFileSync()` on `public/` files in API routes or server components that run on Vercel serverless functions.

**Files Changed**:

- Created: `scripts/generate-audio-manifest.mjs`
- Created: `src/lib/audio-manifest.json`
- Modified: `package.json` (added prebuild script)
- Modified: `src/lib/articles.ts` (use manifest instead of fs.existsSync)
- Modified: `src/app/api/podcast-xml/route.ts` (use manifest for file sizes)

**Commit**: `471c31d - feat: Add audio manifest generation and integrate with article retrieval logic`

## 2026-02-07: Next.js 16 Upgrade

### Changes

Upgraded from Next.js 15.5.9 to Next.js 16.1.6 using the official `@next/codemod upgrade 16` command.

### Key Breaking Changes in Next.js 16

1. **Turbopack is now default** for `next dev` and `next build` (faster builds)
2. **`next lint` removed** — must use ESLint CLI directly (`eslint .`)
3. **`eslint` config option removed** from `next.config.js`
4. **middleware.ts renamed to proxy.ts** — not applicable (no middleware in this project)

### Migration Steps Performed

1. Ran `npx @next/codemod@canary upgrade 16` — updated Next.js, React, and related dependencies
2. Updated `package.json` lint script: `"next lint"` → `"eslint ."`
3. Rewrote `eslint.config.mjs` to use ESLint flat config with direct plugin imports (avoiding `@eslint/eslintrc` FlatCompat which had circular JSON issues)
4. Installed `@next/eslint-plugin-next` as dev dependency
5. Updated documentation to reflect Next.js 16

### Files Changed

- `package.json` — updated dependencies and lint script
- `eslint.config.mjs` — migrated to flat config format
- `.github/copilot-instructions.md` — version reference
- `CLAUDE.md` — version reference
- `README.md` — version reference
