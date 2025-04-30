import { type NextRequest, NextResponse } from "next/server"
import path from "path"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const platform = searchParams.get("platform")
  const version = searchParams.get("version") || "1.0.0"

  // Log download analytics
  try {
    console.log(`App download: ${platform}, version: ${version}`)

    // Map platform to file path
    let filePath = ""
    let fileName = ""
    let contentType = ""

    switch (platform) {
      case "ios":
        filePath = path.join(process.cwd(), "public", "downloads", "smiley-brooms.ipa")
        fileName = "smiley-brooms.ipa"
        contentType = "application/octet-stream"
        break
      case "android":
        filePath = path.join(process.cwd(), "public", "downloads", "smiley-brooms.apk")
        fileName = "smiley-brooms.apk"
        contentType = "application/vnd.android.package-archive"
        break
      case "macos":
        filePath = path.join(process.cwd(), "public", "downloads", "smiley-brooms.dmg")
        fileName = "smiley-brooms.dmg"
        contentType = "application/x-apple-diskimage"
        break
      case "windows":
        filePath = path.join(process.cwd(), "public", "downloads", "smiley-brooms.exe")
        fileName = "smiley-brooms.exe"
        contentType = "application/octet-stream"
        break
      case "linux-deb":
        filePath = path.join(process.cwd(), "public", "downloads", "smiley-brooms.deb")
        fileName = "smiley-brooms.deb"
        contentType = "application/vnd.debian.binary-package"
        break
      case "linux-rpm":
        filePath = path.join(process.cwd(), "public", "downloads", "smiley-brooms.rpm")
        fileName = "smiley-brooms.rpm"
        contentType = "application/x-rpm"
        break
      case "linux-appimage":
        filePath = path.join(process.cwd(), "public", "downloads", "smiley-brooms.AppImage")
        fileName = "smiley-brooms.AppImage"
        contentType = "application/octet-stream"
        break
      default:
        return NextResponse.json({ error: "Invalid platform" }, { status: 400 })
    }

    // For direct download from public folder
    const downloadUrl = `/downloads/${fileName}`

    // Return the direct download URL
    return NextResponse.json({
      url: downloadUrl,
      directDownload: true,
    })
  } catch (error) {
    console.error("Download tracking error:", error)
    return NextResponse.json({ error: "Failed to process download" }, { status: 500 })
  }
}
