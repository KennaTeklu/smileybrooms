/**
 * Format form data into a readable paragraph for email
 */
export function formatFormDataForEmail(emailData: any): string {
  const customer = emailData.customer || {}
  const service = emailData.service || {}
  const pricing = emailData.pricing || {}

  // Format service details
  const serviceDetails = `${service.roomName} (${service.roomCount} room${service.roomCount !== 1 ? "s" : ""})`
  const cleaningLevel = service.selectedTier || "Standard"
  const frequency = service.frequency?.replace("_", " ") || "one-time"

  // Format add-ons and reductions
  const addOns =
    service.selectedAddOns?.length > 0 ? `Add-ons: ${service.selectedAddOns.join(", ")}` : "No add-ons selected"

  const reductions =
    service.selectedReductions?.length > 0
      ? `Skipped services: ${service.selectedReductions.join(", ")}`
      : "No services skipped"

  // Format address
  const address = customer.address
    ? `${customer.address}, ${customer.city || ""}, ${customer.state || ""} ${customer.zipCode || ""}`
    : "No address provided"

  // Format special instructions
  const specialInstructions = customer.specialInstructions
    ? `Special Instructions: ${customer.specialInstructions}`
    : "No special instructions provided."

  // Format video recording preference
  const videoRecording = customer.allowVideoRecording
    ? "Customer has agreed to allow video recording for quality assurance (discount applied)."
    : "Customer has declined video recording."

  // Compile the email content
  return `
New Cleaning Service Request - smileybrooms

CUSTOMER INFORMATION:
Name: ${customer.name || "Not provided"}
Email: ${customer.email || "Not provided"}
Phone: ${customer.phone || "Not provided"}

SERVICE DETAILS:
Service: ${serviceDetails}
Cleaning Level: ${cleaningLevel}
Frequency: ${frequency}
${addOns}
${reductions}

PRICING:
Base Price: $${pricing.basePrice?.toFixed(2) || "0.00"}
${pricing.videoRecordingDiscount > 0 ? `Video Recording Discount: -$${pricing.videoRecordingDiscount.toFixed(2)}` : ""}
Total Price: $${pricing.finalPrice?.toFixed(2) || "0.00"}

SERVICE LOCATION:
${address}

ADDITIONAL INFORMATION:
${specialInstructions}
${videoRecording}

This request was submitted through the smileybrooms website pricing calculator.

Please contact the customer to confirm the appointment and arrange payment.
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
