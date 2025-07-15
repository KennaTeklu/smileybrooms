import type { CheckoutData } from "@/app/checkout/page"

/**
 * Generates a mailto link for out-of-service area inquiries.
 * @param state The state the user selected.
 * @returns A mailto link string.
 */
export function generateOutOfServiceMailtoLink(state: string): string {
  const recipient = "support@smileybrooms.com"
  const subject = encodeURIComponent(`Service Inquiry for ${state}`)
  const body = encodeURIComponent(
    `Dear Smiley Brooms Team,\n\nI was wondering if you guys work in ${state}? If not, what is your plan in the future regarding service expansion to this area?\n\nBest regards,\n[Your Name]`,
  )
  return `mailto:${recipient}?subject=${subject}&body=${body}`
}

/**
 * Generates a mailto link for custom quote requests.
 * @param details Optional details to include in the email body.
 * @returns A mailto link string.
 */
export function generateCustomQuoteMailtoLink(details?: string): string {
  const recipient = "quotes@smileybrooms.com"
  const subject = encodeURIComponent("Custom Cleaning Quote Request")
  const body = encodeURIComponent(
    `Dear Smiley Brooms Team,\n\nI would like to request a custom cleaning quote. Here are some details:\n\n${details || "Please describe your specific cleaning needs here."}\n\nBest regards,\n[Your Name]`,
  )
  return `mailto:${recipient}?subject=${subject}&body=${body}`
}

/**
 * Generates a mailto link for the email summary.
 * @param summaryContent The content of the email summary.
 * @param recipient The recipient's email address.
 * @returns A mailto link string.
 */
export function generateEmailSummaryMailtoLink(summaryContent: string, recipient: string): string {
  const subject = encodeURIComponent("Your Smiley Brooms Service Summary")
  const body = encodeURIComponent(summaryContent)
  return `mailto:${recipient}?subject=${subject}&body=${body}`
}

/**
 * Generates a mailto link for career inquiries.
 * @param position The position the user is inquiring about.
 * @returns A mailto link string.
 */
export function generateCareerInquiryMailtoLink(position: string): string {
  const recipient = "careers@smileybrooms.com"
  const subject = encodeURIComponent(`Inquiry about ${position} Position`)
  const body = encodeURIComponent(
    `Dear Smiley Brooms HR Team,\n\nI am writing to inquire more about the ${position} position advertised on your website. Could you please provide more details regarding this role?\n\nThank you,\n[Your Name]`,
  )
  return `mailto:${recipient}?subject=${subject}&body=${body}`
}

/**
 * Generates a mailto link for general contact.
 * @param subjectLine Optional subject line for the email.
 * @param bodyContent Optional body content for the email.
 * @returns A mailto link string.
 */
export function generateContactMailtoLink(subjectLine?: string, bodyContent?: string): string {
  const recipient = "info@smileybrooms.com"
  const subject = subjectLine ? encodeURIComponent(subjectLine) : ""
  const body = bodyContent ? encodeURIComponent(bodyContent) : ""
  return `mailto:${recipient}${subject ? `?subject=${subject}` : ""}${body ? `${subject ? "&" : "?"}body=${body}` : ""}`
}

/**
 * Generates a mailto link for a completed checkout.
 * @param checkoutData The full checkout data.
 * @returns A mailto link string.
 */
export function generateCheckoutConfirmationMailtoLink(checkoutData: CheckoutData): string {
  const { contact, address, payment } = checkoutData
  const recipient = contact.email
  const subject = encodeURIComponent("Your Smiley Brooms Booking Confirmation")

  let bodyContent = `Dear ${contact.fullName},\n\nThank you for your booking with Smiley Brooms!\n\n`
  bodyContent += "Here are your booking details:\n\n"
  bodyContent += `Service Address: ${address.street}, ${address.city}, ${address.state} ${address.zipCode}\n`
  bodyContent += `Contact Phone: ${contact.phone}\n`
  bodyContent += `Payment Method: ${payment.method === "card" ? "Credit Card" : "In-Person"}\n\n`
  bodyContent += "We look forward to providing you with a sparkling clean home!\n\n"
  bodyContent += "Best regards,\nSmiley Brooms Team"

  const body = encodeURIComponent(bodyContent)
  return `mailto:${recipient}?subject=${subject}&body=${body}`
}
