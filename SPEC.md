# আরোপণ · Aropon — Technical Specification

**Project:** Aropon — AI Business Companion for Bangladeshi MSMEs
**Partner:** Antarious × PKSF (Palli Karma-Sahayak Foundation)
**Document:** Technical specification & feature inventory
**Version:** 1.0 (presentation build)
**Last updated:** 2026-05-19

---

## 1. Executive summary

Aropon is a bilingual (Bengali-first, with English secondary) mobile + web business companion for Bangladeshi micro, small, and medium-enterprise (MSME) owners — particularly women entrepreneurs in PKSF's microfinance network. The app combines:

1. **An "always-on" AI assistant ("সাথী"/Saathi)** that observes orders, customer messages, market trends, and finance, then proposes or auto-executes actions under the user's trust controls.
2. **An offline-capable cash-register + ledger + হাট (rural market) workflow** for sellers without consistent internet or digital presence.
3. **A PKSF PO (Project Officer) dashboard** that aggregates beneficiary health, loan-readiness scoring, and at-risk alerts for field officers managing 30-50 MSMEs.

The deliverable is a **single Expo/React Native codebase** that ships to **iOS, Android, and the web** with platform-appropriate layouts (bottom tabs on mobile, sidebar dashboard on desktop). This document covers the presentation build — a complete UI/UX wired with realistic dummy data, ready to demo to clients and stakeholders, with backend integration points clearly identified.

---

## 2. Target users & roles

| Role | Bengali label | Description | Demo account |
|---|---|---|---|
| **General user** | উদ্যোক্তা | MSME owner / entrepreneur. Uses online & offline modes. | `foysal` / `1234` |
| **Admin / PO officer** | অ্যাডমিন | PKSF Project Officer. Has all entrepreneur features **plus** access to the PO Portal. | `joy` / `1234` |

> The two demo users are wired in `src/auth/AuthContext.tsx`. Production swap-in is a single function (`signIn`) — the rest of the app already operates against the typed `User` model.

---

## 3. Platform strategy

| Surface | Layout | Implementation notes |
|---|---|---|
| **iOS / Android** (Expo Go or native build) | Bottom-tab navigation, single-column screens, slide-up overlays, floating "সাথীকে জিজ্ঞেস করুন" button. | React Navigation `BottomTabNavigator`. Uses real device safe-area insets via `react-native-safe-area-context`. |
| **Web (desktop, ≥1024 px)** | Left sidebar with logo / nav / Saathi pill / Approvals / PO Portal entry, multi-column responsive content area, right-side drawers for Saathi chat, agent panels, Quick Sale, etc. | Custom `DesktopShell` component. PO Portal becomes a full-bleed dashboard with its own internal sidebar + data table. |
| **Web (tablet / mobile-narrow)** | Same as native mobile (bottom tabs + slide-up overlays). | Threshold: `useResponsive()` returns `isDesktop = window.width >= 1024`. |

**Single codebase principle:** All screens are the same component files. A `useResponsive()` hook drives layout decisions inline. There is **no parallel code tree** for web vs. mobile.

---

## 4. Feature inventory

### 4.1 Authentication

- **Login screen** — username + password, Bengali UI strings, error states for unknown user / wrong password.
- **Quick-demo cards** — one tap pre-fills `joy` or `foysal` credentials (for client demos).
- **Persistent session** — last sign-in is stored in `AsyncStorage` so reloading skips the login screen.
- **Sign-out** from More → "সাইন আউট" (also accessible from the desktop sidebar user pill).
- **Role-aware UI** — the PO Portal entry only appears for users where `user.hasPOPortal === true`.

### 4.2 Home / হোম

Two-tab pulse view (online mode):

- **আজকের খবর (Today's briefing)** — quick stats (today's income, orders, new messages) + four colour-coded brief cards:
  - 🔴 **জরুরি** — customers waiting on a reply.
  - 🟢 **সুযোগ** — demand trend opportunity with mini bar-chart.
  - 🟦 **সাথী করেছে** — what the agent autonomously completed today.
  - 🟠 **স্টক সতর্কতা** — low-stock items with reorder CTA.
  - Plus a PKSF loan-health snapshot.
- **সাপ্তাহিক পালস (Weekly pulse)** — 7-day revenue bar chart, week-over-week delta, order/customer/expense totals, top products list, PKSF score trend sparkline.

On desktop, cards lay out in a 2-column grid; on mobile, single column.

### 4.3 Offline Home / অফলাইন মোড

Same screen surface (toggle in More → "অফলাইন মোড"), but the cards switch to offline-first workflows:

- **আজকের বিক্রি** — primary CTA → Quick Sale.
- **হাট প্রস্তুতি** — countdown to next হাট (rural market day) with day-strip visual.
- **বাকি হিসাব** — total outstanding credit, eldest debtor highlighted.
- **ডিজিটাল যাত্রা** — 6-step migration progress to take an offline business online.
- **PKSF report status** — auto-compiled, sent every 3 days.

Triggering offline mode also surfaces a thin dark banner at the top of the screen: "অফলাইন মোড সক্রিয়".

### 4.4 Quick Sale / কাস্টমার বিক্রি (offline)

- Tap-to-add product tiles (6 seeded products: মিনি ফ্যান, চুলের ক্লিপ, কুলিং বোতল, প্লাস্টিক বক্স, নারিকেল তেল, ছাতা).
- Long-press to decrement.
- Live running total in the header, Bengali numerals.
- Payment selector: **নগদ** (cash) · **বাকি** (credit) · **bKash/Nagad** (MFS); credit mode reveals a customer-name input pre-filled "রহিম মিয়া".
- Final "বিক্রি সংরক্ষণ করুন" → success screen with the total. Backend hook: this is where the offline queue / outbox will live.

### 4.5 হাট প্রস্তুতি — Market-day prep (offline)

- 3-day countdown banner (bn্র / শুক্র / শনি).
- Saathi recommendation: avg revenue across last 3 হাট.
- 5-item interactive checklist (tap to toggle); ready-count updates live.
- Packing timeline: Thu eve / Fri eve / Sat dawn.
- "সাথীকে মনে করিয়ে দিতে বলুন" reminder CTA.

### 4.6 কাস্টমার খাতা — Customer Ledger (offline)

- 7 seeded debtors with name, amount due, days-aged, contact channel (WhatsApp/call).
- Aging buckets shown via colour chip: জরুরি (>30 d) / খেয়াল রাখুন (8-30 d) / সাম্প্রতিক (<8 d).
- Total outstanding in the header.
- "রহিম মিয়াকে SMS পাঠান" reminder action on the oldest debtor.
- "নতুন বাকি যোগ করুন" placeholder for new entries.

### 4.7 ডিজিটাল যাত্রা — Digital migration (offline)

- 6-step roadmap from "হিসাব লেখা শুরু" to "Daraz/অনলাইন মার্কেটপ্লেস".
- Vertical timeline UI; step 1 marked done, step 2 marked current.
- Each step has a status chip (সম্পন্ন / চলমান), and the current step exposes "এখন শুরু করুন".
- 17% progress bar at the top.

### 4.8 বার্তা — Messages / CRM

Four sub-tabs:

- **ইনবক্স** — 6 seeded conversations from Facebook / WhatsApp. Each shows platform badge, escalation flag (left border colour), Saathi-handling indicator, time, and category chip (মূল্য আলোচনা, অভিযোগ, সাথী, সমাধান). Filter pills: সব · আপনার জন্য · সাথী দেখছে · সমাধান. Tapping a conversation opens an in-frame chat overlay with bubble history, a Saathi suggestion banner ("১০ পিসে ৫% ছাড় দিন"), and an input composer.
- **লিড** — Hot/medium/cold leads with expiry timers and Saathi insight banner.
- **অর্ডার** — Order list with status chips (প্যাকিং, পথে, ডেলিভার্ড, বাতিল), customer + items + total.
- **ব্রডকাস্ট** — Saathi-proposed campaign (e.g. "মিনি ফ্যান সেলের জন্য ৩৪ জনকে পাঠান?") with one-tap approval, plus recent campaign history.

### 4.9 বাজার — Market

Four sub-tabs:

- **সুযোগ** — Hottest opportunity card with score bars (চাহিদা / প্রতিযোগিতা / লাভ), plus more-opportunity list.
- **সোর্সিং** — Three supplier cards with location, rating, price, trust badge.
- **মৌসুম** — 3-month seasonal calendar with product tag clouds.
- **প্রতিযোগী** — Nearby competitor list with distance, rating, price, vs. your price.

### 4.10 হিসাব — Finance

Three sub-tabs:

- **আয়-ব্যয়** — Weekly stat pills, dual-bar chart (income + expense per day), recent transactions ledger.
- **ইনভেন্টরি** — 6 stock items with quantity & low-stock chip; Saathi summary banner ("২টি পণ্য কম স্টক").
- **PKSF রিপোর্ট** — Loan-health "৭২০ / ১০০০" with monthly delta, 4-component score breakdown bars (নিয়মিত আয়, হিসাব রক্ষণ, গ্রাহক বৃদ্ধি, ডিজিটাল উপস্থিতি), Saathi recommendation, CTA → "বিস্তারিত রিপোর্ট".

### 4.11 সাথী Chat — AI assistant overlay

- Mobile: full-screen slide-up. Desktop: 440 px right-side drawer.
- Header with সাথী badge, "সবসময় শুনছে" status, options menu.
- Initial greeting + daily summary message.
- Keyword-aware mock responses: বিক্রি (sales), বাকি (credit), রিঅর্ডার (restock), রিপোর্ট (report). Each produces text + an inline result card (summary card, reorder card).
- Quick prompt chips above the composer.
- Composer with text input + mic toggle (icon swaps to send when input has text).

### 4.12 সাথী Live — Agent command center

- Dark theme command-center surface.
- Breathing AI orb with "সাথী কাজ করছে" status + scope subtitle ("২৪ ঘ × ৭ দিন · এখন: কাস্টমার বার্তা পর্যবেক্ষণ").
- Live activity feed: drafted replies, completed orders, market signals.
- Today's KPI tiles: messages handled / time saved.
- Entry points to **অটোপাইলট** (Autopilot trust controls) and **অনুমোদন কেন্দ্র** (Approvals queue).

### 4.13 অটোপাইলট — Trust controls

- Trust-stage banner ("বিশ্বাস স্তর: ২য় ধাপ").
- 4 toggle rows:
  - অর্ডার নিশ্চিতকরণ (orders ≤৳২,০০০ auto-confirm)
  - কাস্টমার বার্তার উত্তর (per-reply approval)
  - রিঅর্ডার অর্ডার দেওয়া (approval required)
  - বাজার পর্যবেক্ষণ (24/7 autonomous)

### 4.14 অনুমোদন কেন্দ্র — Approvals queue

- Pending approval cards with category chip (অভিযোগ / মূল্য / অর্ডার), recipient, age, action description.
- Each card has **অনুমোদন** / **সম্পাদনা** / **বাতিল** actions. Approving or cancelling removes the card from the queue.
- Empty-state graphic + "সব ক্লিয়ার!" when nothing pending.

### 4.15 আরও — More

- Profile card with avatar, full name (Bengali + Latin), `@username`, role chip(s).
- **অফলাইন মোড toggle** — switches the Home tab between online and offline variants project-wide.
- **PKSF PO পোর্টাল** entry — only visible for admin role.
- Settings list: ভাষা · ব্যাকআপ · নিরাপত্তা · সাহায্য (all stub navigations today).
- Sign-out.
- App version footer.

### 4.16 PO পোর্টাল — PKSF Project Officer dashboard

**Mobile layout:** 3 pill tabs (ওভারভিউ / বেনিফিশিয়ারি / মনোযোগ), single column.

**Desktop layout:** internal left sidebar + content area:

- **ওভারভিউ** — 4 KPI tiles (Total beneficiaries / Active this week / Loan-eligible / Need attention), district-health bar chart, Saathi weekly brief in a blue gradient.
- **বেনিফিশিয়ারি** — 7-column table (Name / District / Business / Monthly revenue / Growth / Health score / Loan eligibility). Click any row to expand an inline profile panel with: 4 stat tiles, Saathi narrative summary, "PDF ডাউনলোড (ক্রেডিট কমিটি)" CTA.
- **মনোযোগ** — At-risk beneficiaries (e.g. "রফিকুল ইসলাম · রাজস্ব ৪% কমেছে") with severity chip and "দেখা করার সময় নির্ধারণ" follow-up action.

---

## 5. Technical architecture

### 5.1 Stack

| Layer | Choice | Why |
|---|---|---|
| Runtime | **Expo SDK 54** (managed workflow) | One codebase → iOS, Android, web with EAS Build for native release. |
| Language | **TypeScript 5.9** (strict) | Types catch contract drift early; the typed `User`, `Convo`, `Row` models are the seam where backend will hook in. |
| UI framework | **React 19** + **React Native 0.81** + **react-native-web 0.21** | Native-feeling mobile, real DOM on web. |
| Navigation | **React Navigation v7** (bottom-tabs + native-stack) | Standard, well-supported. |
| State | React `useState` + Context (`AuthContext`) | Adequate for the demo scope; ready to swap in React Query / Zustand when backend lands. |
| Storage | **AsyncStorage** | Persists session + offline preference. Will host the offline queue too. |
| Typography | **Hind Siliguri** (300–700) via `@expo-google-fonts` | Proper Bengali rendering on every platform. |
| Icons | `@expo/vector-icons` (Ionicons + MaterialCommunity) | Tree-shakeable, ships fonts with the bundle. |
| Animation | `Animated` API | Native driver where possible (overlay slides, pulse dot). |
| Vector | `react-native-svg` | Reserved for future chart components. |

### 5.2 Project layout

```
msme/
├── App.tsx                          # font load → AuthProvider → AppFrame → Shell
├── index.ts                         # registerRootComponent
├── app.json                         # Expo manifest (orientation, splash, plugins)
├── tsconfig.json
├── package.json
├── SPEC.md                          # this file
├── README.md                        # run instructions & demo credentials
├── .gitignore                       # standard Expo + secrets
└── src/
    ├── theme/index.ts               # colour, radius, spacing, font, shadow tokens
    ├── auth/
    │   ├── AuthContext.tsx          # USERS map, sign-in, persistent session, offline flag
    │   └── LoginScreen.tsx          # responsive login (centered card on desktop)
    ├── components/
    │   ├── AppFrame.tsx             # useResponsive() hook + provider
    │   ├── AppHeader.tsx            # title + agent pill + notification + avatar (auto-hides cluster on desktop)
    │   ├── atoms.tsx                # T (text), Card, Chip, Btn, SathiBadge, PulseDot, Row, Avatar, SectionHeader
    │   ├── PillTabs.tsx             # inner segmented control
    │   ├── SathiFAB.tsx             # floating button (mobile-only)
    │   ├── ScreenContainer.tsx      # ScreenScroll + ResponsiveGrid (max-width + N-column grids)
    │   └── StatPill.tsx
    ├── data/strings.ts              # toBn (Latin→Bengali numerals), bnTaka()
    ├── navigation/
    │   ├── Shell.tsx                # picks MobileShell vs DesktopShell from useResponsive()
    │   ├── MainTabs.tsx             # mobile: bottom tabs + slide-up Overlay component
    │   └── DesktopShell.tsx         # sidebar + right-drawer overlays
    └── screens/
        ├── HomeScreen.tsx           # 2-tab pulse + 4 brief cards in responsive grid
        ├── OfflineHomeScreen.tsx
        ├── MessagesScreen.tsx       # 4 sub-tabs + in-frame conversation overlay
        ├── MarketScreen.tsx
        ├── FinanceScreen.tsx
        ├── MoreScreen.tsx
        ├── SathiChatScreen.tsx      # AI chat overlay (mobile fullscreen / desktop drawer)
        ├── AgentScreens.tsx         # Live + Autopilot + Approvals
        ├── QuickSaleScreen.tsx
        ├── HaatPrepScreen.tsx
        ├── LedgerScreen.tsx
        ├── JourneyScreen.tsx
        └── POPortalScreen.tsx       # admin-only; separate mobile vs desktop layouts
```

### 5.3 Responsive system

- `useWindowDimensions()` drives a `useResponsive()` hook returning `{ width, height, isMobile, isTablet, isDesktop, isWide }`.
- Breakpoints: `tablet ≥ 720`, `desktop ≥ 1024`, `wide ≥ 1400`.
- Re-evaluated live on window resize → screens reflow without reload.
- `<ScreenScroll>` wrapper caps content to ~980 px and centers on desktop; full-bleed on mobile.
- `<ResponsiveGrid>` flows children 1-col on mobile, 2-col on tablet, 2-col on desktop (configurable per use site).

### 5.4 Design tokens

Brand palette (`src/theme/index.ts`):

| Token | Hex | Use |
|---|---|---|
| saffron | `#E8820C` | Primary CTA, accent |
| green | `#1E7D4F` | Positive, growth, ঋণ-যোগ্য |
| teal / tealDark | `#2EC4B6` / `#1FA396` | Saathi brand, agent surface |
| coral | `#E04F4F` | Urgent, complaints, attention-needed |
| amber | `#D89412` | Warnings, low-stock, পর্যবেক্ষণ |
| bg | `#FAF8F4` | App background (warm off-white) |
| ink / ink2 | `#1A1A2E` / `#6B7280` | Primary / secondary text |

Plus matching `*-soft` tints, neutral borders, and shadow tokens.

### 5.5 Localisation & numerals

- All copy in Bengali; English secondary labels on desktop sidebar (e.g. "হোম · Home").
- Bengali numerals throughout via `toBn()` and `bnTaka()` helpers in `src/data/strings.ts`.
- Designed to be extracted into an `i18n.ts` resource map (one English file, one Bengali file) when localisation is formalised.

---

## 6. Data model (seed → backend)

All seed data is co-located with the screen that uses it; the **shape** is what matters for the backend contract. The intended migration is:

```
seed array          →   API resource           →   typed model (already exists)
─────────────────       ────────────────────       ──────────────────────────────
USERS                   POST /auth/login           User              (src/auth/AuthContext.tsx)
MessagesScreen.convos   GET /messages              Convo             (within MessagesScreen.tsx)
products                GET /products              Product           (within QuickSaleScreen.tsx)
debts                   GET /ledger/debtors        DebtorRow         (within LedgerScreen.tsx)
journey steps           GET /journey/steps         JourneyStep       (within JourneyScreen.tsx)
POPortalScreen.rows     GET /po/beneficiaries      Beneficiary       (within POPortalScreen.tsx)
pending (Approvals)     GET /agent/approvals       Approval          (AgentScreens.tsx)
Saathi chat replies     POST /sathi/message        SathiTurn         (SathiChatScreen.tsx)
```

A future PR can lift these into `src/api/` modules per resource and replace local arrays with a React Query (or SWR) hook. The screen components already accept their data via props or read from local state, so the swap is localised.

---

## 7. Offline behaviour

Today: the `offline` flag in `AuthContext` is a simple boolean toggled from **More**. When `true`, the Home tab swaps to the offline variant and the app shows a thin "অফলাইন মোড সক্রিয়" banner.

Once backend is wired, the recommended pattern:

- **Detect network state** via `expo-network` + `@react-native-community/netinfo` and merge with the manual toggle.
- **Outbox queue** in AsyncStorage: every Quick Sale, ledger update, and journey-step completion is appended locally, then drained when connectivity returns.
- **Last-known-good cache** for the Home tab so the briefing renders without spinners on cold start.

---

## 8. Security considerations

- **Auth:** today's `USERS` map is a placeholder. Replace `signIn` with a call to the auth endpoint, persist the token (not the full user object) in AsyncStorage, and refresh on app foreground.
- **Storage:** anything sensitive (tokens, PII) should move to **`expo-secure-store`** (Keychain/Keystore) instead of AsyncStorage.
- **Network:** all API calls should be HTTPS, with cert pinning where the backend allows.
- **PII handling:** the PO Portal displays revenue and loan-eligibility data; on production builds, ensure analytics SDKs (Sentry, Amplitude, etc.) are configured to scrub these fields.
- **Roles enforced server-side:** the `hasPOPortal` flag drives UI visibility today, but the backend must independently authorise every `/po/*` endpoint by user role.

---

## 9. Performance notes

- Bundle sizes (production export, today):
  - Web JS bundle: **~1.4 MB** uncompressed.
  - Android JS bundle: **~6.7 MB** uncompressed (includes vector-icon fonts; trim with `expo-font` selective loading once final icon set is locked).
  - Assets: 35 files (mostly icon and Bengali font weights, ~3 MB total).
- All screens are static-data driven today, so first paint is immediate after font load (~200-400 ms cached).
- Bottom-tab navigator is lazy-mounted per screen via React Navigation.
- Overlays use `useNativeDriver: true` for transforms; no layout thrash on slide.

---

## 10. Build & release

### 10.1 Development

```bash
npm install
npm start                  # interactive: a (Android) · i (iOS) · w (web)
```

Hot reload on all three targets simultaneously.

### 10.2 Production

| Target | Command | Output |
|---|---|---|
| Web (static hosting) | `npx expo export --platform web -d dist` | `dist/` — deploy to Netlify / Vercel / S3+CloudFront. |
| Android (managed) | `eas build --platform android --profile production` | `.aab` for Play Store. |
| iOS (managed) | `eas build --platform ios --profile production` | `.ipa` for App Store / TestFlight. |
| Internal preview | `eas update --branch staging` | OTA delivery to the staging channel — Android/iOS testers get the new JS without a store review. |

### 10.3 CI gates

- `npx tsc --noEmit` — must pass (currently clean).
- `npx expo export --platform web -d /tmp/out` — bundling smoke test (currently clean, ~1.4 MB JS).
- `eas build --profile preview` per PR (optional) — produces installable previews on internal devices.

---

## 11. Open items for the backend phase

Strict no-backend assumption in this build. The integration plan:

1. **API contract.** Author OpenAPI / TS schemas for the 8 resources listed in §6. Generate types into `src/api/types.gen.ts` and replace inline type definitions in screens.
2. **Auth service.** Token-based (JWT or session cookie). Wire into `signIn`; add token refresh on 401.
3. **Sync layer.** React Query for cache + invalidation. Mutation hooks for Quick Sale, Approvals, Ledger entries.
4. **Push.** `expo-notifications` for Saathi reminders, approval pings, PO alerts.
5. **Realtime.** WebSocket or SSE for the agent's "Live" surface — today the activity feed is static; the production feed should stream.
6. **Analytics.** PostHog or Amplitude — capture screen views, approval actions, offline-mode usage, and PO Portal engagement.
7. **Crash reporting.** Sentry with source-map upload from EAS.
8. **i18n formalisation.** Extract every Bengali string to `src/locales/bn.json`, add English mirror, gate via a language preference in the user profile.
9. **Accessibility audit.** Add `accessibilityLabel` / `accessibilityRole` props; verify VoiceOver / TalkBack flow on key tasks (login, quick sale, approve).

---

## 12. Roadmap suggestions (post-presentation)

| Phase | Scope | Effort |
|---|---|---|
| **P1 — Backend wire-up** | Items 1-3 in §11 (API, auth, sync). Replace seed arrays with API hooks. | ~3-4 wk |
| **P2 — Real Saathi** | Connect chat composer to the LLM endpoint; agent feed to streaming events. | ~3 wk (concurrent with backend) |
| **P3 — Offline durability** | Outbox queue, conflict resolution, periodic background sync. | ~2 wk |
| **P4 — PKSF integration** | Real beneficiary data, PDF generation for the credit committee export. | ~2-3 wk + PKSF data access |
| **P5 — Push + notifications** | Reminder schedule for Saathi, approval alerts, payment-due alerts. | ~1 wk |
| **P6 — Store submission** | App Store + Play Store assets, privacy disclosures, beta cycle. | ~2 wk |
| **P7 — Field pilot** | Selected PKSF officer cohort, 30-50 MSME beneficiaries, instrumented telemetry. | 4-6 wk learning |

---

## 13. Demo script (5 minutes)

1. **Sign in as `foysal` / `1234`** → land on the bilingual Home tab; explain the 4 briefing cards.
2. Tap **সাপ্তাহিক পালস** → show weekly chart, PKSF score sparkline.
3. Switch to **বার্তা**, tap any conversation → show in-chat Saathi suggestion banner.
4. Tap the **সাথী চলছে** pill → show the Agent Live command center.
5. From there, **অটোপাইলট** → trust toggles. Back, then **অনুমোদন কেন্দ্র** → approve one item, show it disappear from the queue.
6. Go to **আরও**, flip **অফলাইন মোড** → return to Home; show the offline banner and the swapped cards.
7. Tap **আজকের বিক্রি** → Quick Sale; add 2-3 items; pick বাকি payment → save.
8. Open **কাস্টমার খাতা** → show debt aging.
9. Sign out, sign in as **`joy` / `1234`** → in **আরও**, tap PKSF PO পোর্টাল.
10. Show the dashboard: KPI tiles, beneficiary table, click a row → expanded profile; switch to **মনোযোগ** → at-risk list.

End: same flows render on iOS, Android (in Expo Go), and a desktop browser — one codebase.

---

## Appendix A — Glossary

| Term | Meaning |
|---|---|
| **MSME** | Micro, Small, Medium Enterprise. PKSF's primary lending segment. |
| **PKSF** | Palli Karma-Sahayak Foundation — Bangladesh's apex microfinance institution. |
| **PO** | Project Officer (PKSF field staff). |
| **সাথী / Saathi** | The AI companion brand within the app. |
| **হাট** | Periodic rural market day. |
| **বাকি** | Outstanding credit / a customer "tab". |
| **MFS** | Mobile Financial Service (bKash, Nagad, Rocket). |
| **EAS** | Expo Application Services (cloud build + OTA update pipeline). |
