## Phase 2 Complete: Fix audioFile semantics & podcast RSS

Successfully fixed broken podcast RSS generation and made audioFile handling consistent with remote GitHub URLs.

**Files created/changed:**

- src/lib/articles.ts
- src/app/api/podcast-xml/route.ts

**Functions created/changed:**

- `getAllArticles()` - Added local file existence check before setting audioFile URL
- `getArticleById()` - Added local file existence check before setting audioFile URL
- `escapeUrlForXmlAttribute()` - NEW: Properly escapes URLs for XML attributes
- `escapeXml()` - Simplified by removing URL bypass parameter
- `isRemoteUrl()` - NEW: Detects remote URLs (http/https)
- `getLocalAudioSize()` - NEW: Gets audio file size from local filesystem

**Tests created/changed:**

- None (no test framework)

**Review Status:** APPROVED

**Key Improvements:**

1. Fixed RSS XML validation - URLs now properly escaped in attributes (& → &amp;, " → &quot;)
2. Fixed invalid URL concatenation bug (no longer prepends baseUrl to remote URLs)
3. Conditional audioFile assignment - only set when file actually exists locally
4. Removed duplicate filesystem stat operations in RSS generation
5. Conditional length attribute - omitted when file size is 0 or unknown

**Git Commit Message:**

```
fix: Correct podcast RSS generation and audioFile semantics

- Add file existence check before setting audioFile URL in article lib
- Fix RSS XML escaping for URLs in attributes (prevent invalid XML)
- Fix URL concatenation bug (use remote URLs directly, not baseUrl + url)
- Make enclosure length attribute conditional (omit when size is 0)
- Remove duplicate filesystem stat operations in RSS route
- Add URL escaping and remote URL detection helpers

Fixes broken podcast RSS feeds that were generating invalid XML
and incorrect audio URLs
```
