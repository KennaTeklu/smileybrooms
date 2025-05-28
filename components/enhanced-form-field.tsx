"use client"

import type React from "react"

import { useState, useId, forwardRef, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, AlertCircle, Check } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  description?: string
  error?: string
  hint?: string
  showSuccessState?: boolean
  required?: boolean
  className?: string
  labelClassName?: string
  inputClassName?: string
  errorClassName?: string
  hintClassName?: string
  descriptionClassName?: string
  icon?: React.ReactNode
  endIcon?: React.ReactNode
  onIconClick?: () => void
  onEndIconClick?: () => void
}

const EnhancedFormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      description,
      error,
      hint,
      showSuccessState,
      required,
      className,
      labelClassName,
      inputClassName,
      errorClassName,
      hintClassName,
      descriptionClassName,
      icon,
      endIcon,
      onIconClick,
      onEndIconClick,
      id: propId,
      disabled,
      readOnly,
      ...props
    },
    ref,
  ) => {
    // Generate unique IDs for accessibility
    const uniqueId = useId()
    const id = propId || `form-field-${uniqueId}`
    const descriptionId = `${id}-description`
    const errorId = `${id}-error`

    // Track focus state for enhanced styling
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // Merge refs
    useEffect(() => {
      if (typeof ref === "function") {
        ref(inputRef.current)
      } else if (ref) {
        ref.current = inputRef.current
      }
    }, [ref])

    // Determine input state for styling
    const hasError = !!error
    const isSuccess = !hasError && showSuccessState
    const isDisabled = disabled || readOnly

    // Handle focus events
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    // Handle icon clicks
    const handleIconClick = () => {
      if (onIconClick) {
        onIconClick()
      } else {
        // Focus the input when clicking the icon (unless custom handler provided)
        inputRef.current?.focus()
      }
    }

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex justify-between items-center">
          <Label
            htmlFor={id}
            className={cn(
              "text-sm font-medium flex items-center gap-1",
              hasError && "text-destructive",
              isDisabled && "text-muted-foreground opacity-70",
              labelClassName,
            )}
          >
            {label}
            {required && <span className="text-destructive">*</span>}

            {/* Show tooltip if there's a description */}
            {description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger tabIndex={-1} type="button" asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </Label>

          {/* Optional hint text */}
          {hint && <span className={cn("text-xs text-muted-foreground", hintClassName)}>{hint}</span>}
        </div>

        {/* Input wrapper for icons */}
        <div
          className={cn(
            "relative flex items-center rounded-md",
            isFocused && "ring-2 ring-offset-1 ring-ring ring-offset-background",
            hasError && "ring-2 ring-destructive",
            isSuccess && "ring-2 ring-green-500",
          )}
        >
          {/* Leading icon */}
          {icon && (
            <div
              className={cn("absolute left-3 flex items-center justify-center", onIconClick && "cursor-pointer")}
              onClick={handleIconClick}
              tabIndex={onIconClick ? 0 : -1}
              role={onIconClick ? "button" : undefined}
              aria-label={onIconClick ? `${label} icon action` : undefined}
            >
              {icon}
            </div>
          )}

          {/* Input element */}
          <Input
            id={id}
            ref={inputRef}
            aria-invalid={hasError}
            aria-describedby={
              [description ? descriptionId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined
            }
            className={cn(
              "transition-all duration-200",
              icon && "pl-10",
              (endIcon || isSuccess) && "pr-10",
              hasError && "border-destructive focus-visible:ring-destructive",
              isSuccess && "border-green-500 focus-visible:ring-green-500",
              inputClassName,
            )}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {/* Trailing icon or success indicator */}
          {(endIcon || isSuccess) && (
            <div
              className={cn("absolute right-3 flex items-center justify-center", onEndIconClick && "cursor-pointer")}
              onClick={onEndIconClick}
              tabIndex={onEndIconClick ? 0 : -1}
              role={onEndIconClick ? "button" : undefined}
              aria-label={onEndIconClick ? `${label} end icon action` : undefined}
            >
              {isSuccess ? <Check className="h-4 w-4 text-green-500" /> : endIcon}
            </div>
          )}
        </div>

        {/* Description text */}
        {description && !error && (
          <p id={descriptionId} className={cn("text-xs text-muted-foreground", descriptionClassName)}>
            {description}
          </p>
        )}

        {/* Error message with animation */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              id={errorId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={cn("flex items-start gap-2 text-destructive text-xs mt-1", errorClassName)}>
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  },
)

EnhancedFormField.displayName = "EnhancedFormField"

export { EnhancedFormField }
