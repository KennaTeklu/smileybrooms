import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: Request) {
  try {
    // Get the installer path
    const installerPath = path.join(process.cwd(), "public", "downloads", "SmileyBrooms_Setup.exe")

    // Check if the file exists
    if (!fs.existsSync(installerPath)) {
      return new NextResponse("File not found", { status: 404 })
    }

    // Get file stats
    const stat = fs.statSync(installerPath)

    // Set headers for direct download to C:\ drive
    const headers = new Headers()
    headers.set("Content-Type", "application/octet-stream")
    headers.set("Content-Disposition", 'attachment; filename="SmileyBrooms_Setup.exe"')
    headers.set("Content-Length", stat.size.toString())
    headers.set("X-Suggested-Filename", "SmileyBrooms_Setup.exe")
    headers.set("X-Download-Options", "noopen")
    headers.set("X-Content-Type-Options", "nosniff")
    headers.set("X-Suggested-Save-Path", "C:\\SmileyBrooms_Setup.exe")

    // Create a readable stream from the file
    const fileStream = fs.createReadStream(installerPath)

    // Return the file as a stream
    return new NextResponse(fileStream as any, { headers })
  } catch (error) {
    console.error("Error serving Windows download:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
