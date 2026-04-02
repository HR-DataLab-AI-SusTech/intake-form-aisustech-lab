# Project: AI SusTech Datalab Intake Form

## Overview

Config-driven multi-step intake form for the AI SusTech Datalab. Vanilla HTML/CSS/JS, no framework, no build step. Deployed to GitHub Pages via GitHub Actions; can also be served locally via Docker (nginx). Form content is defined in `src/config/formConfig.json`.

## Key Commands

```bash
npm run lint          # ESLint + Stylelint + HTMLHint
npm run format        # Prettier
docker compose up     # Serve on localhost:8080
```

## Deployment

- **Production**: GitHub Pages — auto-deployed via `.github/workflows/deploy-pages.yml` on push to `main`
- **Live URL**: https://hr-datalab-ai-sustech.github.io/intake-form-aisustech-lab/
- **Local**: `docker compose up` on localhost:8080

## Privacy

- No external CDN requests (fonts are self-hosted)
- No analytics, tracking, or third-party scripts
- Form data stays in the browser (`sessionStorage`) — never sent to a server

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
- Font: Poppins (self-hosted, no Google Fonts — privacy-safe)

## Frontend Design Skill

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics.

### Design Direction: Editorial/Magazine

The current design uses an editorial aesthetic with:
- Poppins font family (self-hosted, HR corporate font)
- Dominant dark teal with burgundy accents
- Warm cream backgrounds with subtle grain texture
- Staggered animations on page transitions
- Strong typographic hierarchy with decorative underlines

### Guidelines

- **Typography**: Use Poppins (self-hosted). Never load fonts from external CDNs (privacy requirement).
- **Color**: Dominant color with sharp accents. Use CSS variables.
- **Motion**: Staggered reveals on page load. CSS-only where possible.
- **Spatial**: Generous whitespace. Card-based layout with shadows and rounded corners.
- **Details**: Grain overlay, decorative accent bars, hover micro-interactions.

NEVER use generic AI aesthetics: overused fonts, purple gradients, predictable layouts, cookie-cutter patterns.
