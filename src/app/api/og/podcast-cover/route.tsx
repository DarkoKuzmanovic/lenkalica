import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const interBold = await fetch(new URL("https://rsms.me/inter/font-files/Inter-Bold.woff", import.meta.url)).then(
    (res) => res.arrayBuffer()
  );

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #4F46E5, #7C3AED)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          fontFamily: "Inter",
        }}
      >
        {/* Microphone Icon */}
        <div
          style={{
            fontSize: "200px",
            color: "white",
            marginBottom: "40px",
            opacity: "0.9",
          }}
        >
          🎙️
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "80px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "20px",
          }}
        >
          Lenkalica
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "40px",
            color: "rgba(255, 255, 255, 0.9)",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Stories Worth Hearing
        </div>
      </div>
    ),
    {
      width: 1400,
      height: 1400,
      fonts: [
        {
          name: "Inter",
          data: interBold,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
