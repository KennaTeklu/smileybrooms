import type React from "react"
import { UnifiedChatbot } from "@/components/unified-chatbot"

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <UnifiedChatbot />
    </div>
  )
}

export default ClientLayout
