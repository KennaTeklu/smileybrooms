"use client"

import { Check, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface Feature {
  name: string
  description: string
  web: boolean
  android: boolean
  ios: boolean
  desktop: boolean
}

export default function AppFeaturesComparison() {
  const features: Feature[] = [
    {
      name: "Service Booking",
      description: "Book cleaning services with date and time selection",
      web: true,
      android: true,
      ios: true,
      desktop: true,
    },
    {
      name: "Real-time Tracking",
      description: "Track your cleaner's arrival in real-time",
      web: false,
      android: true,
      ios: true,
      desktop: false,
    },
    {
      name: "Push Notifications",
      description: "Receive alerts about your upcoming services",
      web: false,
      android: true,
      ios: true,
      desktop: true,
    },
    {
      name: "Offline Mode",
      description: "Access your bookings without internet connection",
      web: false,
      android: true,
      ios: true,
      desktop: true,
    },
    {
      name: "Payment Processing",
      description: "Pay for services directly through the platform",
      web: true,
      android: true,
      ios: true,
      desktop: true,
    },
    {
      name: "Service Customization",
      description: "Customize cleaning services to your specific needs",
      web: true,
      android: true,
      ios: true,
      desktop: true,
    },
    {
      name: "Cleaner Preferences",
      description: "Select preferred cleaning professionals",
      web: false,
      android: true,
      ios: true,
      desktop: false,
    },
    {
      name: "Recurring Bookings",
      description: "Set up regular cleaning schedules",
      web: true,
      android: true,
      ios: true,
      desktop: true,
    },
  ]

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Feature</TableHead>
            <TableHead className="text-center">Web</TableHead>
            <TableHead className="text-center">Android</TableHead>
            <TableHead className="text-center">iOS</TableHead>
            <TableHead className="text-center">Desktop</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((feature) => (
            <TableRow key={feature.name}>
              <TableCell className="font-medium">
                <div>
                  <p>{feature.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {feature.web ? (
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                  <X className="h-5 w-5 text-gray-300 dark:text-gray-600 mx-auto" />
                )}
              </TableCell>
              <TableCell className="text-center">
                <div className={cn(feature.android && "text-primary font-medium")}>
                  {feature.android ? (
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  ) : (
                    <X className="h-5 w-5 text-gray-300 dark:text-gray-600 mx-auto" />
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {feature.ios ? (
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                  <X className="h-5 w-5 text-gray-300 dark:text-gray-600 mx-auto" />
                )}
              </TableCell>
              <TableCell className="text-center">
                {feature.desktop ? (
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                  <X className="h-5 w-5 text-gray-300 dark:text-gray-600 mx-auto" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
