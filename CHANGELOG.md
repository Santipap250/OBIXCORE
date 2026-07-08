# OBIXCORE — Changelog

## [Unreleased] — Final Release Hardening

### Fixed
- **Accessibility / contrast:** `text-faint` token (`#64748c`) failed WCAG AA
  (3.65–4.2:1) against the app's dark surface tones. Bumped to `#74859c`,
  which passes 4.5:1+ against all three background shades used across the
  site (used for small text like tier prices, the version chip, filter
  labels).
- **SEO metadata regression:** the per-page metadata split (Wizard,
  Calculator, Problems, Presets, Visualizer) and the Home page metadata +
  Support banner had not been carried over into this build. Restored so
  every route has its own title/description/OG/canonical again.

### Added
- `aria-pressed` on every single-select toggle/filter button across Wizard,
  Calculator, Problems, Presets, and Visualizer (style pickers, frame/blade/
  battery selectors, category filters, mode tabs, motion toggle, preset
  templates) — screen readers now announce which option is currently
  selected.
- `aria-expanded` on the Wizard's "Advanced" disclosure and each Presets
  accordion card header.
- `role="status" aria-live="polite"` on the two "no results" empty states
  (Problems and Presets filters) so screen reader users are told when a
  filter returns nothing, without needing to re-scan the page.

### Verified, no change needed
- All click handlers are on real `<button>`/`<a>`/`<Link>` elements — no
  `onClick` on non-interactive `<div>`/`<span>`.
- All internal navigation links (`Nav.tsx`, Home page tool cards, Support
  links) point to routes that exist.
- No bracket/paren/import errors anywhere in `app/`, `components/`, `lib/`,
  `types/`.
- Focus ring (`*:focus-visible`, green 2px outline) already present
  site-wide and unaffected.
- Animation/blur budget unchanged from the last audit — everything using
  `.hud-card`/`.hud-panel`/`.hud-chip` continues to be disabled on mobile
  and under `prefers-reduced-motion` via the existing media query in
  `globals.css`.
- Calculation logic (`lib/estimation.ts`, `lib/wizard.ts`, `lib/droneSpec.ts`)
  untouched — still the single source of truth for all three tool pages.
