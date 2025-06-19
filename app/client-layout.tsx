/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
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
