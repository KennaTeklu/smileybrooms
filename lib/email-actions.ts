"use server"

interface OrderDetails {
  orderId: string
  customerEmail: string
  customerName: string
  totalAmount: number
  items: Array<{ name: string; quantity: number; price: number }>
  serviceAddress: string
  paymentMethod: string
}

export async function sendOrderConfirmationEmail(orderDetails: OrderDetails) {
  console.log("Attempting to send order confirmation email...")
  console.log("Order Details:", orderDetails)

  // In a real application, you would integrate with an email service like Nodemailer, SendGrid, Mailgun, etc.
  // For demonstration purposes, we'll just log the email content.

  const emailSubject = `Your SmileyBrooms Order #${orderDetails.orderId} Confirmation`
  const emailBody = `
    Dear ${orderDetails.customerName},

    Thank you for your order with SmileyBrooms!

    Your order #${orderDetails.orderId} has been successfully placed and confirmed.

    Order Summary:
    ${orderDetails.items.map((item) => `- ${item.name} (x${item.quantity}): $${(item.price * item.quantity).toFixed(2)}`).join("\n")}

    Total Amount Paid: $${orderDetails.totalAmount.toFixed(2)}
    Payment Method: ${orderDetails.paymentMethod}
    Service Address: ${orderDetails.serviceAddress}

    We will contact you shortly to confirm the service schedule.

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
