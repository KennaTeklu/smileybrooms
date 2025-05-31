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

  const { id: jobId } = req.query // Job ID from URL

  if (!jobId) {
    return res.status(400).json({ error: "Job ID is required." })
  }

  const supabase = getSupabaseServerClient()

  try {
    const form = new IncomingForm({
      uploadDir: "./tmp", // Temporary directory for uploads
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
    })

    const [fields, files] = await form.parse(req)
    const photoFile = files.photo?.[0]
    const photoType = fields.type?.[0] || "general" // 'before' or 'after'

    if (!photoFile) {
      return res.status(400).json({ error: "No photo file uploaded." })
    }

    // Read the file content
    const fileContent = await fs.readFile(photoFile.filepath)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("job-photos") // Create a bucket named 'job-photos' in Supabase Storage
      .upload(`${jobId}/${photoType}-${Date.now()}${path.extname(photoFile.originalFilename || "")}`, fileContent, {
        contentType: photoFile.mimetype || "application/octet-stream",
        upsert: false,
      })

    if (uploadError) {
      console.error("Supabase Storage upload error:", uploadError)
      return res.status(500).json({ error: "Failed to upload photo to storage." })
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("job-photos").getPublicUrl(uploadData.path)

    const publicUrl = publicUrlData.publicUrl

    // Record photo URL in the database
    const { error: dbError } = await supabase
      .from("job_photos")
      .insert({ job_id: jobId, type: photoType, url: publicUrl })

    if (dbError) {
      console.error("Database insert error for job photo:", dbError)
      return res.status(500).json({ error: "Failed to record photo in database." })
    }

    // Clean up temporary file
    await fs.unlink(photoFile.filepath)

    res.status(200).json({ message: "Photo uploaded successfully!", url: publicUrl })
  } catch (error) {
    console.error("API Photo Upload Error:", error)
    res.status(500).json({ error: "Internal server error during photo upload." })
  }
}
