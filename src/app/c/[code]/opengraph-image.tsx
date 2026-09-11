import { ImageResponse } from "next/og";
import { canarySvgMarkup } from "@/lib/canaryArt";
import { resultFromShareCode } from "@/lib/share";
import { DIMENSION_META } from "@/lib/vibe";

export const alt = "A vibecheck canary";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const VERDICT_COLOR = { pass: "#00e5d4", watch: "#8b5cf6", fail: "#ff5c93" } as const;

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const result = resultFromShareCode(code);

  if (!result) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#05060a",
            color: "#e9edf6",
            fontSize: 64,
          }}
        >
          vibecheck
        </div>
      ),
      size,
    );
  }

  const { persona, score, scores } = result;
  const verdictColor = VERDICT_COLOR[persona.verdictTone];

  // Satori rasterizes an <img>, so the bird arrives as a static data URI.
  const canary = `data:image/svg+xml;base64,${Buffer.from(canarySvgMarkup(result)).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#05060a",
          backgroundImage: `radial-gradient(circle at 72% 45%, ${persona.accent}33, transparent 55%), radial-gradient(circle at 8% 0%, #2ca4ff22, transparent 45%)`,
          color: "#e9edf6",
          fontFamily: "sans-serif",
        }}
      >
        {/* Left: the report */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 0 0 68px",
            width: 700,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "linear-gradient(135deg, #2ca4ff, #8b5cf6)",
                color: "#fff",
                fontSize: 20,
              }}
            >
              V
            </div>
            <div style={{ fontSize: 22, letterSpacing: 4, color: "#8b93aa" }}>VIBECHECK</div>
          </div>

          <div style={{ display: "flex", fontSize: 78, lineHeight: 1.05, marginTop: 30 }}>
            {persona.name}
          </div>

          <div style={{ display: "flex", fontSize: 30, color: "#8b93aa", marginTop: 14 }}>
            {persona.tagline}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 34 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 22px",
                borderRadius: 999,
                border: `2px solid ${verdictColor}66`,
                background: `${verdictColor}1a`,
                color: verdictColor,
                fontSize: 22,
                letterSpacing: 2,
              }}
            >
              {persona.verdict}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 46, color: persona.accent }}>{score}</span>
              <span style={{ fontSize: 22, color: "#8b93aa" }}>/100</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
            {DIMENSION_META.map(({ key, label }) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  padding: "14px 20px",
                  borderRadius: 14,
                  border: "1px solid #1e2334",
                  background: "#0c0e16",
                  width: 142,
                }}
              >
                <span style={{ fontSize: 17, letterSpacing: 2, color: "#8b93aa" }}>
                  {label.toUpperCase()}
                </span>
                <span style={{ fontSize: 30 }}>{scores[key]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: the bird */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <img src={canary} alt="" width={460} height={460} />
        </div>
      </div>
    ),
    size,
  );
}
