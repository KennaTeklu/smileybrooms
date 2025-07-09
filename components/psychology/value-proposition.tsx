"use client"
export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Clock, Shield, Zap, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ValuePropositionProps {
  totalPrice?: number
  timeEstimate?: number
  className?: string
}

export function ValueProposition({ totalPrice = 0, timeEstimate = 3, className }: ValuePropositionProps) {
  const [savings, setSavings] = useState(0)
  const [timeValue, setTimeValue] = useState(0)

  useEffect(() => {
    // Calculate value proposition
    const hourlyRate = 25 // Average hourly rate for cleaning
    const timeSaved = timeEstimate * 2 // Assume customer would take 2x longer
    const calculatedTimeValue = timeSaved * hourlyRate
    const calculatedSavings = calculatedTimeValue - totalPrice

    setSavings(calculatedSavings)
    setTimeValue(calculatedTimeValue)
  }, [totalPrice, timeEstimate])

  const valueProps = [
    {
      icon: Clock,
      title: "Time Freedom",
      value: `${timeEstimate * 2} hours`,
      description: "Back to your weekend",
      color: "blue",
    },
    {
      icon: DollarSign,
      title: "Value Delivered",
      value: savings > 0 ? `$${savings.toFixed(0)} saved` : `$${timeValue.toFixed(0)} value`,
      description: "vs. doing it yourself",
      color: "green",
    },
    {
      icon: Shield,
      title: "Peace of Mind",
      value: "100% guaranteed",
      description: "Insured & bonded",
      color: "purple",
    },
    {
      icon: Zap,
      title: "Professional Results",
      value: "Deep clean",
      description: "Equipment you don't own",
      color: "orange",
    },
  ]

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Your Investment Breakdown</h3>
        <p className="text-gray-600 dark:text-gray-400">See the real value you're getting</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {valueProps.map((prop, index) => {
          const Icon = prop.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-4 text-center">
                  <div
                    className={`inline-flex p-3 rounded-full bg-${prop.color}-100 dark:bg-${prop.color}-900/20 mb-3`}
                  >
                    <Icon className={`h-6 w-6 text-${prop.color}-600`} />
                  </div>
                  <h4 className="font-semibold mb-1">{prop.title}</h4>
                  <div className={`text-lg font-bold text-${prop.color}-600 mb-1`}>{prop.value}</div>
                  <p className="text-sm text-gray-500">{prop.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {totalPrice > 0 && (
        <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h4 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">Smart Investment</h4>
            <p className="text-green-700 dark:text-green-300 mb-4">
              You're getting ${timeValue.toFixed(0)} worth of value for just ${totalPrice.toFixed(0)}
            </p>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {savings > 0
                ? `$${savings.toFixed(0)} savings`
                : `${((timeValue / totalPrice - 1) * 100).toFixed(0)}% value`}
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
