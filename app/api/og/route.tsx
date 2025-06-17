import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Get title and description from search params, or use defaults
    const title = searchParams.get("title") || "SmileyBrooms - Professional Cleaning Services"
    const description =
      searchParams.get("description") || "Experience the joy of coming home to a perfectly clean space."

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "60px",
          backgroundColor: "#f8fafc", // Tailwind 'slate-50' or similar light background
          color: "#1e293b", // Tailwind 'slate-800'
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern/gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 100% 150%, #e0f2f7, #f8fafc 50%, #f0f9ff)", // Light blue gradient
            opacity: 0.8,
            zIndex: -1,
          }}
        />

        {/* Logo/Brand */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          {/* Replace with your actual logo if you have one accessible via URL */}
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#007bff", // Primary color
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              color: "white",
              marginRight: "20px",
            }}
          >
            🧹
          </div>
          <span style={{ fontSize: "48px", fontWeight: "bold", color: "#007bff" }}>SmileyBrooms</span>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              lineHeight: "1.2",
              marginBottom: "20px",
              color: "#1e293b",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "36px",
              lineHeight: "1.5",
              color: "#475569", // Tailwind 'slate-600'
              maxWidth: "80%",
            }}
          >
            {description}
          </p>
        </div>

        {/* Footer/URL */}
        <div style={{ fontSize: "28px", color: "#64748b", marginTop: "40px" }}>smileybrooms.com</div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e: any) {
    console.error(e)
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    })
  }
}
