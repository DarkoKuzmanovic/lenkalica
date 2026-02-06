# Plan: Repo Code Review Fixes (Duplicates, Bugs, Improvements)

**Created:** 2026-02-06
**Status:** Ready for Atlas Execution

## Summary

This plan turns the code review findings into a sequence of safe, incremental refactors and bug fixes.
The highest-impact items are: (1) broken podcast RSS generation due to conflicting `audioFile` semantics, (2) security hardening around path traversal + raw HTML rendering, and (3) Android/web audio state sync issues caused by platform detection and duplicated bridge code.

## Context & Analysis

### Key Findings (high impact)

- **Podcast RSS likely broken** because `src/lib/articles.ts` sets `audioFile` to an absolute GitHub raw URL, while `src/app/api/podcast-xml/route.ts` assumes `audioFile` is a local `/audio/...` path and attempts filesystem `stat` on it.
- **Podcasts list likely wrong** because `/api/podcasts` filters `article.audioFile` truthiness, but the lib always sets it.
- **Path traversal risk** because `getArticleById(id)` / `getShortById(id)` join `id` directly into a filesystem path.
- **XSS risk** because remark pipeline allows raw HTML (`rehypeRaw`) and the client injects rendered HTML via `dangerouslySetInnerHTML`. This becomes more serious if any write endpoints are exposed.
- **Android audio flash/race** because `useAndroidDetection()` only sets `isAndroid` after mount; `ConditionalAudioPlayer` can render the wrong player for a frame, causing mismatched playback/control state.

### Likely Duplicate Code

- Markdown rendering pipeline duplicated between `src/lib/articles.ts` and `src/lib/shorts.ts`.
- Manual pagination parsing/slicing duplicated across list API routes.
- Two article libs: `src/lib/articles.ts` (modern) and `src/app/lib/articles.ts` (legacy/duplicate).
- Player UI helpers duplicated across `src/components/AudioPlayer.tsx` and `src/components/AndroidAudioPlayer.tsx`.
- Scroll tracking duplicated across article and short detail pages.

### Relevant Files

- `src/lib/articles.ts` — article FS read + markdown-to-HTML pipeline + asset URL construction.
- `src/lib/shorts.ts` — shorts FS read + markdown-to-HTML pipeline + asset URL construction.
- `src/app/lib/articles.ts` — legacy duplicate article lib (appears unused).
- `src/app/api/podcast-xml/route.ts` — RSS generation and audio validation.
- `src/app/api/podcasts/route.ts` — podcasts list.
- `src/app/api/search/route.ts` — duplicates `getAllArticles()` call.
- `src/app/api/articles/route.ts`, `src/app/api/shorts/route.ts`, `src/app/api/comics/route.ts` — pagination duplication and missing validation.
- `src/app/api/posts/create/route.ts`, `src/app/api/shorts/create/route.ts`, `src/app/api/upload-image/route.ts` — writes to filesystem; needs hardening/clarity about production intent.
- `src/app/articles/[id]/ArticleContent.tsx`, `src/app/shorts/[id]/page.tsx` — HTML injection sinks.
- `src/context/AudioContext.tsx`, `src/components/ConditionalAudioPlayer.tsx`, `src/components/AndroidAudioPlayer.tsx`, `src/hooks/useAndroidDetection.ts` — Android/web audio switching and sync.
- `src/utils/androidMediaControls.ts`, `src/components/AndroidMediaSetup.tsx` — alternate Android bridge strategy (appears unused / dead).

### Constraints

- Repo currently appears to have **no test framework** configured.
- Next.js runtime may be serverless/read-only; avoid creating directories on read paths.

## Implementation Phases

### Phase 1: Remove obvious duplication and align imports

**Objective:** Reduce accidental inconsistency by removing or quarantining duplicate libs.

**Files to Modify/Create:**

- `src/app/lib/articles.ts`: remove or clearly mark unused; update imports if any exist.

**Steps:**

1. Search for imports of `src/app/lib/articles.ts`.
2. If unused, delete it; if used, migrate consumers to `src/lib/articles.ts` and then delete.
3. Run `npm run lint` and `npm run build`.

**Acceptance Criteria:**

- [ ] No remaining imports of `src/app/lib/articles.ts`.
- [ ] App builds and lints successfully.

---

### Phase 2: Decide and enforce `audioFile` semantics (fix podcast routes)

**Objective:** Make `audioFile` consistent across libs and API routes and fix podcast RSS.

**Decision (pick one):**

- **Option A (recommended):** `audioFile` is always a **public path** like `/audio/<file>.mp3` and is expected to exist under `public/audio`. (Works well with filesystem validation and RSS.)
- **Option B:** `audioFile` may be an **absolute URL** (GitHub raw/CDN). In this case, RSS must not attempt local `stat`, and duration must be computed differently (or omitted).

**Files to Modify/Create:**

- `src/lib/articles.ts`: set `audioFile` according to decision.
- `src/app/api/podcasts/route.ts`: filter “has audio” correctly (do not rely on truthy `audioFile` if always present).
- `src/app/api/podcast-xml/route.ts`: build `audioUrl` correctly and validate audio source per decision.

**Steps:**

1. Implement Option A or B consistently.
2. In `/api/podcast-xml`, ensure URL concatenation cannot produce `https://site.comhttps://...`.
3. Remove duplicate `stat` work (don’t validate twice).
4. Validate outputs manually by hitting `/api/podcast-xml` and checking a podcast client can subscribe.

**Acceptance Criteria:**

- [ ] `/api/podcast-xml` returns valid RSS with correct enclosure URLs.
- [ ] `/api/podcasts` returns only items with real audio.

---

### Phase 3: Extract shared markdown renderer + eliminate duplicated pipelines

**Objective:** Centralize remark/rehype config and reduce drift.

**Files to Modify/Create:**

- Create `src/lib/markdown.ts` (or `src/lib/content/markdown.ts`) exporting `renderMarkdownToHtml(markdown: string)`.
- Update `src/lib/articles.ts` and `src/lib/shorts.ts` to use it.

**Steps:**

1. Move the remark/rehype pipeline into a shared function.
2. Ensure output is unchanged for existing content (spot check a few pages).

**Acceptance Criteria:**

- [ ] Only one markdown pipeline exists.
- [ ] Articles and shorts render the same as before.

---

### Phase 4: Security hardening (path traversal, raw HTML, write endpoints)

**Objective:** Prevent obvious filesystem and XSS vulnerabilities and clarify production stance.

**Files to Modify/Create:**

- `src/lib/articles.ts`, `src/lib/shorts.ts`: validate/sanitize `id` before `path.join`.
- `src/app/api/articles/route.ts`, `src/app/api/shorts/route.ts`, `src/app/api/comics/route.ts`: clamp/validate `page` and `limit`.
- `src/app/api/posts/create/route.ts`, `src/app/api/shorts/create/route.ts`, `src/app/api/upload-image/route.ts`: validate required FormData, sanitize filenames, block `../` and absolute paths; decide whether these routes should exist in production.
- Markdown rendering decision:
  - If content can be influenced by untrusted input, remove `rehypeRaw` or add sanitization (e.g., `rehype-sanitize`) and restrict allowed tags.

**Steps:**

1. Add `isSafeContentId(id)` helper (strict regex allowlist) and use it.
2. Add `parsePaginationParams()` helper and reuse it.
3. Decide whether raw HTML in markdown is allowed; implement sanitize/remove accordingly.
4. Decide whether write endpoints are production; if yes, require auth and persistent storage; if no, disable in production builds.

**Acceptance Criteria:**

- [ ] Invalid `id` returns 400/404 without reading arbitrary files.
- [ ] Pagination cannot produce NaN/negative/huge slices.
- [ ] HTML injection risk is explicitly addressed (sanitized or trusted-only + protected write endpoints).

---

### Phase 5: Android/web audio correctness and dead code cleanup

**Objective:** Remove the initial wrong-player render on Android and make state sync robust.

**Files to Modify/Create:**

- `src/hooks/useAndroidDetection.ts`: initialize synchronously (client) and/or expose `mounted` state.
- `src/components/ConditionalAudioPlayer.tsx`: add mounted gating to avoid flashing wrong player.
- `src/components/AndroidAudioPlayer.tsx`: honor `playing` argument and guard against stale callbacks.
- `src/utils/androidDetection.ts`: make version-dependent Android methods optional in typing.
- Remove or consolidate dead bridge:
  - `src/utils/androidMediaControls.ts`
  - `src/components/AndroidMediaSetup.tsx`
    (unless there is an intentional third mode)

**Steps:**

1. Ensure Android detection is stable on first client render.
2. Add a “track token” or minimum URL check so callbacks cannot overwrite state for a different track.
3. Remove unused bridge strategy or add explicit support for it.

**Acceptance Criteria:**

- [ ] No player flash on Android.
- [ ] Rapid track switching cannot corrupt duration/currentTime.
- [ ] Only one Android bridge strategy remains (or the modes are explicit).

---

### Phase 6: Performance and correctness cleanups

**Objective:** Fix easy performance bugs and reduce full-content parsing on list endpoints.

**Files to Modify/Create:**

- `src/app/api/search/route.ts`: avoid calling `getAllArticles()` twice.
- `src/lib/comics.ts`: fix delete behavior; avoid `getComicById()` loading all comics if possible.
- Consider caching: memoize `getAllArticles/getAllShorts/getAllComics` in-process where safe.

**Steps:**

1. Refactor search route to reuse already-loaded data.
2. Fix comic delete to delete a local file path (not a URL) OR remove deletion if assets are remote-only.
3. Optional: split “list metadata” from “full HTML render” to avoid expensive remark processing for lists.

**Acceptance Criteria:**

- [ ] Search endpoint no longer double-loads articles.
- [ ] Comic deletion behavior matches the chosen storage model.

## Manual Verification Checklist (since no test framework)

- `npm run lint` passes.
- `npm run build` succeeds.
- Open a few article pages and short pages; confirm rendering matches expectations.
- On Android app: verify no initial wrong player, play/pause/seek works, and state stays consistent during fast track switches.
- Validate podcast feed in a podcast client.

## Open Questions

1. Should markdown support raw HTML?
   - **Option A:** Yes, content is trusted-only.
   - **Option B:** No, sanitize/strip HTML.
   - **Recommendation:** If any write endpoint is reachable without auth, choose Option B.

2. Are the write/upload endpoints intended for production?
   - **Option A:** Dev-only (disable in production).
   - **Option B:** Production (add auth, rate limits, persistent storage).
   - **Recommendation:** Clarify; serverless FS persistence is a common footgun.

3. Audio hosting model: local public assets vs GitHub raw?
   - **Recommendation:** Prefer local `/public/audio` for RSS correctness unless you intentionally want remote hosting.

## Risks & Mitigation

- **Risk:** Changing markdown sanitization could break existing posts.
  - **Mitigation:** Apply sanitization with an allowlist; spot-check existing content.
- **Risk:** Changing `audioFile` semantics affects multiple routes and clients.
  - **Mitigation:** Make change in one phase; add temporary compatibility if needed.

## Notes for Atlas

- Prioritize Phases 2 and 4: they are the most user-visible (podcasts) and highest-risk (security).
- Keep changes surgical; avoid broad refactors without a concrete win.
