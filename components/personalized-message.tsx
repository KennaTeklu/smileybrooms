"use client"

import { useUserSegment } from "@/hooks/use-user-segment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function PersonalizedMessage() {
  const userSegment = useUserSegment()

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  let title = ""
  let description = ""
  let bgColor = "bg-blue-50 dark:bg-blue-950"
  let textColor = "text-blue-800 dark:text-blue-200"

  switch (userSegment) {
    case "new":
      title = "Welcome, New User!"
      description = "We're thrilled to have you here. Explore our services and get started with a free quote today!"
      bgColor = "bg-green-50 dark:bg-green-950"
      textColor = "text-green-800 dark:text-green-200"
      break
    case "returning":
      title = "Welcome Back!"
      description = "It's great to see you again. Check out our latest offers or manage your existing bookings."
      bgColor = "bg-purple-50 dark:bg-purple-950"
      textColor = "text-purple-800 dark:text-purple-200"
      break
    case "unknown":
    default:
      title = "Discover Our Services"
      description = "Personalizing your experience... please wait a moment."
      bgColor = "bg-gray-50 dark:bg-gray-800"
      textColor = "text-gray-600 dark:text-gray-400"
      break
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className={`rounded-lg p-6 shadow-md ${bgColor} ${textColor}`}
        initial="hidden"
        animate="visible"
        variants={messageVariants}
      >
        <Card className={`border-none shadow-none ${bgColor}`}>
          <CardHeader>
            <CardTitle className={`text-2xl font-bold ${textColor}`}>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-lg ${textColor}`}>{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
