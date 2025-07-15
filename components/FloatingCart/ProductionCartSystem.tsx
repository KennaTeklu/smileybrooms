"use client"

import { ErrorBoundary } from "react-error-boundary"
import { Suspense, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Wifi, WifiOff, Undo2, Redo2, Save, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdvancedCartFeatures } from "@/hooks/useAdvancedCartFeatures"
import { useProductionOptimizations } from "@/hooks/useProductionOptimizations"
import { FloatingCart } from "./index"
import { cn } from "@/lib/utils"

interface ProductionCartSystemProps {
  className?: string
  enableAnalytics?: boolean
  enableOfflineSupport?: boolean
  enableABTesting?: boolean
}

// Error Fallback Component
function CartErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4" />
        <h3 className="font-semibold">Cart Error</h3>
      </div>
      <p className="text-sm mb-3">Something went wrong with the shopping cart.</p>
      <Button onClick={resetErrorBoundary} size="sm" variant="outline">
        Try Again
      </Button>
    </div>
  )
}

// Loading Skeleton
function CartSkeleton() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Skeleton className="h-14 w-14 rounded-full" />
    </div>
  )
}

// Advanced Features Panel
function AdvancedFeaturesPanel({
  features,
  isOffline,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSaveCart,
  recommendations,
}: {
  features: any
  isOffline: boolean
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  onSaveCart: () => void
  recommendations: any[]
}) {
  const [showFeatures, setShowFeatures] = useState(false)

  return (
    <AnimatePresence>
      {showFeatures && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-4 z-40 bg-background border rounded-lg shadow-lg p-4 max-w-sm"
        >
          {/* Connection Status */}
          <div className="flex items-center gap-2 mb-3">
            {isOffline ? <WifiOff className="h-4 w-4 text-destructive" /> : <Wifi className="h-4 w-4 text-green-500" />}
            <span className="text-sm">{isOffline ? "Offline Mode" : "Connected"}</span>
          </div>

          {/* Undo/Redo Controls */}
          <div className="flex gap-2 mb-3">
            <Button size="sm" variant="outline" onClick={onUndo} disabled={!canUndo} className="flex-1">
              <Undo2 className="h-3 w-3 mr-1" />
              Undo
            </Button>
            <Button size="sm" variant="outline" onClick={onRedo} disabled={!canRedo} className="flex-1">
              <Redo2 className="h-3 w-3 mr-1" />
              Redo
            </Button>
          </div>

          {/* Save Cart */}
          <Button size="sm" variant="outline" onClick={onSaveCart} className="w-full mb-3">
            <Save className="h-3 w-3 mr-1" />
            Save Cart
          </Button>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Star className="h-3 w-3" />
                Recommended
              </h4>
              <div className="space-y-1">
                {recommendations.slice(0, 2).map((rec) => (
                  <div key={rec.id} className="text-xs p-2 bg-muted rounded">
                    <div className="font-medium">{rec.name}</div>
                    <div className="text-muted-foreground">${rec.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Toggle Button */}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setShowFeatures(!showFeatures)}
        className="fixed bottom-4 left-4 z-40 h-8 w-8 p-0"
      >
        <motion.div animate={{ rotate: showFeatures ? 45 : 0 }} transition={{ duration: 0.2 }}>
          ⚙️
        </motion.div>
      </Button>
    </AnimatePresence>
  )
}

// Performance Monitor (Development Only)
function PerformanceMonitor({ metrics }: { metrics: any }) {
  if (process.env.NODE_ENV !== "development") return null

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white text-xs p-2 rounded font-mono">
      <div>FPS: {metrics.fps}</div>
      <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>
      <div>Render: {metrics.renderTime.toFixed(1)}ms</div>
      <div>Bundle: {metrics.bundleSize}KB</div>
    </div>
  )
}

export function ProductionCartSystem({
  className,
  enableAnalytics = true,
  enableOfflineSupport = true,
  enableABTesting = true,
}: ProductionCartSystemProps) {
  const advancedFeatures = useAdvancedCartFeatures()
  const productionOpts = useProductionOptimizations()
  const [saveCartName, setSaveCartName] = useState("")

  // Handle save cart
  const handleSaveCart = () => {
    const name = saveCartName || `Cart ${new Date().toLocaleDateString()}`
    advancedFeatures.saveCart(name)
    setSaveCartName("")
  }

  // Track analytics
  useEffect(() => {
    if (enableAnalytics) {
      advancedFeatures.trackInteraction("cart_system_loaded")
    }
  }, [enableAnalytics, advancedFeatures])

  // Show offline notification
  const showOfflineAlert = enableOfflineSupport && advancedFeatures.isOffline

  return (
    <ErrorBoundary
      FallbackComponent={CartErrorFallback}
      onError={productionOpts.handleError}
      onReset={productionOpts.resetError}
    >
      <div className={cn("cart-system-container", className)}>
        {/* Offline Alert */}
        <AnimatePresence>
          {showOfflineAlert && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
            >
              <Alert className="bg-orange-100 border-orange-200">
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                  You're offline. Changes will sync when reconnected.
                  {advancedFeatures.pendingOperations.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {advancedFeatures.pendingOperations.length} pending
                    </Badge>
                  )}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Cart Component */}
        <Suspense fallback={<CartSkeleton />}>
          <FloatingCart />
        </Suspense>

        {/* Advanced Features Panel */}
        <AdvancedFeaturesPanel
          features={advancedFeatures}
          isOffline={advancedFeatures.isOffline}
          onUndo={advancedFeatures.undo}
          onRedo={advancedFeatures.redo}
          canUndo={advancedFeatures.canUndo}
          canRedo={advancedFeatures.canRedo}
          onSaveCart={handleSaveCart}
          recommendations={advancedFeatures.recommendations}
        />

        {/* Performance Monitor (Dev Only) */}
        <PerformanceMonitor metrics={productionOpts.metrics} />

        {/* A/B Testing Indicator (Dev Only) */}
        {process.env.NODE_ENV === "development" && enableABTesting && (
          <div className="fixed bottom-4 left-20 z-40 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            A/B: {localStorage.getItem("ab-test-variant") || "A"}
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
