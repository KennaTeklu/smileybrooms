import { NextResponse } from "next/server"

export async function GET() {
  // Simple version that doesn't access the file system
  const latestVersion = {
    version: "1.0.1",
    downloadUrl: "/downloads/SmileyBrooms_Setup.exe",
    releaseNotes: "- Fixed Windows Defender issues\n- Improved performance\n- Added new features",
  }

  return NextResponse.json(latestVersion)
}
