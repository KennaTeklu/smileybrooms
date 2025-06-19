"use client"
/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  

import { useState, useEffect } from "react"

export function useBatteryStatus() {
  const [batteryLevel, setBatteryLevel] = useState<number>(1)
  const [isCharging, setIsCharging] = useState<boolean>(false)
  const [chargingTime, setChargingTime] = useState<number>(0)
  const [dischargingTime, setDischargingTime] = useState<number>(Number.POSITIVE_INFINITY)

  useEffect(() => {
    if (typeof window === "undefined") return

    const getBatteryInfo = async () => {
      try {
        const battery = await (navigator as any).getBattery?.()
        if (battery) {
          setBatteryLevel(battery.level)
          setIsCharging(battery.charging)
          setChargingTime(battery.chargingTime)
          setDischargingTime(battery.dischargingTime)

          const updateBatteryInfo = () => {
            setBatteryLevel(battery.level)
            setIsCharging(battery.charging)
            setChargingTime(battery.chargingTime)
            setDischargingTime(battery.dischargingTime)
          }

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
        }
      } catch (error) {
        console.log("Battery API not supported")
      }
    }

    getBatteryInfo()
  }, [])

  return {
    batteryLevel,
    isCharging,
    chargingTime,
    dischargingTime,
  }
}
