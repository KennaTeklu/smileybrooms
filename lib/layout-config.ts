/**
 * Layout Configuration
 *
 * IMPORTANT: These settings control header and footer visibility.
 * DO NOT MODIFY without explicit approval.
 *
 * Rules:
 * 1. Header visible on all pages except homepage (unless cart has items)
 * 2. On homepage: only cart visible in header when cart has items
 * 3. Current page link excluded from navigation
 * 4. Footer follows same rules as header
 */

export const LAYOUT_CONFIG = {
  // Lock these settings - require explicit override
  LOCKED: true,

  header: {
    // Show full header (logo + nav) on non-home pages
    showFullHeaderOnNonHomePage: true,

    // On homepage: only show cart when it has items
    showOnlyCartOnHomePage: true,

    // Hide current page from navigation
    hideCurrentPageFromNav: true,

    // Always show cart button when conditions are met
    alwaysShowCartWhenApplicable: true,
  },

  footer: {
    // Follow same visibility rules as header
    followHeaderRules: true,

    // Hide current page links from footer navigation
    hideCurrentPageFromNav: true,
  },

  // Override protection
  canOverride: false,

  // Last modified tracking
  lastModified: new Date().toISOString(),
  modifiedBy: "system",
} as const

/**
 * Validates if layout modifications are allowed
 */
export function validateLayoutModification(requestedBy: string): boolean {
  if (LAYOUT_CONFIG.LOCKED && !LAYOUT_CONFIG.canOverride) {
    console.warn(`Layout modification attempted by ${requestedBy} but settings are locked`)
    return false
  }
  return true
}

/**
 * Gets current layout configuration
 */
export function getLayoutConfig() {
  return LAYOUT_CONFIG
}
