// lib/logger.ts
type LogLevel = "info" | "warn" | "error" | "debug"

interface LogOptions {
  context?: Record<string, any>
  error?: Error
}

const log = (level: LogLevel, message: string, options?: LogOptions) => {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...options?.context,
    error: options?.error
      ? {
          name: options.error.name,
          message: options.error.message,
          stack: options.error.stack,
        }
      : undefined,
  }

  // In a real application, you would send this to an external logging service
  // e.g., Sentry, Datadog, LogRocket, CloudWatch Logs, etc.
  if (process.env.NODE_ENV === "development") {
    if (level === "error") {
      console.error(JSON.stringify(logEntry, null, 2))
    } else if (level === "warn") {
      console.warn(JSON.stringify(logEntry, null, 2))
    } else {
      console.log(JSON.stringify(logEntry, null, 2))
    }
  } else {
    // In production, you might only log errors or critical warnings
    if (level === "error" || level === "warn") {
      console.log(JSON.stringify(logEntry)) // Log as single line for easier parsing by log aggregators
    }
  }
}

export const logger = {
  info: (message: string, options?: LogOptions) => log("info", message, options),
  warn: (message: string, options?: LogOptions) => log("warn", message, options),
  error: (message: string, options?: LogOptions) => log("error", message, options),
  debug: (message: string, options?: LogOptions) => {
    if (process.env.NODE_ENV === "development") {
      log("debug", message, options)
    }
  },
}
