/**
 * Shim file to satisfy legacy imports.
 * It simply re-exports the real Accessibility context utilities
 * from `lib/accessibility-context.tsx`.
 */

import { AccessibilityProvider, useAccessibility } from "@/lib/accessibility-context"

// 1. keep existing named exports
export { AccessibilityProvider, useAccessibility }

// 2. provide the missing alias expected by other modules
export const useAccessibilityContext = useAccessibility
