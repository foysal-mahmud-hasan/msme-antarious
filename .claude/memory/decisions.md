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

## 2026-05-26 — Tier system is capability-based, not tier-number checks
Decision: Entitlements live in `src/state/entitlements.ts` as a `Feature` union + `TIERS` (each tier's `adds`, cumulative by `order`) + `ADDONS` (Brand Studio, orthogonal). UI asks `useFeature('leads').enabled` / `has('leads')` — NEVER `tier >= 3`. `requiredTierFor()` auto-targets upsell. `EntitlementsStore` persists per user (`aropon:entitlements:<id>`), `setTier`/`toggleAddOn` switch live (simulated purchase, no backend). `openOverlay` in Shell.tsx is the gating chokepoint via `OVERLAY_FEATURE` (extends the existing `'po'` gate) — locked overlays redirect to `'upgrade'`.
Why: moving a feature between tiers must be a one-line data edit; gating must be impossible to bypass even if an entry point forgets to check. Whiteboard reconciliation: credit score = Tier 1, payment gateway = Tier 2, Brand Studio = add-on.
When to apply: any new gated feature → add to the `Feature` union + a tier's `adds` (or an add-on's `grants`) + `FEATURE_META`; map its overlay in `OVERLAY_FEATURE`; gate entry points with `useFeature`/`FeatureTile`/`FeatureGate`.
Production seam: `setTier`/purchase actions are where a server call + bKash receipt validation replace the local write.

## 2026-05-25 — Checked-in .claude/memory as project "laws"
Decision: Standing design/brand/platform rules live in `.claude/memory/LAWS.md` (tracked in git), surfaced via `CLAUDE.md`. Structure adapted from `~/Downloads/02-claude-playbook.md` (Capacitor playbook) — only the memory-system shape was taken, NOT its Capacitor/Clean-Arch/RTK/FCM stack content.
Why: The user was repeating the same instructions every session. Codifying them makes them durable and team-shared.
