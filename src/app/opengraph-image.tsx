import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f5f3ed",
        color: "#222923",
        display: "flex",
        flexDirection: "column",
        padding: 75,
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", fontSize: 54, fontWeight: 800 }}>
        ok<span style={{ color: "#dd652e" }}>.</span> mobile
      </div>
      <div style={{ fontSize: 84, letterSpacing: -4 }}>
        Great tech. Better days.
      </div>
      <div style={{ fontSize: 25, color: "#696e64" }}>
        Independent concept · Demo showroom · Baku
      </div>
    </div>,
    size,
  );
}
