# CLAUDE.md

> **Primary documentation**: See [`.github/copilot-instructions.md`](.github/copilot-instructions.md) for full project guidance.
>
> **Lessons learned**: See [`.github/memories.md`](.github/memories.md) for debugging insights and solutions.

This file provides a quick reference for Claude Code (claude.ai/code) when working with this repository.

## Quick Start

```bash
npm run dev    # Development server
npm run build  # Production build (includes prebuild: audio manifest generation)
npm run lint   # ESLint validation
```

## Key Points

- **Next.js 16** with App Router, TypeScript, DaisyUI + Tailwind (Turbopack default)
- **Dual-mode audio**: Web HTML5 + Android native media controls
- **Content**: Markdown articles with numbered naming (`001-Title.md`)
- **Deployment**: Vercel — see memories.md for runtime filesystem limitations
