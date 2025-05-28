"use client"

import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"
import { ShoppingCart } from 'lucide-react'
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface StickyCartButtonProps {
  className?: string
  visible?: boolean
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Define the component
const StickyCartButton = ({ className, visible = true }: StickyCartButtonProps) => {
  const { cart } = useCart()
  const router = useRouter()
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    setShowButton(visible && cart.totalPrice > 0)
  }, [visible, cart.totalPrice])

  const handleViewCart = () => {
    router.push("/cart")
  }

  return null
}

export default StickyCartButton
