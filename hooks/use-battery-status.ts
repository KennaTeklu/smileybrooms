"use client"

import { useState, useEffect } from "react"

interface BatteryStatus {
  level: number | null
  charging: boolean | null
  chargingTime: number | null
  dischargingTime: number | null
  supported: boolean
}

export function useBatteryStatus() {
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus>({
    level: null,
    charging: null,
    chargingTime: null,
    dischargingTime: null,
    supported: false,
  })

  useEffect(() => {
    if ("getBattery" in navigator) {
      ;(navigator as any).getBattery().then((battery: any) => {
        const updateBatteryInfo = () => {
          setBatteryStatus({
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
            supported: true,
          })
        }

        updateBatteryInfo()

        battery.addEventListener("chargingchange", updateBatteryInfo)
        battery.addEventListener("levelchange", updateBatteryInfo)
        battery.addEventListener("chargingtimechange", updateBatteryInfo)
        battery.addEventListener("dischargingtimechange", updateBatteryInfo)

        return () => {
          battery.removeEventListener("chargingchange", updateBatteryInfo)
          battery.removeEventListener("levelchange", updateBatteryInfo)
          battery.removeEventListener("chargingtimechange", updateBatteryInfo)
          battery.removeEventListener("dischargingtimechange", updateBatteryInfo)
        }
      })
    }
  }, [])

  return batteryStatus
}
