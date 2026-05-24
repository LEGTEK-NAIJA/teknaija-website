import { ImageResponse } from "next/og";

export const runtime = "edge";

const SITE_URL = "https://teknaija.legtek.ng";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title =
    searchParams.get("title") ??
    "We build the systems Nigeria runs on.";
  const eyebrow = searchParams.get("eyebrow") ?? "TEK NAIJA";
  const subtitle =
    searchParams.get("subtitle") ??
    "Lagos-headquartered technology firm. A portfolio of owned software, and engineering for Nigerian institutions.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#0B0E1A",
          backgroundImage:
            "radial-gradient(ellipse 800px 600px at 75% 50%, rgba(217,164,65,0.06) 0%, transparent 70%), radial-gradient(ellipse 600px 400px at 20% 100%, rgba(200,85,61,0.08) 0%, transparent 60%)",
          color: "#F4EFE6",
          fontFamily: "serif",
        }}
      >
        {/* Top row — eyebrow + RC mark */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#D9A441",
            fontFamily: "monospace",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              style={{
                display: "inline-block",
                width: 40,
                height: 1,
                backgroundColor: "#D9A441",
              }}
            />
            <span>{eyebrow}</span>
          </div>
          <span style={{ color: "rgba(244,239,230,0.65)" }}>RC 9181824</span>
        </div>

        {/* Title — large display serif */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            maxWidth: "92%",
          }}
        >
          <div
            style={{
              fontSize: 88,
              lineHeight: 0.96,
              letterSpacing: -3,
              fontFamily: "serif",
              fontWeight: 500,
              color: "#F4EFE6",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "rgba(244,239,230,0.7)",
              maxWidth: "78%",
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom row — wordmark + url */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(244,239,230,0.55)",
            fontFamily: "monospace",
          }}
        >
          <div
            style={{
              fontFamily: "serif",
              fontSize: 36,
              letterSpacing: -0.5,
              color: "#F4EFE6",
              textTransform: "none",
            }}
          >
            TEK NAIJA
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span>teknaija.legtek.ng</span>
            <span
              style={{
                display: "inline-block",
                width: 40,
                height: 1,
                backgroundColor: "rgba(244,239,230,0.55)",
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
