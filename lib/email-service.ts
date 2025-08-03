export interface OrderEmailData {
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
    preferences?: string
  }
  cart: {
    rooms: Array<{
      name: string
      price: number
      quantity: number
    }>
    addons: Array<{
      name: string
      price: number
      quantity: number
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
    allowVideoRecording: boolean
  }
}

function formatOrderEmailHTML(orderData: OrderEmailData): string {
  const videoRecordingSection = orderData.payment.allowVideoRecording
    ? `
    <div style="background-color: #e3f2fd; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #2196f3;">
      <h3 style="color: #1976d2; margin: 0 0 8px 0;">🎥 Live Video Service Included</h3>
      <p style="margin: 0; color: #424242;">Customer has opted for live video recording during service.</p>
    </div>
    `
    : ""

  const roomsList = orderData.cart.rooms
    .map(
      (room) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${room.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${room.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${room.price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(room.price * room.quantity).toFixed(2)}</td>
    </tr>
  `,
    )
    .join("")

  const addonsList = orderData.cart.addons
    .map(
      (addon) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${addon.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${addon.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${addon.price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(addon.price * addon.quantity).toFixed(2)}</td>
    </tr>
  `,
    )
    .join("")

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New SmileyBrooms Order - ${orderData.orderId}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
    <h1 style="margin: 0; font-size: 28px;">🧹 New Order Received!</h1>
    <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Order #${orderData.orderId}</p>
    <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">${new Date(orderData.timestamp).toLocaleString()}</p>
  </div>

  ${videoRecordingSection}

  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #495057; margin-top: 0;">👤 Customer Information</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
      <div>
        <strong>Name:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}<br>
        <strong>Email:</strong> <a href="mailto:${orderData.customer.email}">${orderData.customer.email}</a><br>
        <strong>Phone:</strong> <a href="tel:${orderData.customer.phone}">${orderData.customer.phone}</a>
      </div>
    </div>
    ${orderData.customer.notes ? `<div style="margin-top: 15px;"><strong>Notes:</strong> ${orderData.customer.notes}</div>` : ""}
  </div>

  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #495057; margin-top: 0;">📍 Service Address</h2>
    <div style="background-color: white; padding: 15px; border-radius: 6px; border-left: 4px solid #28a745;">
      <strong>${orderData.address.street}</strong><br>
      ${orderData.address.apartment ? `${orderData.address.apartment}<br>` : ""}
      ${orderData.address.city}, ${orderData.address.state} ${orderData.address.zipCode}<br>
      ${orderData.address.addressType ? `<em>Type: ${orderData.address.addressType}</em><br>` : ""}
    </div>
    ${
      orderData.address.accessInstructions
        ? `<div style="margin-top: 10px;"><strong>Access Instructions:</strong> ${orderData.address.accessInstructions}</div>`
        : ""
    }
    ${
      orderData.address.parkingInstructions
        ? `<div style="margin-top: 10px;"><strong>Parking Instructions:</strong> ${orderData.address.parkingInstructions}</div>`
        : ""
    }
  </div>

  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #495057; margin-top: 0;">🧽 Service Details</h2>
    <div style="background-color: white; padding: 15px; border-radius: 6px;">
      <strong>Service Type:</strong> ${orderData.serviceDetails.type}<br>
      <strong>Frequency:</strong> ${orderData.serviceDetails.frequency}<br>
      ${orderData.serviceDetails.date ? `<strong>Preferred Date:</strong> ${orderData.serviceDetails.date}<br>` : ""}
      ${orderData.serviceDetails.time ? `<strong>Preferred Time:</strong> ${orderData.serviceDetails.time}<br>` : ""}
      ${
        orderData.serviceDetails.specialInstructions
          ? `<strong>Special Instructions:</strong> ${orderData.serviceDetails.specialInstructions}<br>`
          : ""
      }
    </div>
  </div>

  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #495057; margin-top: 0;">🛒 Order Items</h2>
    
    ${
      orderData.cart.rooms.length > 0
        ? `
    <h3 style="color: #6c757d; margin-bottom: 10px;">Rooms</h3>
    <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 6px; overflow: hidden; margin-bottom: 15px;">
      <thead>
        <tr style="background-color: #e9ecef;">
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Room</th>
          <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Unit Price</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${roomsList}
      </tbody>
    </table>
    `
        : ""
    }

    ${
      orderData.cart.addons.length > 0
        ? `
    <h3 style="color: #6c757d; margin-bottom: 10px;">Add-ons</h3>
    <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 6px; overflow: hidden;">
      <thead>
        <tr style="background-color: #e9ecef;">
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Add-on</th>
          <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Unit Price</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${addonsList}
      </tbody>
    </table>
    `
        : ""
    }
  </div>

  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #495057; margin-top: 0;">💰 Pricing Summary</h2>
    <div style="background-color: white; padding: 15px; border-radius: 6px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span>Subtotal:</span>
        <span>$${orderData.pricing.subtotal.toFixed(2)}</span>
      </div>
      ${
        orderData.pricing.discountAmount
          ? `
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #28a745;">
        <span>Discount ${orderData.pricing.couponCode ? `(${orderData.pricing.couponCode})` : ""}:</span>
        <span>-$${orderData.pricing.discountAmount.toFixed(2)}</span>
      </div>
      `
          : ""
      }
      ${
        orderData.pricing.taxAmount
          ? `
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span>Tax:</span>
        <span>$${orderData.pricing.taxAmount.toFixed(2)}</span>
      </div>
      `
          : ""
      }
      <hr style="margin: 15px 0; border: none; border-top: 2px solid #dee2e6;">
      <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #495057;">
        <span>Total:</span>
        <span>$${orderData.pricing.totalAmount.toFixed(2)}</span>
      </div>
    </div>
  </div>

  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #495057; margin-top: 0;">💳 Payment Information</h2>
    <div style="background-color: white; padding: 15px; border-radius: 6px;">
      <strong>Payment Method:</strong> ${orderData.payment.method}<br>
      <strong>Status:</strong> <span style="color: ${orderData.payment.status === "completed" ? "#28a745" : "#ffc107"};">${orderData.payment.status}</span><br>
      ${orderData.payment.transactionId ? `<strong>Transaction ID:</strong> ${orderData.payment.transactionId}<br>` : ""}
    </div>
  </div>

  <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
    <h2 style="color: #1976d2; margin-top: 0;">📋 Next Steps</h2>
    <ol style="margin: 0; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Contact customer within 2 hours to confirm service details</li>
      <li style="margin-bottom: 8px;">Schedule service appointment based on customer preferences</li>
      <li style="margin-bottom: 8px;">Send confirmation email with scheduled date and time</li>
      ${orderData.payment.allowVideoRecording ? '<li style="margin-bottom: 8px;">Prepare live video streaming setup for service</li>' : ""}
      <li>Complete service and follow up for feedback</li>
    </ol>
  </div>

  <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
    <p style="margin: 0; color: #6c757d; font-size: 14px;">
      This order was automatically generated from smileybrooms.com<br>
      For questions, contact: <a href="mailto:smileybrooms@gmail.com">smileybrooms@gmail.com</a>
    </p>
  </div>
</body>
</html>
  `
}

function formatOrderEmailText(orderData: OrderEmailData): string {
  const videoRecordingSection = orderData.payment.allowVideoRecording
    ? `
🎥 LIVE VIDEO SERVICE INCLUDED
Customer has opted for live video recording during service.
`
    : ""

  const roomsList = orderData.cart.rooms
    .map(
      (room) =>
        `  - ${room.name} (${room.quantity}x) - $${room.price.toFixed(2)} each = $${(room.price * room.quantity).toFixed(2)}`,
    )
    .join("\n")

  const addonsList = orderData.cart.addons
    .map(
      (addon) =>
        `  - ${addon.name} (${addon.quantity}x) - $${addon.price.toFixed(2)} each = $${(addon.price * addon.quantity).toFixed(2)}`,
    )
    .join("\n")

  return `
🧹 NEW SMILEYBROOMS ORDER RECEIVED!

Order ID: ${orderData.orderId}
Date: ${new Date(orderData.timestamp).toLocaleString()}

${videoRecordingSection}

👤 CUSTOMER INFORMATION
Name: ${orderData.customer.firstName} ${orderData.customer.lastName}
Email: ${orderData.customer.email}
Phone: ${orderData.customer.phone}
${orderData.customer.notes ? `Notes: ${orderData.customer.notes}` : ""}

📍 SERVICE ADDRESS
${orderData.address.street}
${orderData.address.apartment ? `${orderData.address.apartment}` : ""}
${orderData.address.city}, ${orderData.address.state} ${orderData.address.zipCode}
${orderData.address.addressType ? `Type: ${orderData.address.addressType}` : ""}
${orderData.address.accessInstructions ? `Access Instructions: ${orderData.address.accessInstructions}` : ""}
${orderData.address.parkingInstructions ? `Parking Instructions: ${orderData.address.parkingInstructions}` : ""}

🧽 SERVICE DETAILS
Service Type: ${orderData.serviceDetails.type}
Frequency: ${orderData.serviceDetails.frequency}
${orderData.serviceDetails.date ? `Preferred Date: ${orderData.serviceDetails.date}` : ""}
${orderData.serviceDetails.time ? `Preferred Time: ${orderData.serviceDetails.time}` : ""}
${orderData.serviceDetails.specialInstructions ? `Special Instructions: ${orderData.serviceDetails.specialInstructions}` : ""}

🛒 ORDER ITEMS

${orderData.cart.rooms.length > 0 ? `ROOMS:\n${roomsList}` : ""}

${orderData.cart.addons.length > 0 ? `ADD-ONS:\n${addonsList}` : ""}

💰 PRICING SUMMARY
Subtotal: $${orderData.pricing.subtotal.toFixed(2)}
${orderData.pricing.discountAmount ? `Discount ${orderData.pricing.couponCode ? `(${orderData.pricing.couponCode})` : ""}: -$${orderData.pricing.discountAmount.toFixed(2)}` : ""}
${orderData.pricing.taxAmount ? `Tax: $${orderData.pricing.taxAmount.toFixed(2)}` : ""}
TOTAL: $${orderData.pricing.totalAmount.toFixed(2)}

💳 PAYMENT INFORMATION
Payment Method: ${orderData.payment.method}
Status: ${orderData.payment.status}
${orderData.payment.transactionId ? `Transaction ID: ${orderData.payment.transactionId}` : ""}

📋 NEXT STEPS
1. Contact customer within 2 hours to confirm service details
2. Schedule service appointment based on customer preferences
3. Send confirmation email with scheduled date and time
${orderData.payment.allowVideoRecording ? "4. Prepare live video streaming setup for service" : ""}
${orderData.payment.allowVideoRecording ? "5. Complete service and follow up for feedback" : "4. Complete service and follow up for feedback"}

---
This order was automatically generated from smileybrooms.com
For questions, contact: smileybrooms@gmail.com
  `
}

export async function sendOrderEmailNotification(orderData: OrderEmailData): Promise<boolean> {
  try {
    // For now, we'll simulate email sending
    // In production, integrate with SendGrid, Resend, or similar service

    const emailContent = {
      to: "smileybrooms@gmail.com",
      subject: `🧹 New Order #${orderData.orderId} - $${orderData.pricing.totalAmount.toFixed(2)}`,
      html: formatOrderEmailHTML(orderData),
      text: formatOrderEmailText(orderData),
    }

    // TODO: Replace with actual email service integration
    console.log("📧 Email would be sent:", emailContent.subject)
    console.log("📧 To:", emailContent.to)
    console.log("📧 Order Total:", `$${orderData.pricing.totalAmount.toFixed(2)}`)

    // Simulate successful email sending
    return true
  } catch (error) {
    console.error("❌ Failed to send order email:", error)
    return false
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
