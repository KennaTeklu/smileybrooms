"use client"

import type React from "react"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"
import { PanelToggleButton } from "@/components/panel-toggle-button"
import { usePanelVisibility } from "@/contexts/panel-visibility-context"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { arePanelsVisible } = usePanelVisibility()

  return (
    <>
      {children}
      {arePanelsVisible && (
        <div className="centered-fixed-panels">
          <CollapsibleSettingsPanel />
          <CollapsibleSharePanel />
          <CollapsibleChatbotPanel />
        </div>
      )}
      <PanelToggleButton /> {/* This button is always visible */}
    </>
  )
}
