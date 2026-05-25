@AGENTS.md

# আরোপণ (Aropon) MSME — Project Rules

## ⛔ MANDATORY FIRST STEP (every session)
Before responding to any request that touches code or design:
1. Read `.claude/memory/MEMORY.md` (the index).
2. Read `.claude/memory/LAWS.md` — the non-negotiable laws. **These override convenience and any conflicting mockup.**
3. Skim `.claude/memory/session_status.md` (where we left off) and `feedback.md` (standing corrections).

## ⚖️ The Laws (summary — full text in LAWS.md)
1. **Mobile-first designs MUST be made responsive for ALL screens** (mobile/tablet/desktop) via `useResponsive()`, `ScreenContainer`, and the Mobile/Desktop shells. A mobile-only build is incomplete.
2. **No phone frame/bezel on web** — real responsive layouts.
3. **Brand is locked: আরোপণ / সাথী** — substitute back over any mockup rebrand; keep the "আ" logo + "স" badge; never rename `aropon:*` keys or `Sathi*` files.
4. **Nothing shown on web may be silently dropped on mobile** — adapt it (drawer/hamburger/scroll).
5. **Expo v54** — read https://docs.expo.dev/versions/v54.0.0/ before writing Expo code (see AGENTS.md).

## Rule 0 — Never guess
Investigate (read/grep/run) or ask before answering. Never present uncertain info as fact. Don't propose a fix before understanding the problem.

## Memory triggers (mandatory, not discretionary)
- Before UI/design work → read `LAWS.md` + `docs/design_source.md`.
- Before writing code → read `patterns.md`.
- Before debugging → read `bugs_fixed.md`.
- Before structural changes → read `decisions.md`.
- When the user gives a standing "always/never/from now on" instruction → record it in `LAWS.md`/`feedback.md` and say where. (Don't make the user repeat themselves.)

## Multi-file changes
Any task touching more than ~3 files: write a plan, get approval, implement in chunks, one commit per logical chunk. Keep a clean git checkpoint before risky changes.

## Verification
`npx tsc --noEmit` proves compilation, NOT correctness. Before claiming a UI task done, re-check it against Laws 1–4 at mobile and desktop widths (`npx expo start --web`).
