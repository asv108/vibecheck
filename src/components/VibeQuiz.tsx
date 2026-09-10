"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Canary from "@/components/Canary";
import VibeMeters from "@/components/VibeMeters";
import ScoreDial from "@/components/ScoreDial";
import { QUESTIONS, buildResult, type Answer } from "@/lib/vibe";

const INTRO = -1;
const RESULT = QUESTIONS.length;

const VERDICT_TONE = {
  pass: "border-cyan/40 bg-cyan/10 text-cyan",
  watch: "border-violet/40 bg-violet/10 text-violet",
  fail: "border-pink/40 bg-pink/10 text-pink",
} as const;

export default function VibeQuiz() {
  const [step, setStep] = useState(INTRO);
  const [answers, setAnswers] = useState<Array<Answer | undefined>>(
    () => Array(QUESTIONS.length).fill(undefined),
  );
  const [pending, setPending] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  const question = step >= 0 && step < QUESTIONS.length ? QUESTIONS[step] : null;

  const choose = useCallback(
    (answer: Answer) => {
      if (advanceTimer.current) return;
      setPending(answer.id);
      setAnswers((prev) => {
        const next = [...prev];
        next[step] = answer;
        return next;
      });
      advanceTimer.current = setTimeout(() => {
        advanceTimer.current = null;
        setPending(null);
        setStep((s) => s + 1);
      }, 260);
    },
    [step],
  );

  const back = useCallback(() => {
    if (advanceTimer.current) return;
    setStep((s) => Math.max(INTRO, s - 1));
  }, []);

  // 1-4 picks an answer, Backspace steps back. Faster than reaching for the mouse.
  useEffect(() => {
    if (!question) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        back();
        return;
      }
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= question.answers.length) {
        choose(question.answers[n - 1]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [question, choose, back]);

  const result = useMemo(
    () => (step === RESULT ? buildResult(answers) : null),
    [step, answers],
  );

  const restart = () => {
    setAnswers(Array(QUESTIONS.length).fill(undefined));
    setCopied(false);
    setStep(INTRO);
  };

  const copyResult = async () => {
    if (!result) return;
    const { persona, score, scores } = result;
    const summary =
      `vibe check → ${persona.name} (${score}/100)\n` +
      `${persona.verdict}\n` +
      `energy ${scores.energy} · mood ${scores.mood} · focus ${scores.focus} · chaos ${scores.chaos}`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  /* ------------------------------------------------------------------ intro */
  if (step === INTRO) {
    return (
      <div className="hns-rise hns-card mx-auto max-w-2xl rounded-2xl p-8 text-center sm:p-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          {QUESTIONS.length} questions · about 30 seconds
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Let&apos;s see what we&apos;re working with.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-balance text-muted">
          Answer honestly. We&apos;ll score your energy, mood, focus and chaos, then render the
          canary that matches — the one you&apos;d send down the mine ahead of you.
        </p>
        <button
          onClick={() => setStep(0)}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue to-cyan px-7 py-3 text-sm font-semibold text-[#04121c] transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Start the vibe check
          <span aria-hidden>→</span>
        </button>
      </div>
    );
  }

  /* --------------------------------------------------------------- question */
  if (question) {
    const progress = (step / QUESTIONS.length) * 100;
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-4">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue to-cyan transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-xs text-muted">
            {step + 1}/{QUESTIONS.length}
          </span>
        </div>

        <div key={question.id} className="hns-rise hns-card mt-6 rounded-2xl p-6 sm:p-9">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">{question.hint}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            {question.prompt}
          </h2>

          <div className="mt-7 grid gap-3">
            {question.answers.map((answer, i) => {
              const active = pending === answer.id || answers[step]?.id === answer.id;
              return (
                <button
                  key={answer.id}
                  onClick={() => choose(answer)}
                  aria-pressed={active}
                  className={`group flex items-center gap-4 rounded-xl border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan ${
                    active
                      ? "border-cyan/60 bg-cyan/10"
                      : "border-line bg-surface-2/50 hover:border-white/25 hover:bg-surface-2"
                  }`}
                >
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-lg border font-mono text-xs transition ${
                      active
                        ? "border-cyan/60 bg-cyan/20 text-cyan"
                        : "border-line bg-white/5 text-muted group-hover:text-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium">{answer.label}</span>
                    <span className="mt-0.5 block text-sm text-muted">{answer.detail}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-muted">
            <button onClick={back} className="transition hover:text-foreground">
              ← Back
            </button>
            <span className="font-mono">press 1–{question.answers.length}</span>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- result */
  if (!result) return null;
  const { persona, score, scores } = result;

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
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                Your canary
              </p>
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

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={restart}
              className="rounded-full bg-gradient-to-r from-blue to-cyan px-6 py-2.5 text-sm font-semibold text-[#04121c] transition hover:brightness-110"
            >
              Run it again
            </button>
            <button
              onClick={copyResult}
              className="rounded-full border border-line bg-white/5 px-6 py-2.5 text-sm font-medium transition hover:border-white/25 hover:bg-white/10"
            >
              {copied ? "Copied ✓" : "Copy result"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
