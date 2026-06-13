import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const runtime = "edge";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FBF8F1",
          color: "#1E5F3F",
          fontSize: 22,
          fontWeight: 800,
          fontFamily: "serif",
          borderRadius: 6,
        }}
      >
        ₹
      </div>
    ),
    { ...size }
  );
}
