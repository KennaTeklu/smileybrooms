"use client"

const SERVICE_COUNT_KEY = "serviceCount"
const SERVICE_HISTORY_KEY = "serviceHistory"

// Function to get the service count from localStorage
export function getServiceCount(): number {
  if (typeof window === "undefined") return 0
  const count = localStorage.getItem(SERVICE_COUNT_KEY)
  return count ? Number.parseInt(count, 10) : 0
}

// Function to increment the service count in localStorage
export function incrementServiceCount(): void {
  if (typeof window === "undefined") return
  const currentCount = getServiceCount()
  localStorage.setItem(SERVICE_COUNT_KEY, (currentCount + 1).toString())
}

// Function to get the service history from localStorage
export function getServiceHistory(): any[] {
  if (typeof window === "undefined") return []
  const history = localStorage.getItem(SERVICE_HISTORY_KEY)
  return history ? JSON.parse(history) : []
}

// Function to add a service record to localStorage
export function addServiceRecord(record: any): void {
  if (typeof window === "undefined") return
  const history = getServiceHistory()
  localStorage.setItem(SERVICE_HISTORY_KEY, JSON.stringify([...history, record]))
}

// Function to get the remaining services (example: subscription based)
export function getRemainingServices(): number {
  // This is a placeholder, implement your logic here
  return 5 // Example: return a default value of 5
}
