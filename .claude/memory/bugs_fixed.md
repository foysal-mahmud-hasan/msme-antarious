---
name: Significant Bugs and Root Causes
description: Root causes of bugs that took non-trivial effort to find, for this app
type: project
---

## 2026-05-25 — Onboarding shown to lender (PO) users
Symptom: Logging in as `asif` (a BRAC microfinance PO) forced the 5-step MSME onboarding (name → business → brand → logo → channels) before the Lender Portal.
Root cause: `App.tsx::Gate` ran `isOnboarded(user.id)` for every signed-in user with no `hasPOPortal` check.
Fix: Short-circuit the gate for `user.hasPOPortal` so lenders skip onboarding entirely.
Key diagnostic: onboarding gating must always scope by user role.

## 2026-05-25 — Onboarding was a hard mandatory wall
Symptom: New MSME users could not reach home without completing all 5 steps; no escape.
Root cause: The gate fully replaced `<Shell />` with no skip affordance.
Fix: Added an "এড়িয়ে যান" skip + `markOnboardedSkipped()` that persists the flag (no replay).

## 2026-05-25 — Lender Portal mobile = shrunken desktop with a "use a computer" punt (LAW 1 violation)
Symptom: At mobile width the Lender Portal showed a "ডেস্কটপ-প্রিভিউ মোড — কম্পিউটার থেকে অ্যাকসেস করুন" notice, oversized 2-up stat cards eating ~2.5 screens, and a cramped 4-col desktop table squeezed onto 390px.
Root cause: Mobile was treated as a degraded fallback ("go use desktop"), not a designed breakpoint. tsc passed but the UI was never viewed in a browser.
Fix: Removed the notice; compact 2-up stat tiles; converted the beneficiary table to real mobile list cards showing all fields (name, district·biz, revenue, score, growth, repay, cycle, eligibility). Desktop table unchanged.
Key diagnostic: VERIFY IN A BROWSER. Used headless `google-chrome --headless --window-size=390,844 --screenshot` against `npx expo export` output (seed `localStorage['aropon:auth:user']` to auto-login asif) at both 390 and 1280 to confirm both breakpoints.

## 2026-05-25 — Lender Portal sidebar dropped on mobile (LAW 4 violation)
Symptom: The left nav menu (ড্যাশবোর্ড, বেনিফিশিয়ারি, etc.) was visible on web but completely gone on mobile.
Root cause: Sidebar rendered only under `{isDesktop && (...)}` with no mobile equivalent.
Fix: Added a mobile hamburger that opens a drawer surfacing `SIDEBAR_PRIMARY`/`SIDEBAR_SECONDARY`.
Key diagnostic: grep for `isDesktop &&` blocks that have no `!isDesktop` counterpart — those are candidate mobile drop-offs.
