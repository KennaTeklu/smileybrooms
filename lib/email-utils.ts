import { formatCurrency } from "./utils"

export function generateOrderConfirmationEmailBody(order: any): string {
  let body = `Dear ${order.customerName},\n\n`
  body += `Thank you for your order with Smiley Brooms! Your order #${order.orderId} has been successfully placed.\n\n`
  body += "Here are the details of your order:\n\n"

  order.items.forEach((item: any) => {
    body += `- ${item.name} (x${item.quantity}): ${formatCurrency(item.price * item.quantity)}\n`
    if (item.metadata?.description) {
      body += `  Description: ${item.metadata.description}\n`
    }
  })

  body += `\nTotal: ${formatCurrency(order.totalPrice)}\n\n`
  body += `Service Address: ${order.address.street}, ${order.address.city}, ${order.address.state} ${order.address.zip}\n`
  body += `Contact: ${order.contact.email} / ${order.contact.phone}\n\n`

  if (order.paymentType === "in_person") {
    body += "Payment will be collected in-person upon service completion.\n\n"
  } else {
    body += "Your payment has been processed successfully.\n\n"
  }

  body += "We look forward to providing you with a sparkling clean home!\n\n"
  body += "Best regards,\nThe Smiley Brooms Team"
  return encodeURIComponent(body)
}

export function generateOutOfServiceMailtoLink(state: string): string {
  const subject = encodeURIComponent(`Inquiry about service in ${state}`)
  const body = encodeURIComponent(
    `Dear Smiley Brooms Team,\n\nI was wondering if you guys work in ${state}? If not, what is your plan for future expansion into this area?\n\nBest regards,`,
  )
  return `mailto:info@smileybrooms.com?subject=${subject}&body=${body}`
}
