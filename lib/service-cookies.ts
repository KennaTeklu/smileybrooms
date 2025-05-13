"use client"

import Cookies from "js-cookie"

const SERVICE_COUNT_KEY = "serviceCount"
const SERVICE_HISTORY_KEY = "serviceHistory"

// Cookie names
const SELECTED_SERVICES_COOKIE = "selectedServices"
const REMAINING_SERVICES_COOKIE = "remainingServices"

// Types
export type ServiceType = {
  id: string
  name: string
  price: number
  quantity: number
}

// Get selected services from cookies
export function getSelectedServices(): ServiceType[] {
  const cookieValue = Cookies.get(SELECTED_SERVICES_COOKIE)
  if (!cookieValue) return []

  try {
    return JSON.parse(cookieValue)
  } catch (error) {
    console.error("Error parsing selected services cookie:", error)
    return []
  }
}

// Save selected services to cookies
export function saveSelectedServices(services: ServiceType[]): void {
  Cookies.set(SELECTED_SERVICES_COOKIE, JSON.stringify(services), { expires: 7 })
}

// Add a service to selected services
export function addSelectedService(service: ServiceType): void {
  const currentServices = getSelectedServices()

  // Check if service already exists
  const existingServiceIndex = currentServices.findIndex((s) => s.id === service.id)

  if (existingServiceIndex >= 0) {
    // Update quantity if service exists
    currentServices[existingServiceIndex].quantity += service.quantity
  } else {
    // Add new service
    currentServices.push(service)
  }

  saveSelectedServices(currentServices)
}

// Remove a service from selected services
export function removeSelectedService(serviceId: string): void {
  const currentServices = getSelectedServices()
  const updatedServices = currentServices.filter((service) => service.id !== serviceId)
  saveSelectedServices(updatedServices)
}

// Update service quantity
export function updateServiceQuantity(serviceId: string, quantity: number): void {
  const currentServices = getSelectedServices()

  const updatedServices = currentServices.map((service) => {
    if (service.id === serviceId) {
      return { ...service, quantity }
    }
    return service
  })

  saveSelectedServices(updatedServices)
}

// Clear all selected services
export function clearSelectedServices(): void {
  Cookies.remove(SELECTED_SERVICES_COOKIE)
}

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
  const cookieValue = Cookies.get(REMAINING_SERVICES_COOKIE)
  if (!cookieValue) {
    return 5 // Example: return a default value of 5
  }

  try {
    return Number.parseInt(cookieValue, 10)
  } catch (error) {
    console.error("Error parsing remaining services cookie:", error)
    return 5 // Example: return a default value of 5
  }
}
