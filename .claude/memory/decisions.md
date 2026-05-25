---
name: Architectural Decisions
description: Structural choices for the আরোপণ MSME app and the reasoning behind them
type: project
---

## 2026-05-25 — PO Portal renamed to Lender Portal, but hasPOPortal kept
Decision: The screen is `LenderPortalScreen.tsx` (multi-FI: NGO + Bank + MFI). The auth flag stays `User.hasPOPortal` and the overlay name `'po'` is kept as an alias forwarding to `'lender'`.
Why: Renaming `hasPOPortal` ripples through AuthContext, Shell, LoginScreen, and every consumer for no functional gain. The alias keeps the existing gate (`POOnlyShell` for `asif`) working.
When to apply: leave the flag/alias as-is; only the user-facing screen is "Lender Portal".

## 2026-05-25 — Onboarding is skippable and excluded for lenders
Decision: Sathi 5-step onboarding (`SathiOnboardingScreen.tsx`) fires once per MSME user after first sign-in, with an "এড়িয়ে যান" skip. Lenders (`hasPOPortal`) are excluded entirely — they go straight to the Lender Portal.
Why: The design treats onboarding as an MSME-owner setup flow; a loan officer setting up a storefront brand/logo makes no sense. A hard mandatory wall is also wrong — skip persists the onboarded flag so it never replays.
When to apply: any change to the `App.tsx::Gate` flow must preserve both the lender exclusion and the skip path.

## 2026-05-25 — Checked-in .claude/memory as project "laws"
Decision: Standing design/brand/platform rules live in `.claude/memory/LAWS.md` (tracked in git), surfaced via `CLAUDE.md`. Structure adapted from `~/Downloads/02-claude-playbook.md` (Capacitor playbook) — only the memory-system shape was taken, NOT its Capacitor/Clean-Arch/RTK/FCM stack content.
Why: The user was repeating the same instructions every session. Codifying them makes them durable and team-shared.
