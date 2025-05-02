"use client"

import { useState, useEffect } from "react"
import { getServiceCount, getServiceHistory, getRemainingServices } from "@/lib/service-cookies"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export function ServiceCounter() {
  const [serviceCount, setServiceCount] = useState(0)
  const [remainingServices, setRemainingServices] = useState(0)
  const [serviceHistory, setServiceHistory] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setServiceCount(getServiceCount())
    setRemainingServices(getRemainingServices())
    setServiceHistory(getServiceHistory())

    // Update every minute in case of changes
    const interval = setInterval(() => {
      setServiceCount(getServiceCount())
      setRemainingServices(getRemainingServices())
      setServiceHistory(getServiceHistory())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-sm font-medium">
          <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center">
            {serviceCount}
          </span>
          <span className="hidden sm:inline">Services</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-medium">Your Cleaning Services</h3>
          <p className="text-sm text-muted-foreground mt-1">You have {remainingServices} upcoming services</p>
        </div>
        <div className="max-h-80 overflow-auto">
          {serviceHistory.length > 0 ? (
            <div className="divide-y">
              {serviceHistory.map((service, index) => (
                <div key={index} className="p-4 flex items-start space-x-3">
                  <div
                    className={cn(
                      "mt-0.5 rounded-full p-1",
                      service.completed ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600",
                    )}
                  >
                    {service.completed ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{service.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {service.completed ? (
                        <span>Completed on {service.date}</span>
                      ) : (
                        <span>Scheduled for {service.scheduledDate || "TBD"}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <p>No services purchased yet</p>
              <p className="text-sm mt-1">Your cleaning history will appear here</p>
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-muted/50">
          <Button asChild className="w-full" size="sm">
            <a href="/pricing">Book a new service</a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
