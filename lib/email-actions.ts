"use server"

interface OrderDetails {
  orderId: string
  customerEmail: string
  customerName: string
  totalAmount: number
  items: Array<{ name: string; quantity: number; price: number }>
  serviceAddress: string
  paymentMethod: string
  // New fields for video preference
  wantsLiveVideo?: boolean
  videoConsentDetails?: string // Optional timestamp of consent
}

export async function sendOrderConfirmationEmail(orderDetails: OrderDetails) {
  console.log("Attempting to send order confirmation email...")
  console.log("Order Details:", orderDetails)

  const emailSubject = `Your SmileyBrooms Order #${orderDetails.orderId} Confirmation`
  let emailBody = `
    Dear ${orderDetails.customerName},

    Thank you for your order with SmileyBrooms!

    Your order #${orderDetails.orderId} has been successfully placed and confirmed.

    Order Summary:
    ${orderDetails.items.map((item) => `- ${item.name} (x${item.quantity}): $${(item.price * item.quantity).toFixed(2)}`).join("\n")}

    Total Amount Paid: $${orderDetails.totalAmount.toFixed(2)}
    Payment Method: ${orderDetails.paymentMethod}
    Service Address: ${orderDetails.serviceAddress}

    We will contact you shortly to confirm the service schedule.
  `

  // Conditionally add live video section
  if (orderDetails.wantsLiveVideo) {
    emailBody += `

    --- Your Live Cleaning Session ---
    Great news! You opted for a private YouTube Live link to watch your cleaning.
    We will send you a separate email with the private link approximately 15 minutes before your scheduled cleaning time.
    Please ensure you have a stable internet connection to enjoy the live stream.
    For any questions, please contact our support team.
    ---------------------------------
    `
  }

  emailBody += `

    If you have any questions, please contact our support team.

    Thank you,
    The SmileyBrooms Team
  `

  // Simulate sending email
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
  console.log(`
    --- SIMULATED EMAIL SENT ---
    To: ${orderDetails.customerEmail}
    Subject: ${emailSubject}
    Body:
    ${emailBody}
    ----------------------------
  `)

  return { success: true, message: "Order confirmation email simulated successfully." }
}
