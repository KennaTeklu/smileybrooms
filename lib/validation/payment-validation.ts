// Basic validation for credit card number (length check, not Luhn algorithm)
export function isValidCreditCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, "") // Remove spaces
  return /^\d{13,19}$/.test(cleaned) // Typically 13-19 digits
}

// Basic validation for expiry date (MM/YY format and future date)
export function isValidExpiryDate(expiryDate: string): boolean {
  const parts = expiryDate.split("/")
  if (parts.length !== 2) return false

  const month = Number.parseInt(parts[0], 10)
  const year = Number.parseInt(parts[1], 10)

  if (isNaN(month) || isNaN(year) || month < 1 || month > 12) return false

  const currentYear = new Date().getFullYear() % 100 // Get last two digits of current year
  const currentMonth = new Date().getMonth() + 1 // Month is 0-indexed

  if (year < currentYear) return false
  if (year === currentYear && month < currentMonth) return false

  return true
}

// Basic validation for CVC (3 or 4 digits)
export function isValidCVC(cvc: string): boolean {
  return /^\d{3,4}$/.test(cvc)
}
