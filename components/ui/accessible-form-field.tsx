import type React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AccessibleFormFieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  description?: string
  className?: string
  children: React.ReactNode
}

export function AccessibleFormField({
  id,
  label,
  required = false,
  error,
  description,
  className,
  children,
}: AccessibleFormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className={cn(error && "text-destructive")}>
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> required</span>}
      </Label>

      {description && (
        <p id={`${id}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {children}

      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive font-medium">
          {error}
        </p>
      )}
    </div>
  )
}
