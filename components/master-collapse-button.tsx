"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

interface MasterCollapseButtonProps {
  children: React.ReactNode
  title: string
  defaultOpen?: boolean
  onCollapseAll: () => void
}

const MasterCollapseButton = ({ children, title, defaultOpen, onCollapseAll }: MasterCollapseButtonProps) => {
  const [open, setOpen] = useState(defaultOpen || false)

  const handleCollapseAll = () => {
    setOpen(false)
    onCollapseAll()
  }

  // Add keyboard shortcut support
  useKeyboardShortcuts({
    "alt+x": handleCollapseAll,
  })

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between space-x-2">
        <h4 className="text-sm font-semibold">{title}</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <CaretSortIcon className="h-4 w-4 shrink-0 transition-transform duration-200 peer-data-[state=open]:rotate-180" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">{children}</CollapsibleContent>
    </Collapsible>
  )
}

export default MasterCollapseButton
