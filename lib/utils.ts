/**
 * UTILITY FUNCTIONS MODULE
 *
 * This file contains core utility functions used throughout the application.
 * The primary functions include class name merging with cn() and currency formatting.
 *
 * WHY THIS CODE EXISTS:
 * - Provides reusable utility functions to maintain consistency across the application
 * - Centralizes common operations like class name merging and currency formatting
 * - Reduces code duplication and ensures consistent behavior
 *
 * POTENTIAL IMPROVEMENTS AND SUGGESTIONS:
 * 1. Add more currency options beyond USD
 * 2. Add number formatting utilities for percentages, decimals, etc.
 * 3. Add date formatting utilities
 * 4. Add string manipulation utilities (truncate, capitalize, etc.)
 * 5. Add validation utilities for common data types
 * 6. Add debounce and throttle functions
 * 7. Add memoization utilities
 * 8. Add array and object manipulation utilities
 * 9. Add type guards and type utilities
 * 10. Add URL manipulation utilities
 * 11. Add cookie management utilities
 * 12. Add local storage utilities
 * 13. Add session storage utilities
 * 14. Add clipboard utilities
 * 15. Add math utilities (random, round to precision, etc.)
 * 16. Add color manipulation utilities
 * 17. Add responsive design utilities
 * 18. Add accessibility utilities
 * 19. Add internationalization utilities
 * 20. Add performance measurement utilities
 * 21. Add error handling utilities
 * 22. Add logging utilities
 * 23. Add analytics tracking utilities
 * 24. Add form handling utilities
 * 25. Add animation utilities
 * 26. Add image processing utilities
 * 27. Add security utilities (sanitization, etc.)
 * 28. Add browser detection utilities
 * 29. Add device detection utilities
 * 30. Add feature detection utilities
 * 31. Add network status utilities
 * 32. Add geolocation utilities
 * 33. Add file handling utilities
 * 34. Add drag and drop utilities
 * 35. Add keyboard shortcut utilities
 * 36. Add focus management utilities
 * 37. Add scroll management utilities
 * 38. Add intersection observer utilities
 * 39. Add mutation observer utilities
 * 40. Add resize observer utilities
 * 41. Add performance observer utilities
 * 42. Add web worker utilities
 * 43. Add service worker utilities
 * 44. Add WebSocket utilities
 * 45. Add SSE (Server-Sent Events) utilities
 * 46. Add WebRTC utilities
 * 47. Add media query utilities
 * 48. Add media capture utilities
 * 49. Add speech recognition utilities
 * 50. Add speech synthesis utilities
 * 51. Add battery status utilities
 * 52. Add vibration utilities
 * 53. Add notification utilities
 * 54. Add share utilities
 * 55. Add payment request utilities
 * 56. Add credential management utilities
 * 57. Add Web Authentication utilities
 * 58. Add Web Bluetooth utilities
 * 59. Add Web USB utilities
 * 60. Add Web MIDI utilities
 * 61. Add Web Serial utilities
 * 62. Add Web NFC utilities
 * 63. Add Web HID utilities
 * 64. Add Web Share utilities
 * 65. Add Web XR utilities
 * 66. Add Web Crypto utilities
 * 67. Add Web Audio utilities
 * 68. Add Web GL utilities
 * 69. Add Canvas utilities
 * 70. Add SVG utilities
 * 71. Add PDF utilities
 * 72. Add barcode/QR code utilities
 * 73. Add compression utilities
 * 74. Add encryption utilities
 * 75. Add hashing utilities
 * 76. Add UUID generation utilities
 * 77. Add slug generation utilities
 * 78. Add random data generation utilities
 * 79. Add data validation utilities
 * 80. Add data transformation utilities
 * 81. Add data filtering utilities
 * 82. Add data sorting utilities
 * 83. Add data grouping utilities
 * 84. Add data aggregation utilities
 * 85. Add data visualization utilities
 * 86. Add data export utilities
 * 87. Add data import utilities
 * 88. Add data synchronization utilities
 * 89. Add data caching utilities
 * 90. Add data persistence utilities
 * 91. Add data migration utilities
 * 92. Add data backup utilities
 * 93. Add data recovery utilities
 * 94. Add data compression utilities
 * 95. Add data decompression utilities
 * 96. Add data encryption utilities
 * 97. Add data decryption utilities
 * 98. Add data anonymization utilities
 * 99. Add data pseudonymization utilities
 * 100. Add data masking utilities
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

export const isClient = () => typeof window !== "undefined"
