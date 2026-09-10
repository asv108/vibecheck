import type { CSSProperties } from "react";
import type { MoteKind, VibeResult } from "@/lib/vibe";

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

const MOTE_SLOTS = [
  { x: 96, y: 130, drift: -18, spin: -22, delay: 0 },
  { x: 244, y: 108, drift: 16, spin: 20, delay: 0.45 },
  { x: 72, y: 196, drift: -12, spin: 14, delay: 0.9 },
  { x: 258, y: 176, drift: 14, spin: -16, delay: 1.35 },
  { x: 160, y: 84, drift: 6, spin: 10, delay: 1.8 },
];

function Mote({ kind, color, index }: { kind: MoteKind; color: string; index: number }) {
  const slot = MOTE_SLOTS[index % MOTE_SLOTS.length];
  const style: MoteStyle = {
    "--drift": `${slot.drift}px`,
    "--spin": `${slot.spin}deg`,
    animationDelay: `${slot.delay}s`,
  };

  const glyph = () => {
    switch (kind) {
      case "notes":
        return (
          <text
            x={slot.x}
            y={slot.y}
            fill={color}
            fontSize={26}
            fontFamily="var(--font-sans), sans-serif"
          >
            {index % 2 === 0 ? "♪" : "♫"}
          </text>
        );
      case "zzz":
        return (
          <text
            x={slot.x}
            y={slot.y}
            fill={color}
            fontSize={22}
            fontWeight={700}
            fontFamily="var(--font-mono), monospace"
          >
            z
          </text>
        );
      case "static":
        return (
          <path
            d={`M${slot.x} ${slot.y} l6 -7 l3 12 l6 -9`}
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
          />
        );
      case "embers":
        return (
          <path
            d={`M${slot.x} ${slot.y} c5 -6 6 -11 2 -16 c9 4 12 12 7 18 c-3 4 -9 3 -9 -2z`}
            fill={color}
            opacity={0.9}
          />
        );
      case "sparks":
      default:
        return (
          <path
            d={`M${slot.x} ${slot.y - 9} l2.6 6.4 l6.4 2.6 l-6.4 2.6 l-2.6 6.4 l-2.6 -6.4 l-6.4 -2.6 l6.4 -2.6z`}
            fill={color}
          />
        );
    }
  };

  return (
    <g className="canary-mote" style={style} opacity={0.85}>
      {glyph()}
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
      viewBox="0 0 320 320"
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
      {[0, 1, 2, 3, 4].map((i) => (
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
            <path
              d="M122 174 C98 168 70 169 48 179 C72 184 99 185 122 183 Z"
              fill={plumage.body}
              opacity={0.9}
            />
            <path
              d="M122 182 C96 181 66 187 44 199 C70 202 100 197 122 191 Z"
              fill={plumage.shade}
            />
            <path
              d="M122 190 C100 194 76 205 58 220 C82 216 106 205 123 198 Z"
              fill={plumage.shade}
              opacity={0.82}
            />
          </g>

          {/* Body */}
          <ellipse cx={160} cy={188} rx={55} ry={49} fill="url(#canary-body-fill)" />
          <ellipse cx={154} cy={202} rx={39} ry={32} fill={plumage.belly} opacity={0.55} />

          {/* Legs */}
          <g stroke={plumage.shade} strokeWidth={5} strokeLinecap="round" fill="none">
            <path d="M147 232 L144 250" />
            <path d="M172 232 L176 250" />
          </g>
          <g stroke={plumage.shade} strokeWidth={3.5} strokeLinecap="round" fill="none">
            <path d="M144 250 l-8 4 M144 250 l7 4" />
            <path d="M176 250 l-7 4 M176 250 l8 4" />
          </g>

          {/* Near wing */}
          <g className="canary-wing">
            <path
              d="M178 156 c-22 4 -46 22 -56 48 c22 8 46 2 60 -16 c8 -11 6 -25 -4 -32z"
              fill="url(#canary-wing-fill)"
            />
            <path
              d="M168 172 c-16 6 -28 18 -34 32 M180 180 c-14 6 -24 16 -30 28"
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
              <path d="M188 104 c-4 -18 2 -30 12 -36 c-2 12 2 20 8 26z" fill={plumage.crest} />
              <path d="M200 100 c2 -16 10 -25 20 -28 c-6 10 -6 20 -3 27z" fill={plumage.body} />
            </g>

            <circle cx={198} cy={136} r={35} fill="url(#canary-body-fill)" />
            <ellipse cx={188} cy={152} rx={18} ry={13} fill={plumage.belly} opacity={0.4} />
            <ellipse cx={212} cy={152} rx={9} ry={6} fill={accent} opacity={0.3} />

            {/* Beak */}
            <path d="M230 134 L256 141 L230 149 Z" fill="#f08a1d" />
            <path d="M230 141 L256 141 L230 149 Z" fill="#c96a0c" />

            {/* Eye */}
            <g style={{ transform: `scaleY(${motion.eyeOpen})`, transformBox: "fill-box", transformOrigin: "50% 50%" }}>
              <g className="canary-eyelid">
                <ellipse cx={214} cy={128} rx={8.5} ry={9.5} fill="#12151f" />
                <circle cx={217} cy={124.5} r={3} fill="#ffffff" opacity={0.9} />
                <circle cx={211} cy={132} r={1.4} fill="#ffffff" opacity={0.5} />
              </g>
            </g>
            {/* Brow: angles down when the vibe is rough */}
            <path
              d={`M204 ${115 - Math.round(motion.eyeOpen * 3)} L226 ${112 + Math.round((1 - motion.eyeOpen) * 9)}`}
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
