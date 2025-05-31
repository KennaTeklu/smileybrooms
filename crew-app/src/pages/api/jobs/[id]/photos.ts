import type { NextApiRequest, NextApiResponse } from "next"
import { getSupabaseServerClient } from "@/crew-app/src/lib/supabase/server"
import { IncomingForm } from "formidable"
import { promises as fs } from "fs"
import path from "path"

// Disable Next.js body parser for formidable to work
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const { id: jobId } = req.query // Job ID from URL parameter

  if (!jobId) {
    return res.status(400).json({ error: "Job ID is required." })
  }

  try {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), "tmp"), // Temporary directory for uploads
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
    })

    const [fields, files] = await form.parse(req)
    const photoFile = files.photo?.[0]
    const photoType = fields.type?.[0] || "misc" // 'before', 'after', 'misc'

    if (!photoFile) {
      return res.status(400).json({ error: "No photo file uploaded." })
    }

    const supabase = getSupabaseServerClient()
    const fileContent = await fs.readFile(photoFile.filepath)
    const fileName = `${jobId}/${photoType}-${Date.now()}${path.extname(photoFile.filepath)}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("job-photos") // Ensure you have a bucket named 'job-photos'
      .upload(fileName, fileContent, {
        contentType: photoFile.mimetype || "application/octet-stream",
        upsert: false,
      })

    if (uploadError) {
      console.error("Supabase Storage upload error:", uploadError)
      return res.status(500).json({ error: "Failed to upload photo to storage." })
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("job-photos").getPublicUrl(fileName)
    const publicUrl = publicUrlData?.publicUrl

    if (!publicUrl) {
      return res.status(500).json({ error: "Failed to get public URL for uploaded photo." })
    }

    // Record photo in database
    const { error: dbError } = await supabase.from("job_photos").insert({
      job_id: jobId,
      type: photoType,
      url: publicUrl,
    })

    if (dbError) {
      console.error("Supabase DB photo record error:", dbError)
      // Optionally delete the uploaded file from storage if DB record fails
      await supabase.storage.from("job-photos").remove([fileName])
      return res.status(500).json({ error: "Failed to record photo in database." })
    }

    // Clean up temporary file
    await fs.unlink(photoFile.filepath)

    res.status(200).json({ message: "Photo uploaded successfully!", url: publicUrl })
  } catch (error) {
    console.error("Server error during photo upload:", error)
    res.status(500).json({ error: "Internal server error." })
  }
}
