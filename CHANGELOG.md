# OBIXCORE — Changelog

## [Unreleased] — Blackbox / Step-Response Reader module

### Added
- **New tool: `/blackbox`** — rule-based Step-Response reader. Pilot answers
  a short questionnaire (overshoot, oscillation character, propwash, filter
  feel, motor heat, bounce-back) and `lib/blackbox.ts` combines the
  observations into PID/filter delta suggestions + a Betaflight CLI block.
  This is a rule engine, not a real blackbox-log parser — deltas are
  relative (`[ค่าปัจจุบัน ± N%]`), matching the existing convention already
  used in `data/problems.json`, since we have no way to know the pilot's
  actual current gains.
- Added to `navItems` (both desktop pill row and mobile bottom bar), the
  Home page tool grid (pink accent, `NEW` badge — moved off Visualizer,
  which has been live long enough not to need it anymore), and
  `app/sitemap.ts`.
- New public changelog entry (`v0.2.0`) in `lib/changelog.ts`.
- Bumped `package.json` version and the Nav version chip to `v0.2.0` to
  stay in sync with the changelog.

### Changed (safer alternative chosen over a riskier one)
- The mobile bottom tab bar went from 6 to 7 items. Squeezing 7 equal-width
  (`flex-1`) tabs into ~360–430px of phone width would crush icon/label
  spacing on most real devices. Instead of that, the bar is now a
  **horizontally scrollable row of fixed-width tabs** (`overflow-x-auto`,
  `flex-shrink-0`, 64px each) — nothing gets visually crushed, and it
  scales to more tools being added later without needing another redesign.
  Worth knowing: on phones under ~430px wide the bar will now scroll to
  reach the last 1–2 tabs instead of showing all 7 at once — this is an
  intentional trade-off, not a bug.
- Added an explicit `orange` accent case to both the desktop and mobile Nav
  accent ternaries for the new tab (previously only green/amber/blue/
  purple/cyan/pink were wired up).

### Verified, no change needed
- Bracket/import checks pass project-wide; no page mixes `"use client"`
  with `export const metadata`; every internal link (including the new
  `/blackbox`) resolves to a real route.
- Manually traced the worst-case "every symptom selected" scenario through
  the clamp logic in `lib/blackbox.ts` — stays comfortably inside the
  ±15–20% / ±30–40Hz safety bounds, so the clamps are a safety net rather
  than something actively cutting values in normal use.
- `lib/estimation.ts`, `lib/wizard.ts`, `lib/droneSpec.ts` untouched.

## [Unreleased] — Launch Hardening + Final Polish

### Fixed
- **Regression (recurring):** the per-route metadata split and accessibility
  (`aria-pressed`/`aria-expanded`/`aria-live`) work on Wizard, Calculator,
  Problems, Presets, and Visualizer had reverted again in this upload —
  restored from the last known-good state. **If you're maintaining this in
  your own repo/IDE, please make sure the delivered files actually get
  committed/merged before further edits — this is the third time these five
  files have reverted, and it's safer to treat the delivered zip as the
  source of truth going forward.**
- Removed an orphaned duplicate asset: `public/support-qr.png` was a
  pixel-identical, larger re-save of `public/support-qr.jpg` that nothing
  referenced — dead weight in the repo, deleted.

### Added
- **`/changelog` page** — public, user-facing release notes rendered as a
  timeline (`lib/changelog.ts` holds the data — add a new entry at the top
  of the array for each release, no page code changes needed). Separate
  from this developer-facing `CHANGELOG.md`.
- Nav's version chip (`v0.1.0`) is now a link to `/changelog` instead of a
  static, dead-end badge — gives release notes a real entry point without
  adding a new nav item.
- `/changelog` added to `app/sitemap.ts`.

### Verified, no change needed
- `lib/support.ts` — real contact email now in place; PromptPay QR/name/
  Facebook link from the previous round are all intact and correctly wired.
- `package.json` version (`0.1.0`) and the Nav version chip text are
  consistent — no mismatch to fix.
- No bracket/import errors; no page mixes `"use client"` with `export const
  metadata` (the most common way this class of app breaks at build time).
- All internal links (Nav, Home tool cards, Support, the new Changelog
  link) resolve to real routes.
- Animation/blur budget unchanged; the new Changelog page intentionally
  uses zero decorative blur/animation (it's a text-heavy timeline, doesn't
  need it).
- Calculation logic (`lib/estimation.ts`, `lib/wizard.ts`, `lib/droneSpec.ts`)
  untouched.

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
