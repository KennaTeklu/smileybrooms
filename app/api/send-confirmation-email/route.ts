import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { email, sessionId, amount } = await request.json()

    if (!email || !sessionId) {
      return NextResponse.json({ success: false, error: "Email and session ID are required" }, { status: 400 })
    }

    const emailContent = `
      <h2>Booking Confirmation - SmileyBrooms</h2>
      <p>Thank you for choosing SmileyBrooms! Your payment has been processed successfully.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Order Details:</h3>
        <p><strong>Session ID:</strong> ${sessionId}</p>
        <p><strong>Amount Paid:</strong> $${(amount / 100).toFixed(2)}</p>
        <p><strong>Status:</strong> Confirmed</p>
      </div>
      
      <h3>What's Next?</h3>
      <ul>
        <li>We'll contact you within 24 hours to schedule your cleaning service</li>
        <li>Please have your preferred dates and times ready</li>
        <li>If you have any questions, call us at (661) 602-3000</li>
      </ul>
      
      <p>Thank you for choosing SmileyBrooms!</p>
      <p>Visit us at: smileybrooms.com</p>
    `

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Booking Confirmation - SmileyBrooms",
      html: emailContent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json({ success: false, error: "Failed to send confirmation email" }, { status: 500 })
  }
}
