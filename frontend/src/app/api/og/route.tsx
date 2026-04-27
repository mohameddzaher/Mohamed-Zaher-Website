import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #050507 0%, #0a0a0f 60%, #1a1a25 100%)",
          color: "#e5e5ee",
          fontFamily: "system-ui",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg,#22d3ee,#8b5cf6)",
              color: "#050507",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            MZ
          </div>
          <span style={{ fontSize: 28, fontWeight: 600, opacity: 0.8 }}>Mohamed Zaher</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>
            Software Engineer.
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1,
              backgroundImage: "linear-gradient(135deg,#67e8f9,#a78bfa,#f0abfc)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Entrepreneur. CTO.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#7a7a95",
            fontSize: 22,
            fontFamily: "monospace",
          }}
        >
          <span>{SITE.url.replace(/^https?:\/\//, "")}</span>
          <span>· Jeddah · KSA</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
