/**
 * Canary geometry, shared by the two things that draw the bird:
 *
 * - `<Canary />`, which wraps these shapes in animated groups for the browser
 * - `canarySvgMarkup()`, which flattens them into a static SVG string for the
 *   Open Graph image (Satori rasterizes it, so nothing may animate)
 *
 * Path data lives here and only here — otherwise the shared canary and the
 * one people see in their timeline slowly drift apart.
 */

import type { MoteKind, VibeResult } from "@/lib/vibe";

export const VIEWBOX = "0 0 320 320";

export const PATHS = {
  tailTop: "M122 174 C98 168 70 169 48 179 C72 184 99 185 122 183 Z",
  tailMid: "M122 182 C96 181 66 187 44 199 C70 202 100 197 122 191 Z",
  tailLow: "M122 190 C100 194 76 205 58 220 C82 216 106 205 123 198 Z",
  wing: "M178 156 c-22 4 -46 22 -56 48 c22 8 46 2 60 -16 c8 -11 6 -25 -4 -32z",
  wingLines: "M168 172 c-16 6 -28 18 -34 32 M180 180 c-14 6 -24 16 -30 28",
  legLeft: "M147 232 L144 250",
  legRight: "M172 232 L176 250",
  feetLeft: "M144 250 l-8 4 M144 250 l7 4",
  feetRight: "M176 250 l-7 4 M176 250 l8 4",
  crestBack: "M188 104 c-4 -18 2 -30 12 -36 c-2 12 2 20 8 26z",
  crestFront: "M200 100 c2 -16 10 -25 20 -28 c-6 10 -6 20 -3 27z",
  beakTop: "M230 134 L256 141 L230 149 Z",
  beakBottom: "M230 141 L256 141 L230 149 Z",
} as const;

/** The brow angles down as the eye narrows, which is what sells a bad mood. */
export function browPath(eyeOpen: number): string {
  const top = 115 - Math.round(eyeOpen * 3);
  const drop = 112 + Math.round((1 - eyeOpen) * 9);
  return `M204 ${top} L226 ${drop}`;
}

export type MoteSlot = { x: number; y: number; drift: number; spin: number; delay: number };

export const MOTE_SLOTS: MoteSlot[] = [
  { x: 96, y: 130, drift: -18, spin: -22, delay: 0 },
  { x: 244, y: 108, drift: 16, spin: 20, delay: 0.45 },
  { x: 72, y: 196, drift: -12, spin: 14, delay: 0.9 },
  { x: 258, y: 176, drift: 14, spin: -16, delay: 1.35 },
  { x: 160, y: 84, drift: 6, spin: 10, delay: 1.8 },
];

export type MoteGlyph =
  | { kind: "path"; d: string; stroke?: boolean }
  | { kind: "text"; char: string; size: number; mono?: boolean };

export function moteGlyph(kind: MoteKind, slot: MoteSlot, index: number): MoteGlyph {
  switch (kind) {
    case "notes":
      return { kind: "text", char: index % 2 === 0 ? "♪" : "♫", size: 26 };
    case "zzz":
      return { kind: "text", char: "z", size: 22, mono: true };
    case "static":
      return { kind: "path", d: `M${slot.x} ${slot.y} l6 -7 l3 12 l6 -9`, stroke: true };
    case "embers":
      return {
        kind: "path",
        d: `M${slot.x} ${slot.y} c5 -6 6 -11 2 -16 c9 4 12 12 7 18 c-3 4 -9 3 -9 -2z`,
      };
    case "sparks":
    default:
      return {
        kind: "path",
        d:
          `M${slot.x} ${slot.y - 9} l2.6 6.4 l6.4 2.6 l-6.4 2.6 ` +
          `l-2.6 6.4 l-2.6 -6.4 l-6.4 -2.6 l6.4 -2.6z`,
      };
  }
}

/**
 * A static SVG string of the same bird, posed at rest. Used for the Open Graph
 * card, where Satori rasterizes an <img> data URI and no CSS animation runs.
 */
export function canarySvgMarkup(result: VibeResult): string {
  const { plumage, accent, motes } = result.persona;
  const { eyeOpen } = result.motion;

  const moteMarkup = MOTE_SLOTS.map((slot, i) => {
    const glyph = moteGlyph(motes, slot, i);
    if (glyph.kind === "text") {
      const family = glyph.mono ? "monospace" : "sans-serif";
      return `<text x="${slot.x}" y="${slot.y}" fill="${accent}" font-size="${glyph.size}" font-family="${family}" font-weight="700" opacity="0.85">${glyph.char}</text>`;
    }
    return glyph.stroke
      ? `<path d="${glyph.d}" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.85"/>`
      : `<path d="${glyph.d}" fill="${accent}" opacity="0.85"/>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" width="440" height="440">
  <defs>
    <radialGradient id="a" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.5"/>
      <stop offset="55%" stop-color="${accent}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="b" x1="20%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="${plumage.crest}"/>
      <stop offset="45%" stop-color="${plumage.body}"/>
      <stop offset="100%" stop-color="${plumage.shade}"/>
    </linearGradient>
    <linearGradient id="c" x1="70%" y1="0%" x2="10%" y2="100%">
      <stop offset="0%" stop-color="${plumage.body}"/>
      <stop offset="100%" stop-color="${plumage.shade}"/>
    </linearGradient>
    <linearGradient id="d" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3a4358"/>
      <stop offset="100%" stop-color="#1b2130"/>
    </linearGradient>
  </defs>
  <circle cx="160" cy="172" r="122" fill="url(#a)"/>
  ${moteMarkup}
  <rect x="38" y="250" width="244" height="13" rx="6.5" fill="url(#d)"/>
  <ellipse cx="96" cy="256" rx="11" ry="7" fill="#2a3345"/>
  <ellipse cx="232" cy="256" rx="8" ry="6" fill="#2a3345"/>
  <ellipse cx="160" cy="281" rx="86" ry="11" fill="#000" opacity="0.35"/>
  <path d="${PATHS.tailTop}" fill="${plumage.body}" opacity="0.9"/>
  <path d="${PATHS.tailMid}" fill="${plumage.shade}"/>
  <path d="${PATHS.tailLow}" fill="${plumage.shade}" opacity="0.82"/>
  <ellipse cx="160" cy="188" rx="55" ry="49" fill="url(#b)"/>
  <ellipse cx="154" cy="202" rx="39" ry="32" fill="${plumage.belly}" opacity="0.55"/>
  <g stroke="${plumage.shade}" stroke-width="5" stroke-linecap="round" fill="none">
    <path d="${PATHS.legLeft}"/><path d="${PATHS.legRight}"/>
  </g>
  <g stroke="${plumage.shade}" stroke-width="3.5" stroke-linecap="round" fill="none">
    <path d="${PATHS.feetLeft}"/><path d="${PATHS.feetRight}"/>
  </g>
  <path d="${PATHS.wing}" fill="url(#c)"/>
  <path d="${PATHS.wingLines}" stroke="${plumage.crest}" stroke-width="2.5" stroke-linecap="round" opacity="0.45" fill="none"/>
  <path d="${PATHS.crestBack}" fill="${plumage.crest}"/>
  <path d="${PATHS.crestFront}" fill="${plumage.body}"/>
  <circle cx="198" cy="136" r="35" fill="url(#b)"/>
  <ellipse cx="188" cy="152" rx="18" ry="13" fill="${plumage.belly}" opacity="0.4"/>
  <ellipse cx="212" cy="152" rx="9" ry="6" fill="${accent}" opacity="0.3"/>
  <path d="${PATHS.beakTop}" fill="#f08a1d"/>
  <path d="${PATHS.beakBottom}" fill="#c96a0c"/>
  <g transform="translate(214 128) scale(1 ${eyeOpen}) translate(-214 -128)">
    <ellipse cx="214" cy="128" rx="8.5" ry="9.5" fill="#12151f"/>
    <circle cx="217" cy="124.5" r="3" fill="#fff" opacity="0.9"/>
    <circle cx="211" cy="132" r="1.4" fill="#fff" opacity="0.5"/>
  </g>
  <path d="${browPath(eyeOpen)}" stroke="${plumage.shade}" stroke-width="3" stroke-linecap="round" opacity="0.75"/>
</svg>`;
}
