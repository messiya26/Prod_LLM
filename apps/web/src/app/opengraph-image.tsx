import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lord Lombo Ministries - Academie de Formation Spirituelle & Leadership";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a1628 0%, #0d1a2e 40%, #1a0f2e 100%)",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(212,175,55,0.12), transparent 60%)", display: "flex" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, transparent, #d4af37, transparent)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, transparent, #d4af37, transparent)", display: "flex" }} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: "0 60px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 80, height: 80, borderRadius: 16, background: "linear-gradient(135deg, #d4af37, #f0c75e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 900, color: "#0a1628" }}>
              LLM
            </div>
          </div>

          <div style={{ fontSize: 52, fontWeight: 900, color: "#f5f0e8", lineHeight: 1.1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span>Lord Lombo Ministries</span>
          </div>

          <div style={{ fontSize: 24, color: "#d4af37", fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", display: "flex" }}>
            Academie de Formation
          </div>

          <div style={{ fontSize: 18, color: "rgba(245,240,232,0.5)", maxWidth: 700, lineHeight: 1.6, display: "flex" }}>
            Leadership Spirituel • Worship • Developpement Personnel • Masterclasses • Certificats
          </div>

          <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
            {[
              { v: "2500+", l: "Etudiants" },
              { v: "45+", l: "Formations" },
              { v: "30+", l: "Pays" },
              { v: "98%", l: "Satisfaction" },
            ].map((s) => (
              <div key={s.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#d4af37" }}>{s.v}</span>
                <span style={{ fontSize: 12, color: "rgba(245,240,232,0.3)", textTransform: "uppercase", letterSpacing: 2 }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 20, right: 40, fontSize: 13, color: "rgba(245,240,232,0.2)", display: "flex" }}>
          lordlomboministries.com
        </div>
      </div>
    ),
    { ...size }
  );
}
