# AeroPulse Bike Studio — aeropulse.puchup.com (Demo)

Frontend-only Next.js (App Router) demo for a SSS-Tier performance bike
studio, built as a **PuchUp concept demo** — a top ribbon and the
"Powered by PuchUp Engine" badge both label it clearly as a demo, not a live
shop. No backend beyond two small API routes (image generation and the AI
chat), no database, no payment — all product/stock data is mock data shaped
like a real catalog so it's a drop-in swap for a CMS/API later.

## Domain / project separation

| Domain | Project folder | Notes |
|--------|----------------|-------|
| `aeropulse.puchup.com` | `D:\PuchUp\aeropulse.puchup.com` | This demo (separate deploy) |
| `puchup.com` | `D:\PuchUp\puchup.com` | Brand site v2 |
| `puchong.puchup.com` | `D:\PuchUp\Kuncharoen` | Personal — do not merge |

Host this app as its **own** Cloudflare/Vercel project. Do not attach it to the `puchong` subdomain project.

Because `/api/ai-expert` and `/api/generate-image` need a Node runtime, prefer **Vercel** or Cloudflare Workers (OpenNext) — not pure static Pages `out/`.

## Stack
Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · lucide-react

## Quick start
```bash
npm install
cp .env.example .env.local   # optional — the demo runs with no keys set
npm run dev
```
Open http://localhost:3000. Every image renders immediately via a
deterministic placeholder service, and the AI chat works via a rule-based
fallback — no API keys required to preview.

## Architecture: two interfaces, one engine
There are two ways into a recommendation, and both feed the *same* engine —
chat is not a separate recommendation system, it's another interface onto
`lib/finder-engine.ts`:

```
                  CUSTOMER
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
   SMART UI (Finder.tsx)   AI CHAT (AIExpertChat.tsx)
   7 tap-through questions  free-text, via /api/ai-expert
          │                     │
          └──────────┬──────────┘
                     ↓
         BUSINESS ENGINE (lib/finder-engine.ts)
         getRecommendations(answers) — same scoring,
         same FinderAnswers shape, either way in
                     │
                     ↓
                  RESULTS
                     │
           ┌─────────┼─────────┐
           ↓         ↓         ↓
        PRODUCT    COMPARE    LINE HANDOFF
```

- **Smart Finder button** (header/hero) → `components/Finder.tsx` → 7 tap
  questions → `getRecommendations()`.
- **AeroPulse Expert avatar** (bottom-right, `PersonaLauncher.tsx`) →
  `components/AIExpertChat.tsx` → free-text conversation →
  `app/api/ai-expert/route.ts` extracts the same `FinderAnswers` fields turn
  by turn → once complete, calls the identical `getRecommendations()`.

Both paths land on the same `Results` screen. The AI never invents a
recommendation itself — it only fills in structured fields; the scoring
logic stays centralized and auditable in one file.

## Wiring up the real AI Expert chat (Claude)
Set `ANTHROPIC_API_KEY` in `.env.local`. `app/api/ai-expert/route.ts` calls
Claude with a forced tool-use call (`record_finder_answers`) so every reply
comes back as structured `FinderAnswers` fields plus a conversational reply
— never freeform recommendations. Without the key, it falls back to
`lib/ai-expert-fallback.ts`, a small Thai keyword extractor that keeps the
flow working with zero configuration.

## Wiring up real image generation (Google Imagen)
Set `GOOGLE_IMAGEN_API_KEY` in `.env.local`. All 10 product hero shots, their
detail close-ups, and the 5 lifestyle images already have production-ready
prompts in `lib/data.ts`. The route at
`app/api/generate-image/route.ts` calls Imagen server-side (the key is never
exposed to the browser) and automatically falls back to the placeholder
service if the call fails for any reason — the UI never breaks either way.

## Wiring up the real LINE OA
Set `NEXT_PUBLIC_LINE_OA_ID` to the shop's LINE Basic ID (e.g. `@aeropulse`).
The Compare page, Product page, and Stock Check page all route into
`components/LineHandoff.tsx`, which builds a pre-filled message summarising
the exact bike + size the customer picked, then deep-links into
`https://line.me/R/oaMessage/...`. Without the ID set, customers get a
"copy message" button instead so the flow never dead-ends.

## Flow implemented
Home → Smart Finder *or* AeroPulse Expert chat (state machine in
`lib/finder-engine.ts`) → Recommendation Results (BEST FIT / BEST VALUE /
PERFORMANCE PICK) → Product Detail → Compare (up to 3) → Stock Check → LINE
Handoff. Every screen is reachable directly from the header nav too.

## Key files
- `lib/types.ts` — all shared data shapes
- `lib/data.ts` — 10 bikes + 5 lifestyle images, each with an Imagen prompt
- `lib/finder-engine.ts` — the Business Engine: scoring logic + the
  structured finder's state machine (idle → answering → validating →
  calculating → results/no-match)
- `lib/ai-expert-fallback.ts` — zero-config keyword extractor used when
  `ANTHROPIC_API_KEY` isn't set
- `app/api/ai-expert/route.ts` — Claude tool-use call + fallback
- `app/api/generate-image/route.ts` — Imagen call + fallback
- `lib/use-generated-image.ts` + `components/GeneratedImage.tsx` — client
  fetch/cache/render for generated images
- `components/PersonaLauncher.tsx` + `components/AIExpertChat.tsx` — the
  AI CHAT entry point
- `components/DemoRibbon.tsx` — the "PUCHUP DEMO" label
- `app/page.tsx` — view-state orchestrator for the whole flow

## Notes
- All prices, stock levels, and match scores are illustrative demo data.
- Size guidance is explicitly labelled as a preliminary estimate everywhere
  it appears, with a prompt to have a fitter confirm — per the original brief.
- Design tokens (colors, type) live in `tailwind.config.ts` and
  `app/layout.tsx` (font loading).
