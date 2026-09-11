/**
 * Share codes.
 *
 * A result is fully determined by which answer was picked for each question, so
 * a share link only needs those indexes: one digit per question, e.g. "02130".
 * That keeps links short, needs no database, and means an old link still
 * resolves as long as the questions haven't been reordered.
 */

import { QUESTIONS, buildResult, type Answer, type VibeResult } from "@/lib/vibe";

export const SHARE_CODE_LENGTH = QUESTIONS.length;

export function encodeShareCode(selections: Array<number | undefined>): string {
  return selections.map((i) => (i === undefined ? "0" : String(i))).join("");
}

/** Returns null for anything malformed — callers should 404 rather than guess. */
export function decodeShareCode(code: string): Answer[] | null {
  if (code.length !== SHARE_CODE_LENGTH) return null;

  const answers: Answer[] = [];
  for (const [qi, question] of QUESTIONS.entries()) {
    const index = Number(code[qi]);
    if (!Number.isInteger(index) || index < 0 || index >= question.answers.length) return null;
    answers.push(question.answers[index]);
  }
  return answers;
}

export function resultFromShareCode(code: string): VibeResult | null {
  const answers = decodeShareCode(code);
  return answers ? buildResult(answers) : null;
}

export function sharePath(code: string): string {
  return `/c/${code}`;
}

/** Absolute base URL. Used server-side for metadataBase and OG image URLs. */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function shareText(result: VibeResult): string {
  const { persona, score } = result;
  return `My vibe check came back: ${persona.name} — ${score}/100, ${persona.verdict}. What's your canary?`;
}

export function shareSummary(result: VibeResult): string {
  const { persona, score, scores } = result;
  return (
    `vibe check → ${persona.name} (${score}/100)\n` +
    `${persona.verdict}\n` +
    `energy ${scores.energy} · mood ${scores.mood} · focus ${scores.focus} · chaos ${scores.chaos}`
  );
}

export type ShareTarget = { id: string; label: string; href: string };

/** Web intent URLs. All three accept a prefilled composer with no API keys. */
export function shareTargets(url: string, text: string): ShareTarget[] {
  const encodedUrl = encodeURIComponent(url);
  return [
    {
      id: "x",
      label: "X",
      href: `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodedUrl}`,
    },
    {
      id: "bluesky",
      label: "Bluesky",
      href: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${text} ${url}`)}`,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];
}
