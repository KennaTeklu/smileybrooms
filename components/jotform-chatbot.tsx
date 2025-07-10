"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

interface JotFormChatbotProps {
  skipWelcome?: boolean
  maximizable?: boolean
  position?: "left" | "right"
  autoOpen?: boolean
}

/**
 * Embeds the Jotform AI chatbot once per page.
 * – Loads the Jotform script when mounted
 * – Removes the script and any global handlers on unmount / route change
 */
function JotFormChatbot({
  skipWelcome = true,
  maximizable = true,
  position = "right",
  autoOpen = false,
}: JotFormChatbotProps) {
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // ---- cleanup (if user navigated away and back) ------------------------
    if (scriptRef.current && document.head.contains(scriptRef.current)) {
      document.head.removeChild(scriptRef.current)
      scriptRef.current = null
    }
    if (typeof window !== "undefined" && (window as any).AgentInitializer) {
      delete (window as any).AgentInitializer
    }

    // ---- inject the Jotform embed script ----------------------------------
    const script = document.createElement("script")
    script.src =
      "https://cdn.jotfor.ms/agent/embedjs/019727f88b017b95a6ff71f7fdcc58538ab4/embed.js?" +
      `skipWelcome=${skipWelcome ? 1 : 0}&maximizable=${maximizable ? 1 : 0}&autoOpen=${autoOpen ? 1 : 0}`
    script.async = true
    script.defer = true

    script.onload = () => {
      try {
        if ((window as any).AgentInitializer) {
          ;(window as any).AgentInitializer.init({
            agentRenderURL: "https://www.jotform.com/agent/019727f88b017b95a6ff71f7fdcc58538ab4",
            toolId: "JotformAgent-019727f88b017b95a6ff71f7fdcc58538ab4",
            formID: "019727f88b017b95a6ff71f7fdcc58538ab4",
            domain: "https://www.jotform.com/",
            queryParams: [
              `skipWelcome=${skipWelcome ? 1 : 0}`,
              `maximizable=${maximizable ? 1 : 0}`,
              `autoOpen=${autoOpen ? 1 : 0}`,
            ],
            position,
            skipWelcome,
            maximizable,
            autoOpen,
            isDraggable: false,
            isGreeting: "greeting:No",
            buttonColor: "#158ded",
            buttonIconColor: "#FFFFFF",
          })
        }
      } catch (err) {
        console.warn("💬 Jotform chatbot failed to initialise:", err)
      }
    }

    document.head.appendChild(script)
    scriptRef.current = script

    // ---- remove on unmount / route change ---------------------------------
    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current)
        scriptRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, skipWelcome, maximizable, position, autoOpen])

  // This component only injects the bot; it renders nothing.
  return null
}

/* ------------------------------------------------------------------------ */
/* Exports                                                                  */
/* ------------------------------------------------------------------------ */
export default JotFormChatbot
// Alias so that `import { JotformChatbot }` also works (lower-case “f”)
export { JotFormChatbot as JotformChatbot }
