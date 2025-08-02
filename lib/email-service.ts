"use server"

interface OrderEmailData {
  orderId: string
  timestamp: string
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    notes?: string
  }
  address: {
    street: string
    apartment?: string
    city: string
    state: string
    zipCode: string
    addressType?: string
    accessInstructions?: string
    parkingInstructions?: string
  }
  serviceDetails: {
    type: string
    frequency: string
    date?: string
    time?: string
    specialInstructions?: string
    preferences?: string[]
  }
  cart: {
    rooms: Array<{
      category: string
      count: number
      customizations?: string[]
      price?: number
      totalPrice?: number
    }>
    addons: Array<{
      name: string
      quantity: number
      price?: number
      totalPrice?: number
    }>
    totalItems: number
  }
  pricing: {
    subtotal: number
    discountAmount?: number
    taxAmount?: number
    totalAmount: number
    couponCode?: string
  }
  payment: {
    method: string
    status: string
    transactionId?: string
    allowVideoRecording?: boolean
  }
}

function formatOrderEmailContent(orderData: OrderEmailData): { subject: string; html: string; text: string } {
  const subject = `New SmileyBrooms Order #${orderData.orderId} - ${orderData.customer.firstName} ${orderData.customer.lastName}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order - ${orderData.orderId}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .section { margin-bottom: 20px; padding: 15px; border: 1px solid #e9ecef; border-radius: 5px; }
        .section h3 { margin-top: 0; color: #495057; }
        .urgent { background: #fff3cd; border-color: #ffeaa7; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .item { background: #f8f9fa; padding: 10px; border-radius: 3px; margin-bottom: 5px; }
        .price { font-weight: bold; color: #28a745; }
        .total { font-size: 18px; font-weight: bold; color: #007bff; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧹 New SmileyBrooms Order</h1>
          <p><strong>Order ID:</strong> ${orderData.orderId}</p>
          <p><strong>Received:</strong> ${new Date(orderData.timestamp).toLocaleString()}</p>
          <p><strong>Payment Status:</strong> ${orderData.payment.status}</p>
        </div>

        <div class="section">
          <h3>👤 Customer Information</h3>
          <div class="grid">
            <div>
              <strong>Name:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}<br>
              <strong>Email:</strong> ${orderData.customer.email}<br>
              <strong>Phone:</strong> ${orderData.customer.phone}
            </div>
            ${orderData.customer.notes ? `<div><strong>Notes:</strong><br>${orderData.customer.notes}</div>` : ""}
          </div>
        </div>

        <div class="section">
          <h3>📍 Service Address</h3>
          <p>
            ${orderData.address.street}${orderData.address.apartment ? `, ${orderData.address.apartment}` : ""}<br>
            ${orderData.address.city}, ${orderData.address.state} ${orderData.address.zipCode}<br>
            <strong>Type:</strong> ${orderData.address.addressType || "Residential"}
          </p>
          ${orderData.address.accessInstructions ? `<p><strong>Access Instructions:</strong> ${orderData.address.accessInstructions}</p>` : ""}
          ${orderData.address.parkingInstructions ? `<p><strong>Parking:</strong> ${orderData.address.parkingInstructions}</p>` : ""}
        </div>

        <div class="section">
          <h3>🗓️ Service Details</h3>
          <div class="grid">
            <div>
              <strong>Service Type:</strong> ${orderData.serviceDetails.type}<br>
              <strong>Frequency:</strong> ${orderData.serviceDetails.frequency}
              ${orderData.serviceDetails.date ? `<br><strong>Date:</strong> ${orderData.serviceDetails.date}` : ""}
              ${orderData.serviceDetails.time ? `<br><strong>Time:</strong> ${orderData.serviceDetails.time}` : ""}
            </div>
            ${orderData.serviceDetails.specialInstructions ? `<div><strong>Special Instructions:</strong><br>${orderData.serviceDetails.specialInstructions}</div>` : ""}
          </div>
          ${
            orderData.serviceDetails.preferences && orderData.serviceDetails.preferences.length > 0
              ? `
            <p><strong>Preferences:</strong> ${orderData.serviceDetails.preferences.join(", ")}</p>
          `
              : ""
          }
        </div>

        <div class="section">
          <h3>🏠 Rooms & Services</h3>
          ${orderData.cart.rooms
            .map(
              (room) => `
            <div class="item">
              <strong>${room.category}</strong> x${room.count}
              ${room.price ? `<span class="price">$${room.totalPrice?.toFixed(2) || (room.price * room.count).toFixed(2)}</span>` : ""}
              ${room.customizations && room.customizations.length > 0 ? `<br><small>Customizations: ${room.customizations.join(", ")}</small>` : ""}
            </div>
          `,
            )
            .join("")}
          
          ${
            orderData.cart.addons.length > 0
              ? `
            <h4>Add-ons:</h4>
            ${orderData.cart.addons
              .map(
                (addon) => `
              <div class="item">
                <strong>${addon.name}</strong> x${addon.quantity}
                ${addon.price ? `<span class="price">$${addon.totalPrice?.toFixed(2) || (addon.price * addon.quantity).toFixed(2)}</span>` : ""}
              </div>
            `,
              )
              .join("")}
          `
              : ""
          }
        </div>

        <div class="section">
          <h3>💰 Pricing</h3>
          <p><strong>Subtotal:</strong> $${orderData.pricing.subtotal.toFixed(2)}</p>
          ${orderData.pricing.discountAmount ? `<p><strong>Discount:</strong> -$${orderData.pricing.discountAmount.toFixed(2)}${orderData.pricing.couponCode ? ` (${orderData.pricing.couponCode})` : ""}</p>` : ""}
          ${orderData.pricing.taxAmount ? `<p><strong>Tax:</strong> $${orderData.pricing.taxAmount.toFixed(2)}</p>` : ""}
          <p class="total"><strong>Total:</strong> $${orderData.pricing.totalAmount.toFixed(2)}</p>
        </div>

        <div class="section">
          <h3>💳 Payment Information</h3>
          <p>
            <strong>Method:</strong> ${orderData.payment.method}<br>
            <strong>Status:</strong> ${orderData.payment.status}
            ${orderData.payment.transactionId ? `<br><strong>Transaction ID:</strong> ${orderData.payment.transactionId}` : ""}
          </p>
          ${
            orderData.payment.allowVideoRecording
              ? `
            <div style="background: #d4edda; padding: 10px; border-radius: 3px; margin-top: 10px;">
              <strong>📹 Video Recording Consent:</strong> Customer has consented to video recording during service
            </div>
          `
              : ""
          }
        </div>

        <div class="section" style="background: #e3f2fd; border-color: #90caf9;">
          <h3>🎯 Next Steps</h3>
          <ul>
            <li>Contact customer within 24 hours to confirm service details</li>
            <li>Schedule cleaning team and equipment</li>
            <li>Send confirmation email with cleaning team details</li>
            ${orderData.payment.allowVideoRecording ? "<li>Set up video recording equipment and private YouTube link</li>" : ""}
          </ul>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
NEW SMILEYBROOMS ORDER #${orderData.orderId}
========================================

Order Details:
- Order ID: ${orderData.orderId}
- Received: ${new Date(orderData.timestamp).toLocaleString()}
- Payment Status: ${orderData.payment.status}

Customer Information:
- Name: ${orderData.customer.firstName} ${orderData.customer.lastName}
- Email: ${orderData.customer.email}
- Phone: ${orderData.customer.phone}
${orderData.customer.notes ? `- Notes: ${orderData.customer.notes}` : ""}

Service Address:
${orderData.address.street}${orderData.address.apartment ? `, ${orderData.address.apartment}` : ""}
${orderData.address.city}, ${orderData.address.state} ${orderData.address.zipCode}
Type: ${orderData.address.addressType || "Residential"}
${orderData.address.accessInstructions ? `Access: ${orderData.address.accessInstructions}` : ""}
${orderData.address.parkingInstructions ? `Parking: ${orderData.address.parkingInstructions}` : ""}

Service Details:
- Type: ${orderData.serviceDetails.type}
- Frequency: ${orderData.serviceDetails.frequency}
${orderData.serviceDetails.date ? `- Date: ${orderData.serviceDetails.date}` : ""}
${orderData.serviceDetails.time ? `- Time: ${orderData.serviceDetails.time}` : ""}
${orderData.serviceDetails.specialInstructions ? `- Instructions: ${orderData.serviceDetails.specialInstructions}` : ""}
${orderData.serviceDetails.preferences && orderData.serviceDetails.preferences.length > 0 ? `- Preferences: ${orderData.serviceDetails.preferences.join(", ")}` : ""}

Rooms & Services:
${orderData.cart.rooms.map((room) => `- ${room.category} x${room.count}${room.price ? ` ($${(room.totalPrice || room.price * room.count).toFixed(2)})` : ""}${room.customizations && room.customizations.length > 0 ? ` [${room.customizations.join(", ")}]` : ""}`).join("\n")}

${
  orderData.cart.addons.length > 0
    ? `Add-ons:
${orderData.cart.addons.map((addon) => `- ${addon.name} x${addon.quantity}${addon.price ? ` ($${(addon.totalPrice || addon.price * addon.quantity).toFixed(2)})` : ""}`).join("\n")}`
    : ""
}

Pricing:
- Subtotal: $${orderData.pricing.subtotal.toFixed(2)}
${orderData.pricing.discountAmount ? `- Discount: -$${orderData.pricing.discountAmount.toFixed(2)}${orderData.pricing.couponCode ? ` (${orderData.pricing.couponCode})` : ""}` : ""}
${orderData.pricing.taxAmount ? `- Tax: $${orderData.pricing.taxAmount.toFixed(2)}` : ""}
- TOTAL: $${orderData.pricing.totalAmount.toFixed(2)}

Payment:
- Method: ${orderData.payment.method}
- Status: ${orderData.payment.status}
${orderData.payment.transactionId ? `- Transaction ID: ${orderData.payment.transactionId}` : ""}
${orderData.payment.allowVideoRecording ? "- Video Recording: Customer consented" : ""}

Next Steps:
1. Contact customer within 24 hours
2. Schedule cleaning team and equipment
3. Send confirmation email
${orderData.payment.allowVideoRecording ? "4. Set up video recording equipment" : ""}
  `

  return { subject, html, text }
}

export async function sendOrderEmailNotification(
  orderData: OrderEmailData,
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const { subject, html, text } = formatOrderEmailContent(orderData)

    // Since we don't have SMTP configured, we'll log the email content
    // In a real implementation, you would use a service like SendGrid, Resend, or Nodemailer
    console.log("📧 Sending order email notification to smileybrooms@gmail.com")
    console.log("Subject:", subject)
    console.log("HTML Content Length:", html.length)
    console.log("Text Content Length:", text.length)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For now, we'll return success since we don't have actual email sending
    // In production, you would replace this with actual email sending logic
    return {
      success: true,
      message: `Order notification email prepared for smileybrooms@gmail.com (Order #${orderData.orderId})`,
    }
  } catch (error) {
    console.error("❌ Failed to send order email notification:", error)
    return {
      success: false,
      message: "Failed to send order email notification",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Helper function to convert OrderData from google-sheet-logger format to OrderEmailData
export function convertToEmailData(orderData: any): OrderEmailData {
  return {
    orderId: orderData.orderId || `SB-${Date.now()}`,
    timestamp: orderData.timestamp || new Date().toISOString(),
    customer: {
      firstName: orderData.customer?.firstName || "",
      lastName: orderData.customer?.lastName || "",
      email: orderData.customer?.email || "",
      phone: orderData.customer?.phone || "",
      notes: orderData.customer?.notes || undefined,
    },
    address: {
      street: orderData.address?.street || "",
      apartment: orderData.address?.apartment || undefined,
      city: orderData.address?.city || "",
      state: orderData.address?.state || "",
      zipCode: orderData.address?.zipCode || "",
      addressType: orderData.address?.addressType || undefined,
      accessInstructions: orderData.address?.accessInstructions || undefined,
      parkingInstructions: orderData.address?.parkingInstructions || undefined,
    },
    serviceDetails: {
      type: orderData.serviceDetails?.type || "Cleaning Service",
      frequency: orderData.serviceDetails?.frequency || "One-time",
      date: orderData.serviceDetails?.date || undefined,
      time: orderData.serviceDetails?.time || undefined,
      specialInstructions: orderData.serviceDetails?.specialInstructions || undefined,
      preferences: orderData.serviceDetails?.preferences || undefined,
    },
    cart: {
      rooms: orderData.cart?.rooms || [],
      addons: orderData.cart?.addons || [],
      totalItems: orderData.cart?.totalItems || 0,
    },
    pricing: {
      subtotal: orderData.pricing?.subtotal || 0,
      discountAmount: orderData.pricing?.discountAmount || undefined,
      taxAmount: orderData.pricing?.taxAmount || undefined,
      totalAmount: orderData.pricing?.totalAmount || 0,
      couponCode: orderData.pricing?.couponCode || undefined,
    },
    payment: {
      method: orderData.payment?.method || "unknown",
      status: orderData.payment?.status || "pending",
      transactionId: orderData.payment?.transactionId || undefined,
      allowVideoRecording: orderData.payment?.allowVideoRecording || false,
    },
  }
}
