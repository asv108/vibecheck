import type { CSSProperties } from "react";
import type { MoteKind, VibeResult } from "@/lib/vibe";
import { MOTE_SLOTS, PATHS, VIEWBOX, browPath, moteGlyph } from "@/lib/canaryArt";

type CanaryStyle = CSSProperties & {
  "--tempo": string;
  "--wing-tempo": string;
  "--flap": number;
  "--bob": number;
  "--lean": number;
  "--nod": number;
  "--chaos": number;
  "--mote-tempo": string;
};

type MoteStyle = CSSProperties & {
  "--drift": string;
  "--spin": string;
};

function Mote({ kind, color, index }: { kind: MoteKind; color: string; index: number }) {
  const slot = MOTE_SLOTS[index % MOTE_SLOTS.length];
  const glyph = moteGlyph(kind, slot, index);
  const style: MoteStyle = {
    "--drift": `${slot.drift}px`,
    "--spin": `${slot.spin}deg`,
    animationDelay: `${slot.delay}s`,
  };

  return (
    <g className="canary-mote" style={style} opacity={0.85}>
      {glyph.kind === "text" ? (
        <text
          x={slot.x}
          y={slot.y}
          fill={color}
          fontSize={glyph.size}
          fontWeight={glyph.mono ? 700 : undefined}
          fontFamily={glyph.mono ? "var(--font-mono), monospace" : "var(--font-sans), sans-serif"}
        >
          {glyph.char}
        </text>
      ) : glyph.stroke ? (
        <path d={glyph.d} stroke={color} strokeWidth={2.5} strokeLinecap="round" fill="none" />
      ) : (
        <path d={glyph.d} fill={color} />
      )}
    </g>
  );
}

export default function Canary({
  result,
  className = "",
}: {
  result: VibeResult;
  className?: string;
}) {
  const { motion, persona } = result;
  const { plumage, accent } = persona;

  const rootStyle = {
    "--tempo": `${motion.tempo}s`,
    "--wing-tempo": `${motion.wingTempo}s`,
    "--flap": motion.flap,
    "--bob": motion.bob,
    "--lean": motion.lean,
    "--nod": motion.nod,
    "--chaos": motion.chaos,
    "--mote-tempo": `${motion.moteTempo}s`,
  } as CanaryStyle;

  return (
    <svg
      viewBox={VIEWBOX}
      className={className}
      style={rootStyle}
      role="img"
      aria-label={`${persona.name}: ${persona.tagline}`}
    >
      <defs>
        <radialGradient id="canary-aura-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity={0.5} />
          <stop offset="55%" stopColor={accent} stopOpacity={0.14} />
          <stop offset="100%" stopColor={accent} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="canary-body-fill" x1="20%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor={plumage.crest} />
          <stop offset="45%" stopColor={plumage.body} />
          <stop offset="100%" stopColor={plumage.shade} />
        </linearGradient>
        <linearGradient id="canary-wing-fill" x1="70%" y1="0%" x2="10%" y2="100%">
          <stop offset="0%" stopColor={plumage.body} />
          <stop offset="100%" stopColor={plumage.shade} />
        </linearGradient>
        <linearGradient id="canary-perch-fill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a4358" />
          <stop offset="100%" stopColor="#1b2130" />
        </linearGradient>
      </defs>

      {/* Mood aura */}
      <circle className="canary-aura" cx={160} cy={172} r={122} fill="url(#canary-aura-fill)" />

      {/* Emitted motes: notes when happy, static when fried, z's when asleep */}
      {MOTE_SLOTS.map((_, i) => (
        <Mote key={i} kind={persona.motes} color={accent} index={i} />
      ))}

      {/* Perch */}
      <g className="canary-perch">
        <rect x={38} y={250} width={244} height={13} rx={6.5} fill="url(#canary-perch-fill)" />
        <ellipse cx={96} cy={256} rx={11} ry={7} fill="#2a3345" />
        <ellipse cx={232} cy={256} rx={8} ry={6} fill="#2a3345" />
        <ellipse cx={160} cy={281} rx={86} ry={11} fill="#000" opacity={0.35} />
      </g>

      <g className="canary-jitter">
        <g className="canary-bob">
          {/* Tail: three tapered feathers fanned out from the body */}
          <g className="canary-tail">
            <path d={PATHS.tailTop} fill={plumage.body} opacity={0.9} />
            <path d={PATHS.tailMid} fill={plumage.shade} />
            <path d={PATHS.tailLow} fill={plumage.shade} opacity={0.82} />
          </g>

          {/* Body */}
          <ellipse cx={160} cy={188} rx={55} ry={49} fill="url(#canary-body-fill)" />
          <ellipse cx={154} cy={202} rx={39} ry={32} fill={plumage.belly} opacity={0.55} />

          {/* Legs */}
          <g stroke={plumage.shade} strokeWidth={5} strokeLinecap="round" fill="none">
            <path d={PATHS.legLeft} />
            <path d={PATHS.legRight} />
          </g>
          <g stroke={plumage.shade} strokeWidth={3.5} strokeLinecap="round" fill="none">
            <path d={PATHS.feetLeft} />
            <path d={PATHS.feetRight} />
          </g>

          {/* Near wing */}
          <g className="canary-wing">
            <path d={PATHS.wing} fill="url(#canary-wing-fill)" />
            <path
              d={PATHS.wingLines}
              stroke={plumage.crest}
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.45}
              fill="none"
            />
          </g>

          {/* Head */}
          <g className="canary-head">
            {/* Crest feathers */}
            <g className="canary-crest">
              <path d={PATHS.crestBack} fill={plumage.crest} />
              <path d={PATHS.crestFront} fill={plumage.body} />
            </g>

            <circle cx={198} cy={136} r={35} fill="url(#canary-body-fill)" />
            <ellipse cx={188} cy={152} rx={18} ry={13} fill={plumage.belly} opacity={0.4} />
            <ellipse cx={212} cy={152} rx={9} ry={6} fill={accent} opacity={0.3} />

            {/* Beak */}
            <path d={PATHS.beakTop} fill="#f08a1d" />
            <path d={PATHS.beakBottom} fill="#c96a0c" />

            {/* Eye */}
            <g
              style={{
                transform: `scaleY(${motion.eyeOpen})`,
                transformBox: "fill-box",
                transformOrigin: "50% 50%",
              }}
            >
              <g className="canary-eyelid">
                <ellipse cx={214} cy={128} rx={8.5} ry={9.5} fill="#12151f" />
                <circle cx={217} cy={124.5} r={3} fill="#ffffff" opacity={0.9} />
                <circle cx={211} cy={132} r={1.4} fill="#ffffff" opacity={0.5} />
              </g>
            </g>
            {/* Brow: angles down when the vibe is rough */}
            <path
              d={browPath(motion.eyeOpen)}
              stroke={plumage.shade}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.75}
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
