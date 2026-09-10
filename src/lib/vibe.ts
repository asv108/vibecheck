/**
 * The vibe engine: questions in, a canary persona out.
 *
 * Every answer nudges four dimensions. Those dimensions pick a persona and,
 * separately, drive the raw animation numbers the <Canary /> SVG runs on — so
 * two people who land on the same persona still get a slightly different bird.
 */

export type Dimension = "energy" | "mood" | "focus" | "chaos";

export type VibeScores = Record<Dimension, number>;

export type Answer = {
  id: string;
  label: string;
  detail: string;
  effects: Partial<VibeScores>;
};

export type Question = {
  id: string;
  prompt: string;
  hint: string;
  answers: Answer[];
};

export const QUESTIONS: Question[] = [
  {
    id: "morning",
    prompt: "How did your day boot up?",
    hint: "Cold start, warm start, or crash loop?",
    answers: [
      {
        id: "clean",
        label: "Clean build, first try",
        detail: "Green from the first commit.",
        effects: { energy: 18, mood: 22, focus: 16, chaos: -14 },
      },
      {
        id: "coffee",
        label: "Slow, but caffeinated",
        detail: "Took two coffees to compile.",
        effects: { energy: 8, mood: 8, focus: 4 },
      },
      {
        id: "flaky",
        label: "Flaky tests all morning",
        detail: "Re-run until green. Twice.",
        effects: { energy: -6, mood: -12, focus: -10, chaos: 18 },
      },
      {
        id: "pager",
        label: "Woken up by a pager",
        detail: "3am incident, still upright.",
        effects: { energy: -20, mood: -16, focus: -6, chaos: 24 },
      },
    ],
  },
  {
    id: "inbox",
    prompt: "What does your queue look like?",
    hint: "Notifications, PRs, half-written replies.",
    answers: [
      {
        id: "zero",
        label: "Inbox zero",
        detail: "Nothing pending, nothing owed.",
        effects: { mood: 16, focus: 20, chaos: -20 },
      },
      {
        id: "triaged",
        label: "Triaged, mostly",
        detail: "The important ones are handled.",
        effects: { mood: 6, focus: 8, chaos: -6 },
      },
      {
        id: "unread",
        label: "Forty unread, one urgent",
        detail: "You know which one. You're avoiding it.",
        effects: { mood: -8, focus: -14, chaos: 14 },
      },
      {
        id: "declared",
        label: "Declared bankruptcy",
        detail: "Marked all as read. Freedom.",
        effects: { energy: 6, mood: 10, focus: -6, chaos: 20 },
      },
    ],
  },
  {
    id: "focus",
    prompt: "Where's your attention right now?",
    hint: "Be honest, nobody's watching.",
    answers: [
      {
        id: "flow",
        label: "Deep in flow state",
        detail: "One tab. One problem. Locked in.",
        effects: { energy: 12, mood: 14, focus: 26, chaos: -18 },
      },
      {
        id: "steady",
        label: "Steady, with drift",
        detail: "Focused in twenty-minute chunks.",
        effects: { mood: 4, focus: 10, chaos: -2 },
      },
      {
        id: "tabs",
        label: "Thirty-one tabs deep",
        detail: "One of them is playing audio.",
        effects: { energy: 4, focus: -20, chaos: 20 },
      },
      {
        id: "vacant",
        label: "Staring into the middle distance",
        detail: "The screen is on. You are not.",
        effects: { energy: -18, mood: -6, focus: -22, chaos: 6 },
      },
    ],
  },
  {
    id: "deploy",
    prompt: "Would you deploy to prod right now?",
    hint: "It's 4:47pm on a Friday.",
    answers: [
      {
        id: "confident",
        label: "Absolutely, tests are green",
        detail: "Full confidence, zero hesitation.",
        effects: { energy: 14, mood: 18, focus: 12, chaos: -12 },
      },
      {
        id: "canary",
        label: "Canary it at 5% first",
        detail: "Trust, but verify.",
        effects: { mood: 8, focus: 16, chaos: -16 },
      },
      {
        id: "monday",
        label: "It can wait for Monday",
        detail: "Nothing good ships at 4:47.",
        effects: { energy: -8, mood: 2, focus: 4, chaos: -8 },
      },
      {
        id: "yolo",
        label: "Already pushed it",
        detail: "No pipeline. Pure instinct.",
        effects: { energy: 16, mood: 6, focus: -16, chaos: 30 },
      },
    ],
  },
  {
    id: "battery",
    prompt: "What's your battery reading?",
    hint: "Social, mental, and otherwise.",
    answers: [
      {
        id: "full",
        label: "Fully charged",
        detail: "Could go another eight hours.",
        effects: { energy: 24, mood: 16, focus: 10, chaos: -6 },
      },
      {
        id: "half",
        label: "Comfortable middle",
        detail: "Enough left for what's on the board.",
        effects: { energy: 8, mood: 8, focus: 6, chaos: -4 },
      },
      {
        id: "low",
        label: "Low power mode",
        detail: "Screen dimmed, background apps closed.",
        effects: { energy: -18, mood: -8, focus: -6, chaos: 6 },
      },
      {
        id: "critical",
        label: "Running on fumes",
        detail: "Plugged in and still draining.",
        effects: { energy: -28, mood: -18, focus: -14, chaos: 16 },
      },
    ],
  },
];

export type MoteKind = "notes" | "sparks" | "static" | "zzz" | "embers";

export type CanaryPersona = {
  id: string;
  name: string;
  tagline: string;
  /** Harness-flavored rollout verdict for the result card. */
  verdict: string;
  verdictTone: "pass" | "watch" | "fail";
  description: string;
  plumage: { crest: string; body: string; shade: string; belly: string };
  accent: string;
  motes: MoteKind;
};

const PERSONAS: Record<string, CanaryPersona> = {
  radiant: {
    id: "radiant",
    name: "Radiant Canary",
    tagline: "Peak vibes detected",
    verdict: "PROMOTE TO PRODUCTION",
    verdictTone: "pass",
    description:
      "This canary is singing in a major key. Every signal is green, latency is low, and morale is somehow trending up. Ship whatever you want today.",
    plumage: { crest: "#fff3b0", body: "#ffd53d", shade: "#f2a007", belly: "#fff8d6" },
    accent: "#ffd53d",
    motes: "notes",
  },
  upbeat: {
    id: "upbeat",
    name: "Upbeat Canary",
    tagline: "Healthy and climbing",
    verdict: "CANARY HEALTHY",
    verdictTone: "pass",
    description:
      "Wings up, chest out, no errors in the last window. Not a perfect day, but a genuinely good one — the kind you'd happily roll forward.",
    plumage: { crest: "#fdf0a8", body: "#ffc93c", shade: "#e08a12", belly: "#fdf3cf" },
    accent: "#ffc93c",
    motes: "sparks",
  },
  steady: {
    id: "steady",
    name: "Steady Canary",
    tagline: "Nominal, holding",
    verdict: "METRICS NOMINAL",
    verdictTone: "watch",
    description:
      "Perched, level, unbothered. Nothing is on fire and nothing is exciting. This is the canary equivalent of a clean but uneventful pipeline run.",
    plumage: { crest: "#f6e8b2", body: "#e9b83a", shade: "#bd7f16", belly: "#f4ecd2" },
    accent: "#e9b83a",
    motes: "sparks",
  },
  frazzled: {
    id: "frazzled",
    name: "Frazzled Canary",
    tagline: "Elevated error rate",
    verdict: "ROLLOUT PAUSED",
    verdictTone: "watch",
    description:
      "Feathers pointing in four directions, one eye on the dashboard. Still flying, but the p99 on your patience is creeping up. Take the small win and stop there.",
    plumage: { crest: "#ffd9a0", body: "#f0913c", shade: "#b85a17", belly: "#f7ddbe" },
    accent: "#f0913c",
    motes: "embers",
  },
  crispy: {
    id: "crispy",
    name: "Crispy Canary",
    tagline: "Threshold breached",
    verdict: "ROLLBACK ADVISED",
    verdictTone: "fail",
    description:
      "The canary has seen the coal mine and would like to file a report. Nothing here is unrecoverable, but today is for reverting, not deploying.",
    plumage: { crest: "#cdd6e0", body: "#9aa8bd", shade: "#5f6b80", belly: "#dbe2ec" },
    accent: "#9aa8bd",
    motes: "static",
  },
  feral: {
    id: "feral",
    name: "Feral Canary",
    tagline: "Chaos signal saturated",
    verdict: "UNVERIFIED — SHIPPING ANYWAY",
    verdictTone: "fail",
    description:
      "Vibrating at a frequency the monitors can't sample. Enormous throughput, no observability, absolutely no plan. Somehow it keeps working.",
    plumage: { crest: "#ffe08a", body: "#ff8a3d", shade: "#d92e6b", belly: "#ffd9c2" },
    accent: "#ff5c93",
    motes: "embers",
  },
  sleepy: {
    id: "sleepy",
    name: "Sleepy Canary",
    tagline: "Scaled down to zero",
    verdict: "IDLE — AWAITING TRAFFIC",
    verdictTone: "watch",
    description:
      "One eye open, technically responsive, cold-start latency measured in yawns. Route your requests elsewhere until this instance warms back up.",
    plumage: { crest: "#dfe6f2", body: "#c2b46e", shade: "#8a7f43", belly: "#eceedd" },
    accent: "#a9b6cc",
    motes: "zzz",
  },
};

export type VibeResult = {
  scores: VibeScores;
  /** 0-100 composite. */
  score: number;
  persona: CanaryPersona;
  /** Raw numbers the SVG animates on. */
  motion: {
    /** Base bob/sway cycle, seconds. */
    tempo: number;
    /** Wing flap cycle, seconds. */
    wingTempo: number;
    /** Wing rotation amplitude, degrees. */
    flap: number;
    /** Vertical bob amplitude, px in SVG units. */
    bob: number;
    /** Body lean amplitude multiplier. */
    lean: number;
    /** Head nod amplitude, degrees. */
    nod: number;
    /** Jitter amplitude, 0 = perfectly still. */
    chaos: number;
    /** How wide the eye opens, 0.15 (sleepy) - 1.15 (wired). */
    eyeOpen: number;
    /** Emitted mote cycle, seconds. */
    moteTempo: number;
  };
};

const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp(t, 0, 1);

export const BASE_SCORES: VibeScores = { energy: 50, mood: 50, focus: 50, chaos: 40 };

export function scoreAnswers(selections: Array<Answer | undefined>): VibeScores {
  const totals: VibeScores = { ...BASE_SCORES };
  for (const answer of selections) {
    if (!answer) continue;
    for (const [dim, delta] of Object.entries(answer.effects) as Array<[Dimension, number]>) {
      totals[dim] += delta;
    }
  }
  return {
    energy: clamp(totals.energy),
    mood: clamp(totals.mood),
    focus: clamp(totals.focus),
    chaos: clamp(totals.chaos),
  };
}

export function compositeScore({ energy, mood, focus, chaos }: VibeScores): number {
  return Math.round(mood * 0.35 + energy * 0.25 + focus * 0.25 + (100 - chaos) * 0.15);
}

function pickPersona(scores: VibeScores, score: number): CanaryPersona {
  if (scores.chaos >= 78 && scores.energy >= 45) return PERSONAS.feral;
  if (scores.energy <= 22) return PERSONAS.sleepy;
  if (score >= 82) return PERSONAS.radiant;
  if (score >= 66) return PERSONAS.upbeat;
  if (score >= 50) return PERSONAS.steady;
  if (score >= 34) return PERSONAS.frazzled;
  return PERSONAS.crispy;
}

export function buildResult(selections: Array<Answer | undefined>): VibeResult {
  const scores = scoreAnswers(selections);
  const score = compositeScore(scores);
  const persona = pickPersona(scores, score);
  const e = scores.energy / 100;
  const m = scores.mood / 100;
  const f = scores.focus / 100;
  const c = scores.chaos / 100;

  return {
    scores,
    score,
    persona,
    motion: {
      tempo: Number(lerp(3.6, 1.1, e).toFixed(2)),
      wingTempo: Number(lerp(1.9, 0.28, (e + c) / 2).toFixed(2)),
      flap: Math.round(lerp(6, 34, (m * 0.7 + e * 0.3))),
      bob: Number(lerp(1.5, 7, e).toFixed(1)),
      lean: Number(lerp(0.4, 2.2, m).toFixed(2)),
      nod: Math.round(lerp(2, 11, (e + m) / 2)),
      chaos: Number(lerp(0, 3.2, Math.max(0, c - 0.35) / 0.65).toFixed(2)),
      eyeOpen: Number(lerp(0.2, 1.15, Math.max(e * 0.65 + f * 0.35, c * 0.8)).toFixed(2)),
      moteTempo: Number(lerp(4.2, 1.4, (m + e) / 2).toFixed(2)),
    },
  };
}

export const DIMENSION_META: Array<{ key: Dimension; label: string; caption: string; invert?: boolean }> = [
  { key: "energy", label: "Energy", caption: "throughput" },
  { key: "mood", label: "Mood", caption: "success rate" },
  { key: "focus", label: "Focus", caption: "signal-to-noise" },
  { key: "chaos", label: "Chaos", caption: "error budget burn", invert: true },
];
