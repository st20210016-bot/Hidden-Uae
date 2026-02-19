<!-- /README.md -->
# Hidden UAE 🇦🇪✨

A fun, gamified “Hidden Gems” UAE map where users unlock gems for points and build a collection.

- **Static-site only** (no server required)
- Vite + React + TypeScript
- Tailwind CSS
- react-router-dom routing
- i18n with i18next + react-i18next
- `/en` (LTR) and `/ar` (RTL)
- Default `/` redirects to `/en`
- MapLibre GL JS using OpenFreeMap style:
  `https://tiles.openfreemap.org/styles/liberty`

## Branding / Logo
This repo assumes a logo file exists at:
- `public/logo.png`

It is used as:
- Hero badge on Home page
- Favicon/app icon (see `index.html`)

## Quick start

```bash
npm install
npm run dev
