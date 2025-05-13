/**
 * Utility functions for consistent error handling across the application
 */

// Standard error response structure
export interface ErrorResponse {
  error: string
  message: string
  code: number
  details?: any
}

// Function to create consistent error responses
export function createErrorResponse(
  error: unknown,
  defaultMessage = "An unexpected error occurred",
  defaultCode = 500,
): ErrorResponse {
  // Handle different error types
  if (error instanceof Error) {
    return {
      error: error.name,
      message: error.message || defaultMessage,
      code: defaultCode,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }
  }

  // Handle string errors
  if (typeof error === "string") {
    return {
      error: "Error",
      message: error,
      code: defaultCode,
    }
  }

  // Default case for unknown error types
  return {
    error: "UnknownError",
    message: defaultMessage,
    code: defaultCode,
    details: process.env.NODE_ENV === "development" ? error : undefined,
  }
}

// Function to handle API errors consistently
export async function handleApiRequest<T>(
  requestFn: () => Promise<T>,
  errorMessage = "API request failed",
): Promise<{ data?: T; error?: ErrorResponse }> {
  try {
    const data = await requestFn()
    return { data }
  } catch (error) {
    console.error(`API Error: ${errorMessage}`, error)
    return { error: createErrorResponse(error, errorMessage) }
  }
}

// Function to safely parse JSON with error handling
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch (error) {
    console.error("JSON parse error:", error)
    return fallback
  }
}

// Function to safely access localStorage with error handling
export function safeLocalStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    if (value === null) return fallback
    return safeJsonParse(value, fallback)
  } catch (error) {
    console.error(`LocalStorage error for key ${key}:`, error)
    return fallback
  }
}

// Function to safely execute a function with error handling
export function safeExecute<T, A extends any[]>(fn: (...args: A) => T, fallback: T, ...args: A): T {
  try {
    return fn(...args)
  } catch (error) {
    console.error("Function execution error:", error)
    return fallback
  }
}
