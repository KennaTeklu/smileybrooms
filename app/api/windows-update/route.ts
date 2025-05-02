import { NextResponse } from "next/server"

export async function GET() {
  // In a real app, this would check the latest version in a database
  const latestVersion = {
    version: "1.0.1",
    downloadUrl: "https://www.smileybrooms.com/downloads/SmileyBrooms_Setup.exe",
    releaseNotes: "- Fixed Windows Defender issues\n- Improved performance\n- Added new features",
  }

  return NextResponse.json(latestVersion)
}
