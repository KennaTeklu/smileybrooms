/**
 * Layout Configuration
 *
 * This configuration controls header and footer visibility rules.
 * These settings are locked and should not be modified without explicit authorization.
 */

export interface LayoutConfig {
  header: {
    showFullHeaderOnNonHomePage: boolean
    showOnlyCartOnHomePage: boolean
    hideCurrentPageFromNav: boolean
    alwaysShowCartWhenApplicable: boolean
  }
  footer: {
    showFullFooterOnNonHomePage: boolean
    showOnlyWhenCartHasItems: boolean
    hideCurrentPageFromNav: boolean
  }
  locked: boolean
}

const LAYOUT_CONFIG: LayoutConfig = {
  header: {
    showFullHeaderOnNonHomePage: true,
    showOnlyCartOnHomePage: true,
    hideCurrentPageFromNav: true,
    alwaysShowCartWhenApplicable: true,
  },
  footer: {
    showFullFooterOnNonHomePage: true,
    showOnlyWhenCartHasItems: true,
    hideCurrentPageFromNav: true,
  },
  locked: true,
}

export function getLayoutConfig(): LayoutConfig {
  if (LAYOUT_CONFIG.locked) {
    // Return a frozen copy to prevent modifications
    return Object.freeze({ ...LAYOUT_CONFIG })
  }
  return LAYOUT_CONFIG
}

export function updateLayoutConfig(newConfig: Partial<LayoutConfig>): boolean {
  if (LAYOUT_CONFIG.locked) {
    console.warn("Layout configuration is locked and cannot be modified")
    return false
  }

  Object.assign(LAYOUT_CONFIG, newConfig)
  return true
}

export function unlockLayoutConfig(authKey: string): boolean {
  // This would normally verify against a secure auth key
  if (authKey === "ADMIN_OVERRIDE_2024") {
    LAYOUT_CONFIG.locked = false
    return true
  }
  return false
}
