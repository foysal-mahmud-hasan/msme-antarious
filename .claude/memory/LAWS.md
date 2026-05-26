---
name: Project Laws (Non-Negotiable)
description: Unbreakable rules for the আরোপণ (Aropon) MSME app. Read before any design, UI, or branding work. These override convenience and any conflicting mockup.
type: project
---

# ⚖️ PROJECT LAWS — DO NOT BREAK, WHATEVER CHANGES COME

These are standing instructions the user should never have to repeat. They apply to **every** task, **every** design drop, **every** screen — now and in the future. If a request, a mockup, or a shortcut conflicts with a law, the law wins. If a law seems to block the task, stop and ask — do not silently break it.

---

## LAW 1 — Mobile-first designs MUST be made responsive for ALL screens

Design drops arrive as **mobile-first artboards** (~390×844 phone frames). They are a *reference for one breakpoint*, not the finished product.

- Every screen MUST work at **mobile, tablet, and desktop/web** widths.
- Use the project's responsive system — never hardcode a single width:
  - `useResponsive()` from `src/components/AppFrame.tsx` (breakpoints: tablet 720, desktop 1024, wide 1400)
  - `ScreenScroll` / `ResponsiveGrid` from `src/components/ScreenContainer.tsx`
  - `Shell` → `MobileShell` (slide-up overlays) / `DesktopShell` (side-drawer overlays)
- "Improvise / adapt for all screens" is the default expectation for **every** new design — the user will not re-ask each time.
- A screen that only renders the mobile artboard is **incomplete**, not done.

## LAW 2 — No phone frame / bezel on web

On web/desktop, render real responsive layouts that fill the viewport. **Never** center a phone-width bezel or simulate a device frame. (Multi-platform Expo apps must look native on desktop.)

## LAW 3 — Brand identity is locked: আরোপণ (Aropon) + সাথী (Sathi)

Mockups frequently rebrand (e.g. উদ্যোম / Uddyom, মায়া / Maya). Always substitute back:

- Product name: **আরোপণ** (Aropon). Assistant name: **সাথী** (Sathi).
- Logo glyph: saffron **"আ"** tile. Assistant badge glyph: teal **"স"** (`SathiBadge`).
- NEVER rename the `aropon:*` AsyncStorage keys.
- NEVER rename `Sathi*` component/screen files (SathiBadge, SathiFAB, SathiChatScreen, etc.).
- Translate the mockup's layout and copy; swap its brand for ours. No rebrand, ever, unless the user explicitly says so.

## LAW 4 — Nothing shown on web may be silently dropped on mobile

If an element exists in the desktop/web layout (e.g. the Lender Portal left sidebar), it MUST remain **accessible** on mobile via an adapted pattern — hamburger menu, drawer, bottom sheet, or horizontal scroll. Hiding it behind `isDesktop &&` with no mobile equivalent is a bug, not a layout choice. (Origin: Lender Portal sidebar was dropped on mobile — 2026-05-25.)

**Clarification — Law 4 governs responsive parity, NOT entitlement gating.** A feature locked because the user hasn't paid for it is a different axis. Locked features MUST be shown **visibly locked** (🔒 + tier badge + upsell), **identically on every breakpoint** — never silently hidden, never platform-dependent. "Hide entirely below tier" is forbidden; "visible + locked → upsell" is the rule. (Origin: tier system — 2026-05-26.)

## LAW 5 — Expo v54

This app is Expo ~54. Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing Expo/React-Native code. (See also `AGENTS.md`.)

---

**Enforcement:** Before declaring any UI task done, re-check it against Laws 1–4. Type-check (`npx tsc --noEmit`) is necessary but NOT sufficient — it proves the code compiles, not that the screen is responsive, on-brand, and complete on every breakpoint.
