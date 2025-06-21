"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface CollapsibleChatbotPanelProps {
  chatbotUrl: string
  initialHeight?: string
  initialWidth?: string
}

const CollapsibleChatbotPanel: React.FC<CollapsibleChatbotPanelProps> = ({
  chatbotUrl,
  initialHeight = "600px",
  initialWidth = "400px",
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [panelHeight, setPanelHeight] = useState(initialHeight)
  const [panelWidth, setPanelWidth] = useState(initialWidth)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (isCollapsed) {
      setPanelHeight("50px") // Adjust as needed for collapsed state
      setPanelWidth("300px") // Adjust as needed for collapsed state
    } else {
      setPanelHeight(initialHeight)
      setPanelWidth(initialWidth)
    }
  }, [isCollapsed, initialHeight, initialWidth])

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
      <div
        style={{
          width: panelWidth,
          height: panelHeight,
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
          transition: "height 0.3s ease, width 0.3s ease",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {!isCollapsed && (
          <iframe
            ref={iframeRef}
            src={chatbotUrl}
            title="Chatbot"
            width="100%"
            height="100%"
            style={{ border: "none" }}
            allow="microphone;"
            allowtransparency="true"
          />
        )}
        <button
          onClick={toggleCollapse}
          style={{
            position: "absolute",
            bottom: "0px",
            right: "0px",
            padding: "8px 12px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "0 8px 0 0",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {isCollapsed ? "Open Chat" : "Close Chat"}
        </button>
      </div>
    </div>
  )
}

export default CollapsibleChatbotPanel
export { CollapsibleChatbotPanel }
