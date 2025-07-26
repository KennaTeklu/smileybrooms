import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { getContactInfo } from "@/lib/payment-config"

const contactInfo = getContactInfo()

export async function POST(request: NextRequest) {
  try {
    const { email, paymentIntentId, amount } = await request.json()

    if (!email || !paymentIntentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and payment ID are required",
        },
        { status: 400 },
      )
    }

    // Create transporter (using environment variables)
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const formattedAmount = ((amount || 0) / 100).toFixed(2)

    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Confirmation - ${contactInfo.businessName}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; text-align: center;">Booking Confirmed!</h1>
        
        <p>Thank you for choosing ${contactInfo.businessName}! Your payment has been processed successfully.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Booking Details</h2>
            <p><strong>Payment ID:</strong> ${paymentIntentId}</p>
            <p><strong>Amount Paid:</strong> $${formattedAmount}</p>
            <p><strong>Service:</strong> Professional Cleaning Service</p>
        </div>
        
        <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1d4ed8;">What's Next?</h3>
            <ul>
                <li>We'll contact you within 24 hours to schedule your service</li>
                <li>Our team will confirm the date and time that works best for you</li>
                <li>We'll arrive at your scheduled time with all necessary equipment</li>
                <li>Enjoy your sparkling clean space!</li>
            </ul>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <h3>Contact Information</h3>
            <p><strong>Phone:</strong> ${contactInfo.displayPhone}</p>
            <p><strong>Email:</strong> ${contactInfo.email}</p>
            <p><strong>Website:</strong> ${contactInfo.website}</p>
        </div>
        
        <p style="text-align: center; margin-top: 30px; color: #6b7280;">
            Thank you for choosing ${contactInfo.businessName}!<br>
            We look forward to serving you.
        </p>
    </div>
</body>
</html>
    `.trim()

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Booking Confirmation - ${contactInfo.businessName}`,
      html: emailContent,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: "Confirmation email sent successfully",
    })
  } catch (error) {
    console.error("Email sending error:", error)

    // Don't fail the entire request if email fails
    return NextResponse.json({
      success: true,
      message: "Booking confirmed, but email notification failed",
      warning: "Please contact us if you don't receive a confirmation email",
    })
  }
}
