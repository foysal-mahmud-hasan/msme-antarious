---
name: Lender Portal Parity Audit (2026-05-25)
description: screen-lender-portal.jsx vs src/screens/LenderPortalScreen.tsx — gaps and resolutions
type: reference
---

## Source: screen-lender-portal.jsx  →  Impl: src/screens/LenderPortalScreen.tsx

### Matched (faithful)
Topbar identity (brand kept আ/আরোপণ), FI badge, search, sidebar (5 primary + 3 secondary), hero 5 stats, filter pills + Excel export, score distribution, weekly Sathi brief, branch performance, expanded profile (header, 5-stat grid, loan history, Sathi summary), filtering + search logic.

### Gaps found & fixed (2026-05-25)
1. **District dropdown missing** (design L40-43). → Added a functional জেলা dropdown (desktop), wired into the `filtered` memo.
2. **Table collapsed 8→4 columns** (design L113-119). Growth/repay/cycle dropped though data existed. → Restored প্রবৃদ্ধি, পরিশোধ, চক্র columns, gated behind `isDesktop`; mobile keeps condensed 4-col.
3. **Computed allocation figure dropped** (design L255). → Restored `active × 1.5` with Bengali-numeral lakh grouping (`parseBnNumber`/`formatBnIndian`) for `kind==='g'`.

### Gap found & fixed later same day
4. **Sidebar dropped on mobile** (LAW 4). → Mobile hamburger drawer surfacing the sidebar items. (See bugs_fixed.md.)

### Intentional (NOT gaps)
U→আ, উদ্যোম→আরোপণ, মায়া→সাথী, badge ম→স — brand preservation (LAW 3).

### Cosmetic, deferred
BR badge flat `#dc2626` vs design red gradient — `expo-linear-gradient` not installed; not worth `react-native-svg` for a 36px badge.
