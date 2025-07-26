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
    const { sessionId, orderData } = await request.json()

    if (!sessionId || !orderData) {
      return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 })
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Booking Confirmation - SmileyBrooms</h1>
        
        <p>Dear ${orderData.customerName || "Valued Customer"},</p>
        
        <p>Thank you for choosing SmileyBrooms! Your booking has been confirmed and payment processed successfully.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Order Details</h2>
          <p><strong>Order ID:</strong> ${orderData.id}</p>
          <p><strong>Amount:</strong> $${(orderData.amount / 100).toFixed(2)} ${orderData.currency.toUpperCase()}</p>
          <p><strong>Payment Status:</strong> ${orderData.paymentStatus}</p>
          <p><strong>Date:</strong> ${new Date(orderData.createdAt).toLocaleDateString()}</p>
        </div>
        
        <h3>What's Next?</h3>
        <ul>
          <li>We'll contact you within 24 hours to schedule your cleaning service</li>
          <li>Our team will confirm the appointment time and any special requirements</li>
          <li>We'll send you a reminder before your scheduled cleaning</li>
        </ul>
        
        <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Contact Information</h3>
          <p><strong>Phone:</strong> (661) 602-3000</p>
          <p><strong>Website:</strong> smileybrooms.com</p>
          <p><strong>Email:</strong> info@smileybrooms.com</p>
        </div>
        
        <p>If you have any questions or need to make changes to your booking, please don't hesitate to contact us.</p>
        
        <p>Thank you for choosing SmileyBrooms!</p>
        
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280;">
          This is an automated confirmation email. Please do not reply to this email.
          For support, please call (661) 602-3000 or visit smileybrooms.com
        </p>
      </div>
    `

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: orderData.customerEmail,
      subject: "Booking Confirmation - SmileyBrooms Cleaning Service",
      html: emailHtml,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      },
      { status: 500 },
    )
  }
}
