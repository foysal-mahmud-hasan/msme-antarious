---
name: Project Summary
description: Chronological log of major work per conversation for the আরোপণ MSME app
type: project
---

## 2026-05-25 — Antarious design drop: redesign + laws system
- Implemented the "Antarious MSME App" mobile-first design drop across the app: Sathi onboarding, credit-score home hero + morning brief, Credit/Brand/Website/Pricing overlays, redesigned Sathi Live / Autopilot / Approvals, Trust Journey / Sathi Day / Sathi Memory overlays, and the multi-FI Lender Portal (replacing PO Portal). Brand kept as আরোপণ/সাথী throughout.
- Audited the Lender Portal against `screen-lender-portal.jsx` and closed the gaps the user flagged: functional district dropdown, full 8-column desktop beneficiary table (growth/repay/cycle), and the computed next-cycle allocation figure in the Sathi summary.
- Stood up the checked-in `.claude/memory/` system with `LAWS.md` (5 non-negotiable laws) so standing design/brand/platform instructions persist; updated root `CLAUDE.md`.
- Fixed a LAW-4 violation: the Lender Portal sidebar was dropped on mobile — added a hamburger drawer.

## App overview (orientation for future sessions)
- Stack: Expo ~54, React Native 0.81, react-native-web, TypeScript. Bengali-first (HindSiliguri). Demo/prototype — sample data, AsyncStorage persistence, no real backend.
- Two user types: MSME owners (e.g. `foysal`) get the full Shell; lenders (`asif`, `hasPOPortal`) get the Lender Portal shell.
- Design drops land in `/home/foysal/Downloads/Antarious- MSME App/` as mobile-first `screen-*.jsx`; we translate layout, substitute আরোপণ/সাথী, and make every screen responsive.
