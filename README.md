# আরোপণ · Aropon — Expo App

AI-assisted MSME companion app for Bangladeshi micro-entrepreneurs, with a PKSF Project Officer (PO) portal. Built with Expo (SDK 54) + React Native + TypeScript. This repo is a **client-presentable dummy** — all data is hard-coded so it can be demoed without a backend.

## Demo accounts

| Username | Password | Role                          | Has PO Portal |
| -------- | -------- | ----------------------------- | ------------- |
| `joy`    | `1234`   | অ্যাডমিন (Admin)              | ✅ Yes        |
| `foysal` | `1234`   | সাধারণ ইউজার (General user)   | ❌ No         |

Quick login cards on the login screen pre-fill the credentials. Tap one, then **প্রবেশ করুন**.

## Running

```bash
npm install         # already done in this repo
npm start           # starts Metro on http://localhost:19000
```

Then either:

- **Phone:** install **Expo Go** (Android Play Store / iOS App Store) on the same Wi-Fi network and scan the QR shown in the terminal.
- **Android emulator:** press `a` in the Metro terminal.
- **iOS simulator (macOS only):** press `i`.
- **Web:** press `w` (good for quick demos in a browser).

## What works

### Both users (foysal & joy)
- **Login** with persistent session via AsyncStorage.
- **Home tab** — daily briefing cards (urgent messages, opportunity, Saathi did, stock alert, PKSF report) and a "Weekly Pulse" tab with bar chart + top products + PKSF score trend.
- **Messages (বার্তা)** — Inbox / Leads / Orders / Broadcast tabs. Tap any inbox conversation to open the chat overlay with the Saathi suggestion banner.
- **Market (বাজার)** — Opportunity, Sourcing, Seasonal calendar, Competitors.
- **Finance (হিসাব)** — Cashflow chart, recent transactions, inventory, PKSF score breakdown.
- **More (আরও)** — Profile, **Offline mode toggle**, settings, sign out.
- **Saathi AI chat** — floating button bottom of every tab. Type or tap a quick prompt; the bot responds based on keywords (বিক্রি / বাকি / রিঅর্ডার / রিপোর্ট) and inlines summary cards.
- **Agent overlays** — সাথী Live command center → Autopilot trust controls → Approvals queue (approve / cancel; queue empties live).
- **Offline mode** (toggle in **More**): swaps the Home tab for the offline variant with:
  - **Quick Sale** — tap-to-add cash register, payment selector (cash / বাকি / bKash-Nagad), saves to a green confirmation screen.
  - **হাট প্রস্তুতি** — checklist (toggles), packing timeline, reminder CTA.
  - **কাস্টমার খাতা** — 7-debtor ledger with aging, SMS reminder CTA, total bn-formatted.
  - **ডিজিটাল যাত্রা** — 6-step migration journey, with one current step.

### Joy only (admin)
- **PKSF PO Portal** entry from **More**. Three tabs:
  - **ওভারভিউ** — 4 KPI tiles, district health bars, Saathi weekly brief.
  - **বেনিফিশিয়ারি** — 8-row list; tap any row to expand into a full profile panel (metrics + Saathi summary + PDF CTA).
  - **মনোযোগ** — 3 at-risk beneficiaries with severity chips and meeting CTA.

## File map

```
App.tsx                       # font loading + auth gate + nav container
src/
  theme/index.ts              # colours, spacing, fonts, shadow tokens
  auth/
    AuthContext.tsx           # users joy/foysal, AsyncStorage session, offline flag
    LoginScreen.tsx
  components/
    atoms.tsx                 # T (text), Card, Chip, Btn, SathiBadge, PulseDot, Row, Avatar
    AppHeader.tsx
    PillTabs.tsx
    SathiFAB.tsx
    StatPill.tsx
  data/strings.ts             # toBn (English→Bengali numerals) helper
  navigation/MainTabs.tsx     # bottom tabs + all modal overlays
  screens/
    HomeScreen.tsx            # online home + weekly pulse
    OfflineHomeScreen.tsx
    MessagesScreen.tsx
    MarketScreen.tsx
    FinanceScreen.tsx
    MoreScreen.tsx            # profile · offline toggle · PO portal entry · sign out
    SathiChatScreen.tsx       # Saathi AI chat overlay
    AgentScreens.tsx          # Live · Autopilot · Approvals
    QuickSaleScreen.tsx       # offline cash register
    HaatPrepScreen.tsx        # offline haat checklist
    LedgerScreen.tsx          # offline বাকি tracking
    JourneyScreen.tsx         # offline digital migration
    POPortalScreen.tsx        # admin (joy) only
```

## When the backend is wired up

The places that fake data lives are clearly localised:

- **Auth** — `src/auth/AuthContext.tsx` `USERS` map is the only login source today. Swap `signIn` to call the API and persist the returned user/token in AsyncStorage.
- **Screens** — each screen holds its own seed array (e.g. `MessagesScreen.tsx` `convos`, `POPortalScreen.tsx` `rows`, `LedgerScreen.tsx` `debts`). Move these into a `src/api/` layer (one fetcher per resource), then read via React Query or a similar cache.
- **Offline mode** is controlled by the `offline` boolean in `AuthContext`. When the network layer is in place, this should also drive an outbox-style sync for QuickSale / Ledger entries.
- **Saathi chat** keyword routing lives in `SathiChatScreen.tsx` `send()`. Replace with a streaming response from the agent endpoint.

## Bengali numerals & typography

- Font: **Hind Siliguri** (300/400/500/600/700) loaded via `@expo-google-fonts/hind-siliguri`.
- Helper: `toBn(n)` and `bnTaka(n)` in `src/data/strings.ts` for converting numerals — most hard-coded copy is already in Bengali numerals.

## Sanity-check commands

```bash
npx tsc --noEmit                          # type-check the whole app
npx expo export --platform web -d out     # produce a web bundle (good smoke test, no native deps needed)
```

Both pass cleanly today.
