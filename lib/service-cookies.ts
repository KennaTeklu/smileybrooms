"use client"

import Cookies from "js-cookie"

const SERVICE_COUNT_KEY = "service_count"
const SERVICE_HISTORY_KEY = "service_history"

export type ServiceRecord = {
  id: string
  name: string
  date: string
  completed: boolean
  scheduledDate?: string
}

export function getServiceCount(): number {
  const count = Cookies.get(SERVICE_COUNT_KEY)
  return count ? Number.parseInt(count, 10) : 0
}

export function incrementServiceCount(): number {
  const currentCount = getServiceCount()
  const newCount = currentCount + 1
  Cookies.set(SERVICE_COUNT_KEY, newCount.toString(), { expires: 365 })
  return newCount
}

export function getServiceHistory(): ServiceRecord[] {
  const history = Cookies.get(SERVICE_HISTORY_KEY)
  return history ? JSON.parse(history) : []
}

export function addServiceRecord(service: ServiceRecord): ServiceRecord[] {
  const history = getServiceHistory()
  const updatedHistory = [...history, service]
  Cookies.set(SERVICE_HISTORY_KEY, JSON.stringify(updatedHistory), { expires: 365 })
  return updatedHistory
}

export function updateServiceRecord(id: string, updates: Partial<ServiceRecord>): ServiceRecord[] {
  const history = getServiceHistory()
  const updatedHistory = history.map((record) => (record.id === id ? { ...record, ...updates } : record))
  Cookies.set(SERVICE_HISTORY_KEY, JSON.stringify(updatedHistory), { expires: 365 })
  return updatedHistory
}

export function getRemainingServices(): number {
  const history = getServiceHistory()
  return history.filter((record) => !record.completed).length
}

export function getServiceRecords(): ServiceRecord[] {
  return getServiceHistory()
}
