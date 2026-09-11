"use client";

import Link from "next/link";
import Canary from "@/components/Canary";
import ScoreDial from "@/components/ScoreDial";
import ShareBar from "@/components/ShareBar";
import VibeMeters from "@/components/VibeMeters";
import { sharePath } from "@/lib/share";
import type { VibeResult } from "@/lib/vibe";

const VERDICT_TONE = {
  pass: "border-cyan/40 bg-cyan/10 text-cyan",
  watch: "border-violet/40 bg-violet/10 text-violet",
  fail: "border-pink/40 bg-pink/10 text-pink",
} as const;

export default function ResultCard({
  result,
  code,
  origin,
  onRestart,
}: {
  result: VibeResult;
  /** Share code for this exact result. */
  code: string;
  /**
   * Absolute origin, resolved on the server. Deliberately not read from
   * window.location: a share link should carry the canonical public URL even
   * when it's generated from a preview deployment.
   */
  origin: string;
  /** Provided by the quiz; absent on a shared link, which links home instead. */
  onRestart?: () => void;
}) {
  const { persona, score, scores } = result;
  const shareUrl = `${origin}${sharePath(code)}`;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="hns-card grid overflow-hidden rounded-2xl lg:grid-cols-[1.05fr_1fr]">
        {/* Canary stage */}
        <div className="relative flex min-h-[420px] items-center justify-center border-b border-line p-6 lg:border-b-0 lg:border-r">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background: `radial-gradient(ellipse 60% 55% at 50% 45%, ${persona.accent}22, transparent 70%)`,
            }}
          />
          <Canary result={result} className="hns-rise relative w-full max-w-[380px]" />
        </div>

        {/* Report */}
        <div className="p-7 sm:p-9">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Your canary</p>
              <h2 className="hns-rise mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                {persona.name}
              </h2>
              <p className="mt-1.5 text-sm text-muted">{persona.tagline}</p>
            </div>
            <ScoreDial score={score} accent={persona.accent} />
          </div>

          <span
            className={`mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] ${
              VERDICT_TONE[persona.verdictTone]
            }`}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {persona.verdict}
          </span>

          <p className="mt-5 text-[15px] leading-relaxed text-muted">{persona.description}</p>

          <div className="mt-7">
            <VibeMeters scores={scores} />
          </div>

          <div className="mt-8">
            {onRestart ? (
              <button
                onClick={onRestart}
                className="rounded-full bg-gradient-to-r from-blue to-cyan px-6 py-2.5 text-sm font-semibold text-[#04121c] transition hover:brightness-110"
              >
                Run it again
              </button>
            ) : (
              <Link
                href="/"
                className="inline-block rounded-full bg-gradient-to-r from-blue to-cyan px-6 py-2.5 text-sm font-semibold text-[#04121c] transition hover:brightness-110"
              >
                Check your own vibe
              </Link>
            )}
          </div>

          <ShareBar result={result} url={shareUrl} />
        </div>
      </div>
    </div>
  );
}
