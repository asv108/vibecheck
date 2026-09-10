# vibecheck

A sample app for testing Harness Vibe mode. Five questions in, one animated canary out.

You answer five questions about your day. The app scores four vibe dimensions — **energy**,
**mood**, **focus**, **chaos** — picks a canary persona, and renders an animated SVG canary whose
plumage, tempo, wing flap, eye and emitted particles are all driven by your actual numbers. The
result card frames it as a Harness-style rollout verdict: `PROMOTE TO PRODUCTION` through
`ROLLBACK ADVISED`.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
```

`npm run build` for a production build, `npm run lint` for eslint.

## How it works

| File | Responsibility |
| --- | --- |
| `src/lib/vibe.ts` | Questions, answer effects, scoring, persona selection, and the raw motion numbers |
| `src/components/Canary.tsx` | The canary SVG. Reads `result.motion` and sets CSS variables |
| `src/app/globals.css` | Design tokens plus the whole canary keyframe system |
| `src/components/VibeQuiz.tsx` | Intro → questions → result state machine |
| `src/components/ScoreDial.tsx` | Composite score ring that counts up on mount |
| `src/components/VibeMeters.tsx` | Per-dimension bars, read like a dashboard |

Each answer applies deltas to the four dimensions, which start at `BASE_SCORES` and clamp to
0–100. The composite score weights mood 35%, energy 25%, focus 25%, and inverted chaos 15%.

**Personas.** Seven, all reachable — Radiant, Upbeat, Steady, Frazzled, Crispy, plus two overrides:
high chaos with energy to burn gets you Feral, and bottomed-out energy gets you Sleepy regardless
of score.

**Animation.** `buildResult()` derives numbers (bob amplitude, flap degrees, cycle durations, eye
openness, jitter) from the dimensions. `<Canary />` writes them as CSS custom properties on the
`<svg>` root; the keyframes in `globals.css` consume them via `calc()`. So personas share a palette
but no two birds move identically. Everything collapses under
`prefers-reduced-motion: reduce`.

## Adding a question

Append to `QUESTIONS` in `src/lib/vibe.ts` with four answers and their `effects`. Scoring, the
progress bar, and keyboard shortcuts all read the array length — nothing else needs to change.

## Notes

Keyboard: `1`–`4` picks an answer, `Backspace` goes back. Built on Next.js 16 (App Router),
React 19, TypeScript, and Tailwind v4. No animation library, no image assets — the canary is
hand-authored SVG paths and CSS keyframes.
