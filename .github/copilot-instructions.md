# Copilot Instructions for Lenkalica

> **Note**: For lessons learned and debugging insights, see [memories.md](memories.md)

## Project Overview

Lenkalica is a Next.js 16 content blog with sophisticated dual-mode audio capabilities. It features a unique hybrid web/Android app architecture where the same codebase serves both web browsers and an integrated Android webview with native media controls.

## Key Architecture Patterns

### Dual-Mode Audio System

The core innovation is seamless audio switching between web and Android native players:

- **AudioContext** (`src/context/AudioContext.tsx`) - Global state with platform-aware playback
- **Platform Detection** - `useAndroidDetection()` and `isLenkalicaApp()` determine runtime environment
- **Conditional Components** - `AndroidAudioPlayer` vs `AudioPlayer` based on platform
- **Native Interface** - `window.Android` methods for media notifications and system controls

```typescript
// Example: Platform-aware audio handling
if (isAndroid) {
  window.Android.loadAndPlayAudio(url, title);
} else {
  // Fallback to HTML5 audio
}
```

### Content Architecture

- **Numbered Naming Convention**: `001-Title.md` → `/audio/001-Title.mp3` → `/images/covers/001-Title.png`
- **Frontmatter Processing**: `gray-matter` for metadata, `remark` pipeline for Markdown to HTML
- **File-Based Routing**: `[id]` patterns in `src/app/articles/[id]/page.tsx`
- **API Routes**: `/api/articles`, `/api/podcasts`, `/api/shorts` for content delivery

### State Management

- **Global Audio State**: React Context with platform-specific callbacks
- **Android Callbacks**: `window.updateAudioContextState()` for native state sync
- **Theme System**: `next-themes` with DaisyUI theme switching

## Development Workflow

### Build Commands

```bash
npm run build  # Includes 'rimraf .next' for clean builds
npm run dev    # Development with hot reload
npm run lint   # ESLint validation
```

### Content Management

1. Create markdown file in `content/articles/` with numbered prefix
2. Add corresponding audio file in `public/audio/`
3. Add cover image in `public/images/covers/`
4. Follow frontmatter schema with title, date, author, tags, excerpt

### Android Integration Testing

- Use `isLenkalicaApp()` to detect Android webview environment
- Test both `window.Android` native methods and HTML5 fallbacks
- Verify media notifications and system controls work properly

## Critical Dependencies

- **DaisyUI + Tailwind**: Primary UI framework - use DaisyUI components first
- **gray-matter + remark**: Content processing pipeline for Markdown
- **next-themes**: Theme switching with persistent storage
- **framer-motion**: UI animations and transitions
- **@google/generative-ai**: Content generation via `/api/generate-content`

## File Patterns

### Audio Components

- Conditional rendering: `{isAndroid ? <AndroidAudioPlayer /> : <AudioPlayer />}`
- Global context usage: `const { playAudio, pauseAudio } = useAudioContext()`

### API Routes

- Pagination pattern: `?page=1&limit=6` query parameters
- Error handling: Always return proper HTTP status codes
- Content processing: Use shared `lib/articles.ts` functions

### Styling

- DaisyUI components: `btn`, `card`, `modal`, `drawer`, `navbar`
- Responsive: Mobile-first with Tailwind breakpoints
- Themes: Support both light/dark via theme provider

## External Integrations

- **Image Domains**: Configured for science/education sources (NASA, Quanta Magazine, etc.)
- **CSP Headers**: Allows inline styles/scripts for content rendering
- **RSS Generation**: `/api/podcast-xml` for podcast feed distribution

## TypeScript Configuration

- Strict mode enabled with build error ignoring (production deployment)
- Path aliases: `@/*` maps to `src/*`
- Window interface extensions for Android methods in global declarations

## Deployment Notes

- **Vercel Optimized**: Next.js configuration includes image optimization domains
- **Production Builds**: TypeScript errors ignored (see `next.config.js`)
- **Static Assets**: Organized in `public/` with structured folders for audio/images
- **Runtime Filesystem**: See [memories.md](memories.md) for Vercel `public/` directory limitations and solutions
