/**
 * Compatibility shim -- keeps legacy imports working.
 *
 * Several older components import from:
 *   "context/accessibility-context"
 * while the actual implementation now lives in
 *   "@/lib/accessibility-context".
 *
 * We simply re-export the current symbols so both paths resolve.
 */

import { AccessibilityProvider, useAccessibility } from "@/lib/accessibility-context"

// Legacy alias expected by the build:
export const useAccessibilityContext = useAccessibility

// Pass through any other public APIs you might need:
export { AccessibilityProvider, useAccessibility }
