# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 project for a content blog called "Lenkalica" featuring articles, podcasts, comics, and shorts about culture, history, and geography. The site includes audio capabilities with special Android app integration for enhanced audio playback through native Android media controls.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Architecture & Key Components

### Core Structure
- **Next.js App Router**: Using the `src/app` directory structure with modern Next.js 15 features
- **Content Management**: Markdown articles stored in `content/articles/` with corresponding audio files in `public/audio/`
- **TypeScript**: Strict TypeScript configuration with comprehensive typing

### Audio System Architecture
The application features a sophisticated audio system with dual-mode support:

#### Audio Context (`src/context/AudioContext.tsx`)
- Global audio state management with React Context
- Handles both web and Android native audio playback
- Provides unified interface: `playAudio()`, `pauseAudio()`, `resumeAudio()`, `stopAudio()`
- Android integration through window callbacks for native state updates

#### Audio Components
- **AndroidAudioPlayer** (`src/components/AndroidAudioPlayer.tsx`): Native Android media player with system integration
- **AudioPlayer** (`src/components/AudioPlayer.tsx`): Web-based HTML5 audio player
- **ConditionalAudioPlayer**: Switches between Android and web players based on platform detection

#### Android Integration
- **Detection**: `src/utils/androidDetection.ts` and `src/hooks/useAndroidDetection.ts`
- **Media Controls**: `src/utils/androidMediaControls.ts` for native Android interface
- **Setup Component**: `AndroidMediaSetup.tsx` for initialization

### Content Architecture
- **Articles**: Markdown files with frontmatter, stored in `content/articles/`
- **API Routes**: 
  - `/api/articles` - Article listing and individual article data
  - `/api/podcasts` - Podcast feed generation
  - `/api/shorts` - Short content management
  - `/api/comics` - Comic content management
- **Dynamic Routing**: `[id]` patterns for individual content pages

### Styling & UI
- **DaisyUI**: Primary component library built on Tailwind CSS
- **Theme System**: Light/dark theme support with `next-themes`
- **Fonts**: Noto Sans, Noto Serif, and Literata from Google Fonts
- **Responsive Design**: Mobile-first approach with Tailwind responsive utilities

### Key Libraries
- **Content Processing**: `gray-matter` for frontmatter, `marked` for Markdown rendering
- **Image Optimization**: Next.js Image component with external domain support
- **Animation**: Framer Motion for UI animations
- **Audio Duration**: `get-audio-duration` for audio metadata

## Development Guidelines

### Component Creation (from .cursorrules)
- Use DaisyUI components as primary UI building blocks
- Follow strict TypeScript typing with explicit interfaces
- Implement responsive design with Tailwind CSS utilities
- Include accessibility considerations in all components
- Use React best practices with proper prop validation

### Android-Specific Development
When working with audio features:
- Test both web and Android app modes
- Android interface methods: `startMediaNotification()`, `pauseMediaNotification()`, `loadAndPlayAudio()`, `seekToPosition()`
- Window callbacks: `updateAudioContextState()`, `updateWebPlayerState()`, `onAndroidMediaLoading()`, `onAndroidMediaReady()`

### Content Management
- Articles use numbered naming: `001-Title.md` format
- Corresponding audio files: `001-Title.mp3` in `public/audio/`
- Cover images: `001-Title.png` in `public/images/covers/`

### TypeScript Configuration
- Strict mode enabled with build error ignoring (for production builds)
- No 'any' types - prefer 'unknown' with runtime checks
- Explicit typing for all function inputs/outputs

## API Integrations

### External Services
- **Google Generative AI**: Content generation via `/api/generate-content`
- **Text-to-Speech**: Multiple TTS providers via `/api/tts`
- **NASA API**: Image of the day integration
- **External Content**: Various science/news sources for content aggregation

### Image Domains
Configured for external image sources including NASA, Quanta Magazine, Earth.com, Science.org, and others.

## Build Configuration

### Next.js Config
- Image optimization for multiple external domains
- CSP headers configured for inline styles and scripts
- TypeScript build errors ignored for production builds

### Notable Settings
- Build command includes `rimraf .next` for clean builds
- Production deployment ready for Vercel platform
- Remote image patterns configured for CDN sources