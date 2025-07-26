import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { orderId, customerEmail, customerName, paymentMethod, amount } = await request.json()

    // Check if email is configured
    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    const smtpPassword = process.env.SMTP_PASSWORD

    if (!smtpHost || !smtpUser || !smtpPassword) {
      console.log("Email not configured, skipping email send")
      return NextResponse.json({ success: true, message: "Email not configured" })
    }

    // Only import nodemailer if SMTP is configured
    let nodemailer
    try {
      nodemailer = await import("nodemailer")
    } catch (error) {
      console.log("Nodemailer not available, skipping email send")
      return NextResponse.json({ success: true, message: "Email service not available" })
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: smtpHost,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    })

    // Email content
    const emailContent = `
Dear ${customerName},

Thank you for choosing SmileyBrooms! Your booking has been confirmed.

Order Details:
- Order ID: ${orderId}
- Payment Method: ${paymentMethod}
${amount > 0 ? `- Amount: $${amount.toFixed(2)}` : ""}

${
  paymentMethod === "Contact Payment"
    ? `
Please call us at (661) 602-3000 to complete your payment using:
- Cash
- Zelle
- Other payment methods

We will contact you shortly to schedule your cleaning service.
`
    : `
Your payment has been processed successfully. We will contact you shortly to schedule your cleaning service.
`
}

If you have any questions, please don't hesitate to contact us:
- Phone: (661) 602-3000
- Website: smileybrooms.com

Thank you for choosing SmileyBrooms!

Best regards,
The SmileyBrooms Team
    `

    // Send email
    await transporter.sendMail({
      from: smtpUser,
      to: customerEmail,
      subject: `SmileyBrooms - Booking Confirmation #${orderId}`,
      text: emailContent,
    })

    return NextResponse.json({ success: true, message: "Confirmation email sent" })
  } catch (error) {
    console.error("Error sending confirmation email:", error)
    // Don't fail the request if email fails
    return NextResponse.json({
      success: true,
      message: "Email send failed but order processed",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
