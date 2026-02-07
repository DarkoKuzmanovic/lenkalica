# Lenkalica

A Next.js 16 content blog featuring articles, podcasts, comics, and shorts about culture, history, and geography. The site includes sophisticated audio capabilities with special Android app integration for enhanced audio playback through native Android media controls.

## 🚀 Features

### Content Management

- **Articles**: Markdown-based articles with frontmatter metadata
- **Podcasts**: RSS feed generation and audio content management
- **Comics**: Interactive comic content with visual storytelling
- **Shorts**: Bite-sized content for quick consumption
- **Studies**: Interactive educational content with infographic support

### Audio System

- **Dual-mode Audio**: Seamless switching between web and Android native players
- **Android Integration**: Native media controls, notification support, and system integration
- **Web Audio Player**: Full-featured HTML5 audio player for web browsers
- **Global State Management**: Unified audio context across the application

### User Experience

- **Responsive Design**: Mobile-first approach with Tailwind CSS utilities
- **Theme Support**: Light/dark theme switching with persistent preferences
- **Progressive Enhancement**: Works without JavaScript, enhanced with it
- **Accessibility**: WCAG-compliant components and navigation

### Technical Features

- **Next.js 16**: Modern React framework with App Router and Turbopack
- **TypeScript**: Strict typing for enhanced developer experience
- **DaisyUI**: Beautiful, accessible component library
- **Content Processing**: Markdown rendering with syntax highlighting
- **Image Optimization**: Next.js Image component with external domain support

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd lenkalica
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables** (optional)

   ```bash
   cp .env.example .env.local
   ```

   Configure any required API keys or external service credentials.

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```bash
src/
├── app/                    # Next.js App Router pages
│   ├── articles/          # Article pages and routing
│   ├── podcasts/          # Podcast pages and RSS
│   ├── comics/            # Comic content pages
│   ├── shorts/            # Short content pages
│   ├── studies/           # Educational studies with infographics
│   └── api/               # API routes
├── components/            # React components
│   ├── AndroidAudioPlayer.tsx    # Native Android audio player
│   ├── AudioPlayer.tsx           # Web HTML5 audio player
│   └── ...                       # Other UI components
├── context/               # React contexts
│   └── AudioContext.tsx   # Global audio state management
├── hooks/                 # Custom React hooks
│   └── useAndroidDetection.ts    # Android platform detection
├── lib/                   # Utility libraries
├── utils/                 # Utility functions
│   └── androidDetection.ts       # Android platform utilities
└── styles/                # CSS and styling

content/
└── articles/              # Markdown article files

public/
├── audio/                 # Audio files for articles/podcasts
├── images/
│   └── covers/            # Cover images for content
└── ...                    # Other static assets
```

## 🎵 Audio Architecture

### Components

- **AudioContext**: Global state management for audio playback
- **AndroidAudioPlayer**: Native Android media player with system controls
- **AudioPlayer**: Web-based HTML5 audio player
- **ConditionalAudioPlayer**: Platform-aware player selection

### Android Integration

The application detects Android app environment and provides:

- Native media notifications
- System media controls (play/pause/seek)
- Background playback support
- Lock screen controls

### API Interface

```typescript
// Audio Context Methods
playAudio(url: string, title: string, author?: string)
pauseAudio()
resumeAudio()
stopAudio()

// Android Native Methods (when available)
window.Android.startMediaNotification(title, author, audioUrl)
window.Android.loadAndPlayAudio(audioUrl)
window.Android.pauseMediaNotification()
```

## 🎨 Styling & UI

### Design System

- **DaisyUI**: Primary component library built on Tailwind CSS
- **Tailwind CSS**: Utility-first CSS framework
- **Theme System**: Support for light and dark themes
- **Typography**: Noto Sans, Noto Serif, and Literata fonts

### Responsive Design

- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Optimized for various screen sizes

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript compiler

# Utilities
npm run clean       # Clean build artifacts
```

## 📝 Content Management

### Articles

Articles are stored as Markdown files in `content/articles/` with the following naming convention:

- File: `001-Article-Title.md`
- Audio: `public/audio/001-Article-Title.mp3`
- Cover: `public/images/covers/001-Article-Title.png`

### Frontmatter Structure

```yaml
---
title: "Article Title"
author: "Author Name"
date: "2024-01-01"
tags: ["culture", "history"]
description: "Brief article description"
coverImage: "/images/covers/001-Article-Title.png"
audioFile: "/audio/001-Article-Title.mp3"
---
```

## 🌐 API Routes

- `/api/articles` - Article listing and individual article data
- `/api/podcasts` - RSS feed generation for podcast clients
- `/api/shorts` - Short content management
- `/api/comics` - Comic content and metadata
- `/api/studies` - Educational studies and infographic data
- `/api/generate-content` - AI-powered content generation
- `/api/tts` - Text-to-speech conversion

## 🚀 Deployment

### Vercel (Recommended)

The application is optimized for deployment on Vercel:

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

### Build Configuration

```bash
npm run build  # Generates optimized production build
npm start      # Serves the production build
```

## 🤖 Android App Integration

The web application seamlessly integrates with a companion Android app:

### Detection

The app automatically detects Android environment using:

```typescript
const isAndroid =
  typeof window !== "undefined" && window.Android && typeof window.Android.startMediaNotification === "function";
```

### Media Controls

When running in the Android app, users get:

- Native notification controls
- Lock screen media controls
- Background audio playback
- System volume integration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions, issues, or contributions, please:

- Open an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the `CLAUDE.md` file for development guidelines

---

Built with ❤️ using Next.js, TypeScript, and DaisyUI
