// Service record type
export type ServiceRecord = {
  id: string
  name: string
  date: string
  completed: boolean
  scheduledDate: string
}

// Function to increment the service count in cookies
export function incrementServiceCount(): void {
  const currentCount = getServiceCount()
  const newCount = currentCount + 1

  // In client components, we need to use document.cookie
  if (typeof document !== "undefined") {
    document.cookie = `serviceCount=${newCount}; path=/; max-age=31536000; SameSite=Lax`
  }
}

// Function to get the current service count from cookies
export function getServiceCount(): number {
  // In client components, we need to parse document.cookie
  if (typeof document !== "undefined") {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("serviceCount="))
      ?.split("=")[1]

    return cookieValue ? Number.parseInt(cookieValue, 10) : 0
  }

  // Server-side fallback
  return 0
}

// Function to add a service record to cookies
export function addServiceRecord(record: ServiceRecord): void {
  const records = getServiceRecords()
  records.push(record)

  // In client components, we need to use document.cookie
  if (typeof document !== "undefined") {
    document.cookie = `serviceRecords=${JSON.stringify(records)}; path=/; max-age=31536000; SameSite=Lax`
  }
}

// Function to get all service records from cookies
export function getServiceRecords(): ServiceRecord[] {
  // In client components, we need to parse document.cookie
  if (typeof document !== "undefined") {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("serviceRecords="))
      ?.split("=")[1]

    return cookieValue ? JSON.parse(decodeURIComponent(cookieValue)) : []
  }

  // Server-side fallback
  return []
}

// Function to update a service record in cookies
export function updateServiceRecord(id: string, updates: Partial<ServiceRecord>): void {
  const records = getServiceRecords()
  const index = records.findIndex((record) => record.id === id)

  if (index !== -1) {
    records[index] = { ...records[index], ...updates }

    // In client components, we need to use document.cookie
    if (typeof document !== "undefined") {
      document.cookie = `serviceRecords=${JSON.stringify(records)}; path=/; max-age=31536000; SameSite=Lax`
    }
  }
}

// Function to delete a service record from cookies
export function deleteServiceRecord(id: string): void {
  const records = getServiceRecords()
  const filteredRecords = records.filter((record) => record.id !== id)

  // In client components, we need to use document.cookie
  if (typeof document !== "undefined") {
    document.cookie = `serviceRecords=${JSON.stringify(filteredRecords)}; path=/; max-age=31536000; SameSite=Lax`
  }
}
