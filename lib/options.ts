export const options = {
  /**
   * When true, price-breakdown rows may render item/room images
   * if the PricingEngine supplies them.
   * You can extend this object with more UI tuning flags later.
   */
  includeImages: true,
  // Regex for a common US phone number format (e.g., 555-555-5555, (555) 555-5555, 555 555 5555, 5555555555)
  phoneRegex: /^$$?([0-9]{3})$$?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
  // Add other global options here as needed
  // e.g., default country for addresses, minimum order value, etc.
}
