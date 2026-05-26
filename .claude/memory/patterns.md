---
name: Established Patterns and Rules
description: Evergreen RN/Expo patterns for the আরোপণ MSME app — apply consistently
type: project
---

## 2026-05-25 — Responsive shell + overlay system
Rule: Route UI through the existing shell, don't reinvent navigation.
- `useResponsive()` (`src/components/AppFrame.tsx`) gives `isTablet/isDesktop/isWide` (breakpoints 720/1024/1400).
- `Shell.tsx` picks `MobileShell` (slide-up `Overlay`) or `DesktopShell` (right-side `DrawerOverlay`).
- Open secondary screens with `openOverlay(name, prefill?)` from `useActions()` (`src/state/AppActions.tsx`); `OverlayName` is a typed union — add new names there and wire them in BOTH `MobileShell.tsx` and `DesktopShell.tsx`.
- Navigate top-level tabs with `goto(route, subTab?)`.
When to apply: any new screen or secondary panel.
When NOT to apply: inline sub-state within a screen (use local `useState`).

## 2026-05-25 — Atoms + theme, no ad-hoc styling
Rule: Build with the atoms library and theme tokens; avoid raw hex unless matching a design-specific accent.
- Atoms (`src/components/atoms.tsx`): `T` (weight r/m/s/b), `Card` (leftBar/tinted), `Chip`, `Btn`, `SathiBadge` (renders "স"), `Row`, `Avatar`, `PulseDot`, `SectionHeader`.
- Theme (`src/theme`): saffron `#E8820C`, green `#1E7D4F`, teal `#2EC4B6`, coral `#E04F4F`, bg `#FAF8F4`, ink `#1A1A2E`, ink2 `#6B7280`, borders. Fonts: HindSiliguri (Bengali) via `fonts.*`.
When to apply: all UI. Design-specific palettes (e.g. lender-portal blue `#1d4ed8`, slate `#0f172a`) are fine when mirroring a screen's accent.

## 2026-05-25 — Verify web UI with headless Chrome (don't trust tsc)
Rule: For a UI claim, render it. `google-chrome` is installed. Flow: `npx expo export -p web` → serve `dist` (`python3 -m http.server PORT --directory dist`) → screenshot with `google-chrome --headless=new --window-size=W,H --virtual-time-budget=15000 --screenshot=out.png URL`, then Read the PNG. To skip login, drop a temp `dist/seed.html` that sets `localStorage['aropon:auth:user']` (raw JSON of the User; async-storage uses plain localStorage on web) and `location.replace('/')`. Always check BOTH a mobile (e.g. 390) and desktop (e.g. 1280) width. `dist/` is gitignored. Clean up the seed file after.
When to apply: any UI/responsive task before claiming done (LAW 1 enforcement).

## 2026-05-26 — Primary nav stays visible (overlays never strand the user)
Rule: Feature "overlays" are app sections, not throwaway modals — keep primary navigation visible.
- Desktop (`DesktopShell`): overlays render INLINE in the content area via `renderOverlayScreen()` while the sidebar stays put. No side-drawers, no sidebar-hiding full-screen. Sidebar nav items call `actions.goto()` (closes overlay + switches route).
- Mobile (`MobileShell`): content + overlays live in a flex "stage"; the `BottomBar` is a sibling BELOW the stage so it's always visible. Tab taps call `actions.goto()` (closes overlay + routes). FAB only when no overlay.
- A bare back-arrow is a modal dismiss, NOT navigation — never the only way out, especially for this low-digital-literacy audience.
Origin: user flagged feature screens stranding the user with just a back button — 2026-05-26.

## 2026-05-26 — Overlay/screen responsiveness (LAW 1, non-negotiable)
Rule: Every screen must be polished at mobile (~390), tablet (~820), AND desktop (~1280) — not just one.
- Cap + center content at ALL widths: `{ width:'100%', maxWidth: N, alignSelf:'center' }` — NOT `maxWidth: isDesktop ? N : undefined` (that leaves tablet uncapped and stretched).
- Content-heavy overlays (pricing, leads, insights, etc.) render **full-screen** on desktop (DesktopShell `FULLSCREEN_OVERLAYS` + absoluteFill, like the Lender Portal) and let the screen center its own content — NEVER a narrow 440–760px side `DrawerOverlay` (those squash multi-column/wide layouts). Side drawers are only for chat/forms.
- Multi-column grids scale by viewport `width`: e.g. Pricing = 1 col <680, 2 col <1100, 3 col ≥1100.
- VERIFY before claiming done: `expo export -p web` → serve `dist` → headless Chrome at 390 AND 820 AND 1280 (seed `localStorage`), Read each screenshot. tsc passing ≠ responsive.
Origin: user repeatedly caught cramped desktop drawers / one-width-only screens despite LAW 1 — "use your sense, optimize for all screens every time."

## 2026-05-26 — Tier gating primitives
Rule: Gate features with the `src/components/Gate.tsx` primitives, never ad-hoc tier checks.
- `useFeature(feature)` → `{ enabled, requiredTier, openUpsell() }`.
- `<FeatureGate feature>` wraps content: shows it if unlocked, else dims + lock + taps to upsell (visible, never hidden — see LAWS Law 4 clause).
- `<LockableTile>` / Home's `FeatureTile`: feature launcher that locks itself + shows a tier badge.
- `LockBadge` null tier = add-on ("অ্যাড-অন"); otherwise tier name.
- New paid screens: in-memory store (ProductsStore idiom) + overlay wired in BOTH shells + entry as a gated tile; opening is also protected by `OVERLAY_FEATURE` in Shell.
When to apply: every paid feature. Demo tiers: foysal seeded `tier1`; switch live in Pricing or via the upgrade sheet.

## 2026-05-25 — Persistence under aropon: namespace
Rule: All AsyncStorage keys are namespaced `aropon:*` (e.g. `aropon:auth:user`, `aropon:onboarded:<id>`, `aropon:onboarding:brand`). Never rename them (LAW 3).
