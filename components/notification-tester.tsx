"use client"

import { Button } from "@/components/ui/button"
import { useDeviceNotifications } from "@/lib/notifications/device-notifications"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"

export function NotificationTester() {
  const { permission, requestPermission, sendNotification, isSupported } = useDeviceNotifications()
  const { toast } = useToast()

  useEffect(() => {
    if (!isSupported) {
      toast({
        title: "Notifications Not Supported",
        description: "Your browser does not support web notifications.",
        variant: "destructive",
      })
    }
  }, [isSupported, toast])

  const handleRequestPermission = async () => {
    const result = await requestPermission()
    if (result === "granted") {
      toast({
        title: "Permission Granted",
        description: "You can now receive notifications.",
      })
    } else {
      toast({
        title: "Permission Denied",
        description: "Notifications will not be shown.",
        variant: "destructive",
      })
    }
  }

  const handleSendNotification = () => {
    if (permission === "granted") {
      sendNotification({
        title: "SmileyBrooms Alert!",
        body: "Your cleaning service is scheduled for tomorrow at 9 AM.",
        icon: "/favicon.png",
        badge: "/favicon.png",
        vibrate: [200, 100, 200, 100, 200],
        tag: "cleaning-reminder",
        requireInteraction: true,
        actions: [
          {
            title: "View Details",
            action: () => {
              console.log("View Details clicked!")
              // In a real app, you'd navigate to a details page
              window.location.href = "/email-summary"
            },
          },
        ],
      })
      toast({
        title: "Notification Sent",
        description: "Check your system notifications.",
      })
    } else {
      toast({
        title: "Permission Required",
        description: "Please grant notification permission first.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg shadow-sm max-w-md mx-auto mt-8">
      <h3 className="text-lg font-semibold">Test Notifications</h3>
      <p className="text-sm text-muted-foreground text-center">
        Current permission status: <span className="font-medium capitalize">{permission}</span>
      </p>
      <div className="flex gap-2">
        <Button onClick={handleRequestPermission} disabled={permission === "granted" || !isSupported}>
          Request Permission
        </Button>
        <Button onClick={handleSendNotification} disabled={permission !== "granted" || !isSupported}>
          Send Test Notification
        </Button>
      </div>
      {!isSupported && (
        <p className="text-xs text-red-500 text-center">
          Web Notifications are not supported in your current browser or environment.
        </p>
      )}
    </div>
  )
}
