---
name: Design Source & Consumption Protocol
description: Where the locked design lives and how to translate it into this Expo app
type: reference
---

## Source (locked, read-only)
- Latest drop: `/home/foysal/Downloads/Antarious- MSME App/` (also the `.zip` beside it). Dated 2026-05-24.
- 18 mobile-first artboards: `screen-*.jsx` (home, messages, market, accounting, credit, brand, website, pricing, agent, offline, onboarding(+maya), sathi-chat, lender-portal, po-portal[legacy]) + `app.jsx` (wiring), `design-canvas.jsx`, `shared.jsx`.
- The design rebrands to উদ্যোম/মায়া — IGNORE that branding (see LAW 3).

## Consumption protocol (RN adaptation of playbook §16)
1. Each `screen-*.jsx` maps ~1:1 to a `src/screens/*.tsx`.
2. Translate the layout/features; **substitute brand**: উদ্যোম→আরোপণ, মায়া→সাথী, logo `U`/other→saffron "আ", badge `ম`→teal "স".
3. **Make it responsive (LAW 1):** the JSX is one phone breakpoint. Build mobile + tablet + desktop via `useResponsive()`, `ScreenContainer`, and the Mobile/Desktop shells. No phone bezel on web (LAW 2).
4. **No mobile drop-offs (LAW 4):** anything in a desktop-only block needs a mobile-accessible equivalent.
5. Use atoms + theme; design-specific accents (e.g. lender blue `#1d4ed8`) are fine.

## Audits
- Per-screen parity audits live in `docs/audits/<date>_<screen>_parity.md`. Run them to catch drift between a `screen-*.jsx` and its `src/screens/*` implementation.
