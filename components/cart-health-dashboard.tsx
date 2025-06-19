/* Don't modify beyond what is requested ever. */
"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { getCartHealthReport, type CartHealthReport } from "@/lib/cart-health"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, RefreshCw, AlertTriangle, Info } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function CartHealthDashboard() {
  const { cart } = useCart()
  const [healthReport, setHealthReport] = useState<CartHealthReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (cart.items.length > 0) {
      const report = getCartHealthReport(cart.items)
      setHealthReport(report)
    } else {
      setHealthReport(null)
    }
    setLoading(false)
  }, [cart.items])

  const refreshReport = () => {
    setLoading(true)
    // Remove cached report to force regeneration
    localStorage.removeItem("cart-health-report")
    localStorage.removeItem("cart-health-timestamp")

    setTimeout(() => {
      const report = getCartHealthReport(cart.items)
      setHealthReport(report)
      setLoading(false)
    }, 500)
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Cart Health</CardTitle>
          <CardDescription>Analyzing your cart...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!healthReport || cart.items.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Cart Health</CardTitle>
          <CardDescription>Add items to your cart to see health metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Info className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Your cart is empty. Add items to analyze cart health.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusIcon = (status: "healthy" | "warning" | "critical") => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusColor = (status: "healthy" | "warning" | "critical") => {
    switch (status) {
      case "healthy":
        return "bg-green-500"
      case "warning":
        return "bg-amber-500"
      case "critical":
        return "bg-red-500"
    }
  }

  const getStatusBadge = (status: "healthy" | "warning" | "critical") => {
    switch (status) {
      case "healthy":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Healthy
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Warning
          </Badge>
        )
      case "critical":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Critical
          </Badge>
        )
    }
  }

  const lastUpdatedFormatted = healthReport.lastUpdated
    ? formatDistanceToNow(new Date(healthReport.lastUpdated), { addSuffix: true })
    : "just now"

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Cart Health</CardTitle>
            <CardDescription>Analysis and optimization suggestions</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={refreshReport} title="Refresh report">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Health Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(healthReport.overallHealth)}
              <span className="font-medium">Overall Health</span>
            </div>
            <span className="font-bold">{healthReport.score}%</span>
          </div>
          <Progress value={healthReport.score} className="h-2" />
        </div>

        {/* Health Metrics */}
        <div className="space-y-3 mt-4">
          <h4 className="text-sm font-medium">Health Metrics</h4>
          {healthReport.metrics.map((metric) => (
            <div key={metric.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon(metric.status)}
                  <span className="font-medium">{metric.name}</span>
                </div>
                {getStatusBadge(metric.status)}
              </div>
              <p className="text-xs text-muted-foreground mb-2">{metric.description}</p>
              {metric.suggestion && (
                <div className="text-xs bg-muted p-2 rounded">
                  <span className="font-medium">Suggestion:</span> {metric.suggestion}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Suggestions */}
        {healthReport.suggestions.length > 0 && (
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium">Optimization Suggestions</h4>
            <ul className="space-y-1">
              {healthReport.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">Last updated: {lastUpdatedFormatted}</CardFooter>
    </Card>
  )
}
