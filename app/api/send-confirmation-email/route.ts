import { type NextRequest, NextResponse } from "next/server"
import { sendOrderConfirmationEmail } from "@/lib/email-actions"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Validate required fields
    if (!orderData.contact?.email || !orderData.orderId) {
      return NextResponse.json({ success: false, error: "Missing required order information" }, { status: 400 })
    }

    // Send the confirmation email
    await sendOrderConfirmationEmail({
      orderId: orderData.orderId,
      customerEmail: orderData.contact.email,
      customerName: `${orderData.contact.firstName} ${orderData.contact.lastName}`.trim(),
      totalAmount: orderData.pricing.total,
      items: orderData.items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      serviceAddress: orderData.address.street
        ? `${orderData.address.street}, ${orderData.address.city}, ${orderData.address.state} ${orderData.address.zipCode}`
        : `${orderData.address.line1}, ${orderData.address.city}, ${orderData.address.state} ${orderData.address.postal_code}`,
      paymentMethod:
        orderData.payment.paymentMethod === "apple_pay"
          ? "Apple Pay"
          : orderData.payment.paymentMethod === "google_pay"
            ? "Google Pay"
            : orderData.payment.paymentMethod,
      wantsLiveVideo: orderData.payment.allowVideoRecording,
      videoConsentDetails: orderData.payment.videoConsentDetails,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending confirmation email:", error)
    return NextResponse.json({ success: false, error: "Failed to send confirmation email" }, { status: 500 })
  }
}
