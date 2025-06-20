/**
 * Email validation utilities with support for domain-specific validation
 */

// Basic email regex pattern
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Common email domains for validation
export const COMMON_EMAIL_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "icloud.com",
  "protonmail.com",
  "aol.com",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "gmx.com",
  "live.com",
  "me.com",
  "proton.me",
  "msn.com",
  "comcast.net",
  "verizon.net",
  "att.net",
  "cox.net",
  "charter.net",
  "earthlink.net",
  "mac.com",
  "fastmail.com",
  "tutanota.com",
]

// Business email domains (for B2B applications)
export const BUSINESS_EMAIL_DOMAINS = [
  "company.com",
  "business.com",
  "enterprise.com",
  "corp.com",
  "organization.org",
  "agency.gov",
]

// Education email domains
export const EDUCATION_EMAIL_DOMAINS = ["edu", "ac.uk", "edu.au", "edu.cn", "ac.jp", "student.edu"]

/**
 * Validates if a string is a properly formatted email address
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false
  return EMAIL_REGEX.test(email.trim())
}

/**
 * Validates if an email belongs to a specific domain
 * @param email - The email address to validate
 * @param domain - The domain to check against (e.g., "gmail.com")
 * @returns True if the email belongs to the specified domain
 */
export function isEmailFromDomain(email: string, domain: string): boolean {
  if (!isValidEmail(email)) return false
  return email.trim().toLowerCase().endsWith(`@${domain.toLowerCase()}`)
}

/**
 * Validates if an email belongs to any of the provided domains
 * @param email - The email address to validate
 * @param domains - Array of domains to check against
 * @returns True if the email belongs to any of the specified domains
 */
export function isEmailFromAllowedDomains(email: string, domains: string[]): boolean {
  if (!isValidEmail(email)) return false
  const emailDomain = email.trim().toLowerCase().split("@")[1]
  return domains.some((domain) => emailDomain === domain.toLowerCase())
}

/**
 * Validates if an email is from a common provider (gmail, outlook, etc.)
 * @param email - The email address to validate
 * @returns True if the email is from a common provider
 */
export function isCommonEmail(email: string): boolean {
  return isEmailFromAllowedDomains(email, COMMON_EMAIL_DOMAINS)
}

/**
 * Validates if an email is from an educational institution
 * @param email - The email address to validate
 * @returns True if the email is from an educational domain
 */
export function isEducationEmail(email: string): boolean {
  if (!isValidEmail(email)) return false
  const domain = email.trim().toLowerCase().split("@")[1]
  return EDUCATION_EMAIL_DOMAINS.some((eduDomain) => domain === eduDomain || domain.endsWith(`.${eduDomain}`))
}

/**
 * Validates if an email is a disposable/temporary email
 * @param email - The email address to validate
 * @returns True if the email appears to be from a disposable email service
 */
export function isDisposableEmail(email: string): boolean {
  // This is a simplified check - in production, you might want to use a more comprehensive list
  // or a third-party service to check for disposable emails
  const disposableDomains = [
    "mailinator.com",
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "throwawaymail.com",
    "yopmail.com",
    "getairmail.com",
    "fakeinbox.com",
    "sharklasers.com",
    "guerrillamail.info",
    "grr.la",
    "spam4.me",
  ]

  return isEmailFromAllowedDomains(email, disposableDomains)
}

/**
 * Extracts the domain part from an email address
 * @param email - The email address
 * @returns The domain part of the email or null if invalid
 */
export function getEmailDomain(email: string): string | null {
  if (!isValidEmail(email)) return null
  return email.trim().toLowerCase().split("@")[1]
}

/**
 * Suggests corrections for common email typos
 * @param email - The potentially misspelled email
 * @returns Suggested correction or null if no suggestion
 */
export function suggestEmailCorrection(email: string): string | null {
  if (isValidEmail(email)) return null

  const commonTypos: Record<string, string> = {
    "gmial.com": "gmail.com",
    "gamil.com": "gmail.com",
    "gmal.com": "gmail.com",
    "gmail.co": "gmail.com",
    "gmail.cm": "gmail.com",
    "hotmial.com": "hotmail.com",
    "hotmal.com": "hotmail.com",
    "hotmail.co": "hotmail.com",
    "yaho.com": "yahoo.com",
    "yahooo.com": "yahoo.com",
    "yahoo.co": "yahoo.com",
    "outloo.com": "outlook.com",
    "outlok.com": "outlook.com",
    "outlook.co": "outlook.com",
  }

  const parts = email.trim().split("@")
  if (parts.length !== 2) return null

  const [username, domain] = parts

  // Check for common domain typos
  if (commonTypos[domain.toLowerCase()]) {
    return `${username}@${commonTypos[domain.toLowerCase()]}`
  }

  return null
}
