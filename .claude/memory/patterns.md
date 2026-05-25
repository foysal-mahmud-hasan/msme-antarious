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

## 2026-05-25 — Persistence under aropon: namespace
Rule: All AsyncStorage keys are namespaced `aropon:*` (e.g. `aropon:auth:user`, `aropon:onboarded:<id>`, `aropon:onboarding:brand`). Never rename them (LAW 3).
