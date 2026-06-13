import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#FBF8F1",
          backgroundImage:
            "radial-gradient(circle at 15% 25%, rgba(30,95,63,0.10), transparent 60%), radial-gradient(circle at 85% 75%, rgba(196,106,75,0.10), transparent 60%)",
          color: "#171717",
          display: "flex",
          flexDirection: "column",
          padding: 80,
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 18,
            textTransform: "uppercase",
            letterSpacing: 8,
            color: "#1E5F3F",
            display: "flex",
          }}
        >
          INR  ·  student loan calc
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: -2,
            display: "flex",
          }}
        >
          Punch in your fees.
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: -2,
            display: "flex",
          }}
        >
          See <span style={{ fontStyle: "italic", color: "#C46A4B", marginLeft: 16, marginRight: 16 }}>exactly</span> what
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: -2,
            display: "flex",
          }}
        >
          you'll pay back.
        </div>
        <div
          style={{
            marginTop: "auto",
            fontSize: 22,
            color: "#171717",
            opacity: 0.7,
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <span>EMI</span>
          <span>·</span>
          <span>moratorium</span>
          <span>·</span>
          <span>amortization</span>
          <span>·</span>
          <span>bank comparison</span>
          <span>·</span>
          <span>80E tax</span>
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 18,
            color: "#171717",
            opacity: 0.5,
            display: "flex",
          }}
        >
          a plain-English education-loan calculator for Indian students
        </div>
      </div>
    ),
    { ...size }
  );
}
