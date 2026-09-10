import { DIMENSION_META, type VibeScores } from "@/lib/vibe";

/** Reads a dimension the way a dashboard would: green = good, not green = look closer. */
function barColor(value: number, invert = false) {
  const good = invert ? 100 - value : value;
  if (good >= 70) return "linear-gradient(90deg, #2ca4ff, #00e5d4)";
  if (good >= 45) return "linear-gradient(90deg, #8b5cf6, #2ca4ff)";
  return "linear-gradient(90deg, #ff5c93, #ff9d4d)";
}

export default function VibeMeters({ scores }: { scores: VibeScores }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {DIMENSION_META.map(({ key, label, caption, invert }, i) => (
        <div
          key={key}
          className="hns-rise rounded-xl border border-line bg-surface-2/60 p-4"
          style={{ animationDelay: `${200 + i * 90}ms` }}
        >
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-sm font-medium text-foreground">{label}</dt>
            <dd className="font-mono text-sm text-muted">{scores[key]}</dd>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full transition-[width] duration-1000 ease-out"
              style={{ width: `${scores[key]}%`, background: barColor(scores[key], invert) }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">{caption}</p>
        </div>
      ))}
    </dl>
  );
}
