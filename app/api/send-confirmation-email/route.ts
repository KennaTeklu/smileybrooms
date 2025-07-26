import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  try {
    const { orderId, customerEmail, amount } = await req.json()

    if (!customerEmail || !orderId || amount === undefined) {
      return NextResponse.json({ message: "Missing required email data" }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: customerEmail,
      subject: `SmileyBrooms Booking Confirmation - Order #${orderId}`,
      html: `
        <h1>Thank you for your booking with SmileyBrooms!</h1>
        <p>Your order #${orderId} has been successfully confirmed.</p>
        <p>Amount Paid: $${(amount / 100).toFixed(2)}</p>
        <p>We look forward to providing you with excellent service.</p>
        <p>If you have any questions, please contact us at ${process.env.CONTACT_PHONE_NUMBER || "661-602-3000"}.</p>
        <br/>
        <p>Best regards,</p>
        <p>The SmileyBrooms Team</p>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: "Confirmation email sent successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Error sending confirmation email:", error)
    return NextResponse.json({ message: error.message || "Failed to send email" }, { status: 500 })
  }
}
