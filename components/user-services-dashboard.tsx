"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

type ServiceRecord = {
  id: string
  name: string
  date: string
  completed: boolean
  scheduledDate: string
}

export default function UserServicesDashboard() {
  const [serviceCount, setServiceCount] = useState(0)
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Sample data
    const sampleRecords: ServiceRecord[] = [
      { id: "1", name: "Standard Cleaning", date: "2024-03-15", completed: true, scheduledDate: "2024-03-15" },
      { id: "2", name: "Deep Cleaning", date: "2024-04-01", completed: false, scheduledDate: "2024-04-05" },
      { id: "3", name: "Move-Out Cleaning", date: "2024-04-10", completed: false, scheduledDate: "2024-04-12" },
    ]
    setServiceRecords(sampleRecords)
    setServiceCount(sampleRecords.length)
  }, [])

  // Filter services by status
  const upcomingServices = serviceRecords.filter(
    (service) => !service.completed && new Date(service.scheduledDate) > new Date(),
  )
  const completedServices = serviceRecords.filter((service) => service.completed)

  if (!isClient) {
    return null // Prevent SSR issues
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Cleaning Services</CardTitle>
        <CardDescription>
          You have {upcomingServices.length} upcoming {upcomingServices.length === 1 ? "service" : "services"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="pt-4">
            {upcomingServices.length > 0 ? (
              <div className="space-y-4">
                {upcomingServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Scheduled: {service.scheduledDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="text-sm">Upcoming</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No services purchased yet</h3>
                <p className="text-muted-foreground mt-1">Your cleaning history will appear here</p>
                <Button asChild className="mt-4">
                  <Link href="/pricing">Book a new service</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="history" className="pt-4">
            {completedServices.length > 0 ? (
              <div className="space-y-4">
                {completedServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Completed: {service.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm">Completed</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No completed services yet</h3>
                <p className="text-muted-foreground mt-1">Your service history will appear here</p>
                <Button asChild className="mt-4">
                  <Link href="/pricing">Book a new service</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      {serviceRecords.length > 0 && (
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href="/pricing">Book another service</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
