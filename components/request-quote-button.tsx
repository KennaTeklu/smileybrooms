"use client"

import { useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { CustomQuoteDrawer } from "@/components/custom-quote-drawer"
import { ClipboardList } from "lucide-react"

interface RequestQuoteButtonProps extends ButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  showIcon?: boolean
  fullWidth?: boolean
}

export function RequestQuoteButton({
  variant = "default",
  size = "default",
  showIcon = true,
  fullWidth = false,
  className,
  ...props
}: RequestQuoteButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`${fullWidth ? "w-full" : ""} ${className || ""}`}
        onClick={() => setOpen(true)}
        {...props}
      >
        {showIcon && <ClipboardList className="mr-2 h-4 w-4" />}
        Request Custom Quote
      </Button>
      <CustomQuoteDrawer open={open} onOpenChange={setOpen} />
    </>
  )
}
