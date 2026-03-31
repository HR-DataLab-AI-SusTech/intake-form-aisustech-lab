# Project: AI SusTech Datalab Intake Form

## Overview

Config-driven multi-step intake form for the AI SusTech Datalab. Vanilla HTML/CSS/JS, no framework, no build step. Served via Docker (nginx). Form content is defined in `src/config/formConfig.json`.

## Key Commands

```bash
npm run lint          # ESLint + Stylelint + HTMLHint
npm run format        # Prettier
docker compose up     # Serve on localhost:8080
```

## Architecture

- `src/config/formConfig.json` — single source of truth for all form content (pages, questions, UI text)
- `src/js/config/formConfig.js` — fetches JSON, exposes `getFormConfig()`
- `src/js/modules/` — one module per concern (renderer, navigation, validation, state, export, download)
- `src/css/variables.css` — all design tokens (colors, fonts, spacing)
- Page types: landing (`isLanding`), form (default), summary (`isSummary`)
- State lives in `sessionStorage` via `stateManager.js`
- Browser history via `pushState` with page ID hashes

## Brand: Hogeschool Rotterdam / AI SusTech Datalab

- Dark teal/petrol: #0a3049 (header, primary)
- Deep burgundy/rose: #9b2743 (accent, cards)
- Muted green: #5a8a3c (CTA, success)
- Warm cream: #f7f4ef (background)
- Sand borders: #d9d3ca
- Display font: DM Serif Display
- Body font: DM Sans

## Frontend Design Skill

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics.

### Design Direction: Editorial/Magazine

The current design uses an editorial aesthetic with:
- Serif + sans-serif font pairing (DM Serif Display + DM Sans)
- Dominant dark teal with burgundy accents
- Warm cream backgrounds with subtle grain texture
- Staggered animations on page transitions
- Strong typographic hierarchy with decorative underlines

### Guidelines

- **Typography**: Distinctive font pairings. Never default to Arial, Inter, or system fonts.
- **Color**: Dominant color with sharp accents. Use CSS variables.
- **Motion**: Staggered reveals on page load. CSS-only where possible.
- **Spatial**: Generous whitespace. Card-based layout with shadows and rounded corners.
- **Details**: Grain overlay, decorative accent bars, hover micro-interactions.

NEVER use generic AI aesthetics: overused fonts, purple gradients, predictable layouts, cookie-cutter patterns.
