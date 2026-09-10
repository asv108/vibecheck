# Vibecheck

## Project Overview
**vibe check** is a sample application for testing Harness Vibe mode. The app is a modern frontend
application in the style of the harness.io website — it asks a few questions and then creates an
animated capital canary based on current vibe results.

## Commands

```bash
npm run dev     # dev server on http://localhost:3000
npm run build   # production build (also typechecks)
npm run lint    # eslint
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4. No animation library and no image
assets — the canary is hand-authored SVG paths driven by CSS keyframes.

## Architecture

| File | Responsibility |
| --- | --- |
| `src/lib/vibe.ts` | Single source of truth: questions, answer effects, scoring, personas, motion numbers |
| `src/components/Canary.tsx` | The canary SVG. Reads `result.motion`, writes CSS custom properties |
| `src/app/globals.css` | Design tokens + the entire canary keyframe system |
| `src/components/VibeQuiz.tsx` | Intro → questions → result state machine (the only stateful component) |
| `src/components/ScoreDial.tsx` | Composite score ring, counts up on mount |
| `src/components/VibeMeters.tsx` | Per-dimension bars |

### How the animation is wired

This is the part to understand before touching the canary. Answers apply deltas to four dimensions
(`energy`, `mood`, `focus`, `chaos`), which start at `BASE_SCORES` and clamp to 0–100.
`buildResult()` then derives two separate things from those dimensions:

1. a **persona** (name, tagline, rollout verdict, plumage palette, particle kind), and
2. a **`motion` object** of raw numbers — cycle durations in seconds, rotation amplitudes in
   degrees, bob distance, eye openness, jitter.

`<Canary />` writes every `motion` value onto the `<svg>` root as a CSS custom property
(`--tempo`, `--flap`, `--bob`, `--chaos`, …). The keyframes in `globals.css` consume them via
`calc()`. So personas share a palette but no two birds move identically, and **the way to change
how the canary moves is to change the numbers in `buildResult()`, not the CSS.**

### Conventions

- Keep scoring, copy, and persona definitions in `src/lib/vibe.ts`. Nothing else should hardcode a
  question count, dimension name, or persona string.
- Adding a question: append to `QUESTIONS` with four answers and their `effects`. The progress bar
  and keyboard shortcuts read the array length, so nothing else needs to change.
- Every canary animation must have a `prefers-reduced-motion: reduce` opt-out. There is one block
  at the bottom of `globals.css` that disables them all — add new animation classes to it.
- Colors come from the `@theme` tokens in `globals.css` (`text-muted`, `border-line`, `bg-surface-2`,
  `from-blue`, `to-cyan`, …). Don't introduce raw hex in components; plumage hex belongs to the
  persona definitions.

### Verifying changes

`npm run build` typechecks, but it will not tell you the bird looks wrong. For canary changes,
run the app and screenshot the result card in a browser — geometry bugs (detached tails, shapes
poking out from behind the body) are only visible there. All seven personas are reachable; to check
that after editing scoring, brute-force the 1024 answer combinations through `buildResult()`.
