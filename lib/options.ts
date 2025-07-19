export interface DisplayOptions {
  /**
   * Toggle whether room/add-on images are rendered in the
   * checkout order summary.
   * Set to `false` if you’d prefer a cleaner, text-only list.
   */
  includeImages: boolean
}

/**
 * Centralised UI/feature flags used across the front-end.
 * Extend this object whenever you need global, client-side
 * feature toggles (e.g. enableAnimations, showBetaBanner, etc.).
 */
export const options: DisplayOptions = {
  includeImages: true,
}
