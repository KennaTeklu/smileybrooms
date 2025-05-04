"use client"

import { Children, cloneElement, isValidElement, type ReactNode } from "react"
import { InteractivePhoneNumber } from "@/components/interactive-phone-number"

// Regular expression to match phone numbers in various formats
const PHONE_REGEX = /(\+?1[-\s.]?)?($$?\d{3}$$?[-\s.]?)\d{3}[-\s.]\d{4}/g

interface PhoneNumberConverterProps {
  children: ReactNode
}

/**
 * A component that recursively scans its children for text nodes containing
 * phone numbers and replaces them with interactive phone number components
 */
export function PhoneNumberConverter({ children }: PhoneNumberConverterProps) {
  const processNode = (node: ReactNode): ReactNode => {
    // If the node is a string, check for phone numbers
    if (typeof node === "string") {
      if (!PHONE_REGEX.test(node)) return node

      // Reset the regex state
      PHONE_REGEX.lastIndex = 0

      // Split by phone numbers and create an array of text and components
      const parts: ReactNode[] = []
      let lastIndex = 0
      let match: RegExpExecArray | null

      while ((match = PHONE_REGEX.exec(node)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push(node.substring(lastIndex, match.index))
        }

        // Add the interactive phone number component
        parts.push(
          <InteractivePhoneNumber
            key={`phone-${match.index}`}
            phoneNumber={match[0]}
            variant="link"
            showIcon={false}
          />,
        )

        lastIndex = PHONE_REGEX.lastIndex
      }

      // Add any remaining text
      if (lastIndex < node.length) {
        parts.push(node.substring(lastIndex))
      }

      return parts
    }

    // If the node is a valid React element, process its children
    if (isValidElement(node)) {
      // Skip processing for certain components
      const skipProcessing = [InteractivePhoneNumber, "input", "textarea", "code", "pre"]

      const nodeType = (node.type as any)?.displayName || node.type

      if (skipProcessing.includes(nodeType as any)) {
        return node
      }

      // Process children recursively
      const children = Children.map(node.props.children, processNode)

      if (children !== node.props.children) {
        return cloneElement(node, { ...node.props, children })
      }

      return node
    }

    // For arrays, process each item
    if (Array.isArray(node)) {
      return Children.map(node, processNode)
    }

    return node
  }

  return <>{processNode(children)}</>
}
