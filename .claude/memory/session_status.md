---
name: Session Status
description: Current branch, in-progress work, and where we left off
type: project
---

## 2026-05-26 — Tier / entitlement system (8 phases, committed)
Branch: `msme-redesign`. Built the full tier system per the whiteboard (Tier 0–4 + Brand Studio add-on), fully-working dummy, no backend:
- Engine `entitlements.ts` + persisted `EntitlementsStore` (live `setTier`/`toggleAddOn`, `aropon:entitlements:<id>`).
- Gating primitives `Gate.tsx` + `openOverlay` chokepoint (`OVERLAY_FEATURE`).
- `UpgradeSheet` (pre-targeted upsell) + `PricingScreen` rewrite (5 tiers + add-on, live switch).
- Home credit hero + feature tiles gated; lock badges show correct tier.
- New features built: Leads CRM (`LeadsStore`+screen, scoring/upsell), Insights dashboard (live summaries/best-worst/peak-hour/lead-closing), Complaints (`ComplaintsStore`+screen), Calendar, Courier, Inventory (real auto-outflow via ProductsStore).
- Verified in headless Chrome at mobile + desktop (pricing live-switch persisted, upsell, leads, insights, inventory outflow, calendar, courier, desktop no-bezel). 8 commits `547ace1..` on `msme-redesign`. NOT pushed yet.

Open: webTemplate marked "শীঘ্রই"; webHosting is suggestions-only; tier is client-trusted (production needs server enforcement at the setTier seam).

## 2026-05-25
Branch: `msme-redesign` (tracks `origin/msme-redesign`). Backup tag from the original redesign: `pre-antarious-redesign`.

Done this session:
- Audited Lender Portal vs design; closed gaps (district dropdown, full 8-col desktop table, computed allocation figure).
- Established the checked-in `.claude/memory/` laws + memory system (LAWS.md etc.) + updated `CLAUDE.md`.
- Fixed mobile Lender-Portal sidebar (hamburger drawer).

Carried over / not yet on this branch:
- Onboarding-gate fix (lender exclusion + skip) was made earlier on `feat/antarious-redesign` but lost on branch switch — NOT yet re-applied on `msme-redesign`. Re-apply if onboarding gating work resumes (see decisions.md + bugs_fixed.md).

Next steps / options:
- Re-apply the onboarding-gate fix on `msme-redesign`.
- Full cross-screen parity sweep: audit the other 16 `screen-*.jsx` against `src/screens/*` for responsiveness + brand + dropped-on-mobile elements.
- Commit the above.
