"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ResultCard from "@/components/ResultCard";
import { encodeShareCode } from "@/lib/share";
import { QUESTIONS, buildResult } from "@/lib/vibe";

const INTRO = -1;
const RESULT = QUESTIONS.length;

export default function VibeQuiz({ origin }: { origin: string }) {
  const [step, setStep] = useState(INTRO);
  /** Answer indexes rather than answers, so a share code falls straight out. */
  const [picks, setPicks] = useState<Array<number | undefined>>(
    () => Array(QUESTIONS.length).fill(undefined),
  );
  const [pending, setPending] = useState<number | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  const question = step >= 0 && step < QUESTIONS.length ? QUESTIONS[step] : null;

  const choose = useCallback(
    (index: number) => {
      if (advanceTimer.current) return;
      setPending(index);
      setPicks((prev) => {
        const next = [...prev];
        next[step] = index;
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
        choose(n - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [question, choose, back]);

  const result = useMemo(() => {
    if (step !== RESULT) return null;
    return buildResult(picks.map((i, qi) => (i === undefined ? undefined : QUESTIONS[qi].answers[i])));
  }, [step, picks]);

  const restart = () => {
    setPicks(Array(QUESTIONS.length).fill(undefined));
    setStep(INTRO);
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
              const active = pending === i || picks[step] === i;
              return (
                <button
                  key={answer.id}
                  onClick={() => choose(i)}
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
  return (
    <ResultCard
      result={result}
      code={encodeShareCode(picks)}
      origin={origin}
      onRestart={restart}
    />
  );
}
