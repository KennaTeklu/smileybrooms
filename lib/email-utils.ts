/**
 * Utility functions for generating email links and sending emails.
 */

interface SendEmailOptions {
  to: string
  subject: string
  body: string
}

/**
 * Generates a mailto link.
 * @param options - Options for the mailto link (to, subject, body).
 * @returns A mailto string.
 */
export function generateMailtoLink({ to, subject, body }: SendEmailOptions): string {
  const encodedSubject = encodeURIComponent(subject)
  const encodedBody = encodeURIComponent(body)
  return `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`
}

/**
 * Sends an email by opening the user's default mail client.
 * @param options - Options for the email (to, subject, body).
 */
export function sendEmailViaMailto(options: SendEmailOptions): void {
  window.location.href = generateMailtoLink(options)
}

/**
 * Generates a mailto link for out-of-service area inquiries.
 * @param state - The state the user selected.
 * @returns A mailto string.
 */
export function generateOutOfServiceMailtoLink(state: string): string {
  const subject = `Inquiry about service in ${state}`
  const body = `Dear Smiley Brooms Team,

I was wondering if you guys work in ${state}? If not, what is your plan for future expansion into this area?

Best regards,
${"" /* You can add user's name/email here if available from context */}
`
  return generateMailtoLink({
    to: "info@smileybrooms.com", // Replace with your actual contact email
    subject,
    body,
  })
}
