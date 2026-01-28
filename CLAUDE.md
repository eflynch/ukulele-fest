# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Project Overview

**Play the Gray Away** - An interactive promotional website for the 3rd annual ukulele festival (February 28, 2026). Combines festival information with an engaging clicker/collection game mechanic.

**Live site:** https://playthegrayaway.org

## Tech Stack

- **React 19** with TypeScript
- **Vite** for bundling and dev server
- **Tailwind CSS** for styling
- **GitHub Pages** for hosting (auto-deployed via GitHub Actions on push to main)

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production (outputs to /dist)
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Project Structure

- `src/App.tsx` - Main application component containing all game logic, UI, and rendering (single large file)
- `src/main.tsx` - React entry point
- `src/index.css` - Tailwind CSS imports
- `public/` - Static assets including CNAME for custom domain
- `src/assets/` - Images (festival map, toaster sprite)

## Game Mechanics

The game has score-based progression:
- **0-19 points:** Click flying emojis to collect them
- **20+ points:** Spinning guitar appears, cursor becomes guitar emoji
- **50+ points:** Guitar auto-collects nearby elements
- **100+ points:** Zooming toaster moves around screen collecting elements
- **500+ points:** "TOASTPOCALYPSE" - everything becomes toasters

Key interfaces in App.tsx:
- `FlyingElement` - Structure for collectible items (id, emoji, style, position, velocity)
- `Tab` type - Union type for active tab state

## Code Patterns

- All game state managed via React hooks (useState, useEffect, useRef)
- useRef used for collision detection to avoid re-renders
- requestAnimationFrame for smooth collision detection loops
- CSS keyframe animations generated dynamically per element
- Neon/retro 80s aesthetic using Tailwind utilities with text shadows and gradients

## Configuration

- TypeScript: ES2020 target, strict mode, react-jsx
- ESLint: Flat config with React hooks rules
- Vite: React plugin with Babel, Tailwind plugin
- Deployment: GitHub Actions workflow in `.github/workflows/deploy.yml`

## Development Notes

- Festival date is hardcoded in App.tsx for countdown calculation
- The App.tsx file is large (~37KB) - all game logic is in one component
- No external API calls - purely client-side
- Tab content (Lineup, Tickets, Camping, Sponsorship) is rendered inline in App.tsx
