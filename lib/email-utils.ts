/**
 * Email Utilities Module
 *
 * This module provides functions for formatting form data into email content
 * and generating mailto links for direct email client integration.
 */

import { formatPhoneNumber } from "./form-utils"

/**
 * Format form data into a readable paragraph for email
 */
export function formatFormDataForEmail(formData: Record<string, any>): string {
  // Extract customer information
  const customerInfo = formData.customer || {}
  const rooms = formData.rooms || ""
  const frequency = formData.frequency || "one_time"
  const serviceType = formData.serviceType || "standard"
  const isRecurring = formData.isRecurring || false
  const recurringInterval = formData.recurringInterval || ""
  const totalPrice = formData.price || 0

  // Format frequency label
  const frequencyLabel =
    {
      one_time: "One-Time Cleaning",
      weekly: "Weekly Cleaning",
      biweekly: "Biweekly Cleaning",
      monthly: "Monthly Cleaning",
      semi_annual: "Semi-Annual Cleaning",
      annually: "Annual Cleaning",
      vip_daily: "VIP Daily Cleaning",
    }[frequency] || frequency

  // Format service type
  const serviceTypeLabel = serviceType === "standard" ? "Standard Cleaning" : "Premium Detailing"

  // Format recurring information
  const recurringText = isRecurring
    ? `This is a recurring service on a ${recurringInterval}ly basis.`
    : "This is a one-time service."

  // Format customer address
  const address = customerInfo.address
    ? `${customerInfo.address}, ${customerInfo.city || ""}, ${customerInfo.state || ""} ${customerInfo.zipCode || ""}`
    : "No address provided"

  // Format special instructions
  const specialInstructions = customerInfo.specialInstructions
    ? `Special Instructions: ${customerInfo.specialInstructions}`
    : "No special instructions provided."

  // Format video recording preference
  const videoRecording = customerInfo.allowVideoRecording
    ? "Customer has agreed to allow video recording for quality assurance."
    : "Customer has declined video recording."

  // Compile the paragraph
  return `
New Cleaning Service Request

Customer: ${customerInfo.name || "Not provided"}
Email: ${customerInfo.email || "Not provided"}
Phone: ${formatPhoneNumber(customerInfo.phone || "")}

Service Details:
${serviceTypeLabel} - ${frequencyLabel}
Rooms: ${rooms}
Price: $${totalPrice.toFixed(2)}
${recurringText}

Location:
${address}
${customerInfo.googleMapsLink ? `Google Maps: ${customerInfo.googleMapsLink}` : ""}

Additional Information:
${specialInstructions}
${videoRecording}

This request was submitted through the SmileBrooms website calculator.
`.trim()
}

/**
 * Generate a mailto link with the form data
 */
export function generateMailtoLink(formData: Record<string, any>, emailTo = "customize@smileybrooms.com"): string {
  const subject = `New Cleaning Request - ${formData.customer?.name || "Website Customer"}`
  const body = formatFormDataForEmail(formData)

  return `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/**
 * Open Gmail with pre-filled email content
 * Note: This will attempt to open Gmail, but ultimately the user's default email client will be used
 */
export function openGmailWithFormData(formData: Record<string, any>, emailTo = "customize@smileybrooms.com"): void {
  const subject = `New Cleaning Request - ${formData.customer?.name || "Website Customer"}`
  const body = formatFormDataForEmail(formData)

  // Gmail-specific mailto URL
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailTo)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  // Open in a new tab
  window.open(gmailUrl, "_blank")
}
