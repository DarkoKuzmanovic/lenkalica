## Phase 4 Complete: Security hardening

Successfully implemented comprehensive security measures across the entire codebase, preventing path traversal, XSS, and unauthorized access to write endpoints.

**Files created/changed:**

- src/utils/validation.ts (new)
- src/lib/markdown.ts
- src/lib/articles.ts
- src/lib/shorts.ts
- src/lib/comics.ts
- src/app/api/articles/route.ts
- src/app/api/shorts/route.ts
- src/app/api/comics/route.ts
- src/app/api/comics/[id]/route.ts
- src/app/api/posts/create/route.ts
- src/app/api/shorts/create/route.ts
- src/app/api/upload-image/route.ts
- src/app/api/generate-metadata/route.ts
- src/app/api/podcasts/route.ts
- src/app/api/search/route.ts
- package.json (added rehype-sanitize)

**Functions created/changed:**

- `isSafeContentId()` - NEW: Validates content IDs against path traversal
- `parsePaginationParams()` - NEW: Validates and clamps pagination parameters
- `sanitizeFilename()` - NEW: Removes dangerous characters from filenames
- `isAuthorized()` - NEW: API key authentication for production
- `renderMarkdownToHtml()` - Added HTML sanitization with rehype-sanitize
- `getArticleById()` - Added ID validation
- `getShortById()` - Added ID validation
- `getComicMetadataPath()` - Added ID validation
- All write endpoint handlers - Added auth, validation, file type checks

**Tests created/changed:**

- None (no test framework)

**Review Status:** APPROVED

**Security Improvements:**

1. 🛡️ **Path Traversal Prevention**: Strict regex validation (alphanumeric + dash/underscore only) for all content IDs before filesystem operations
2. 🔒 **XSS Mitigation**: HTML sanitization via rehype-sanitize with custom schema allowing safe content formatting while blocking dangerous tags/attributes
3. 🔐 **Authentication**: All write/cost endpoints require API key in production (posts, shorts, comics, uploads, AI generation)
4. ✅ **Input Validation**: Required fields checked, filenames sanitized, file types validated with MIME + extension allowlists
5. 📊 **Pagination Security**: All paginated routes validate and clamp page/limit parameters (max 50-100 per route)
6. 🚫 **Information Disclosure**: Removed stack traces and raw responses from error payloads
7. 📁 **File Upload Security**: Type validation (images: jpg/png/webp, audio: mp3/wav), size limits (10MB), sanitized filenames

**Git Commit Message:**

```
feat: Implement comprehensive security hardening

Security improvements:
- Add path traversal protection with strict content ID validation
- Implement HTML sanitization in markdown pipeline (rehype-sanitize)
- Add API key authentication for all write/cost endpoints
- Add file upload validation (type, size, filename sanitization)
- Validate and clamp pagination parameters across all routes
- Remove stack traces and sensitive data from error responses
- Add centralized validation utilities module

Protects against path traversal, XSS, unauthorized access, and
malicious file uploads. All write endpoints now require authentication
in production environments.
```
