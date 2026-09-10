"use client";

import { useEffect, useState } from "react";

const R = 34;
const CIRCUMFERENCE = 2 * Math.PI * R;

/** Composite vibe score as a sweeping ring that counts up on mount. */
export default function ScoreDial({ score, accent }: { score: number; accent: string }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic, so the number decelerates into place
      setShown(Math.round(score * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="relative size-24 shrink-0">
      <svg viewBox="0 0 80 80" className="size-full -rotate-90">
        <circle cx={40} cy={40} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
        <circle
          cx={40}
          cy={40}
          r={R}
          fill="none"
          stroke={accent}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - shown / 100)}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-mono text-xl font-semibold tabular-nums">{shown}</span>
        <span className="-mt-1 font-mono text-[10px] text-muted">/ 100</span>
      </div>
    </div>
  );
}
