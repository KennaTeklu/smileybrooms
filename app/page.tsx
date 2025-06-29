"use client"

import { useState } from "react"
import Head from "next/head"
import CollapsibleSettingsPanel from "@/components/collapsible-settings-panel"
import CollapsibleSharePanel from "@/components/collapsible-share-panel"
import CollapsibleChatbotPanel from "@/components/collapsible-chatbot-panel"

export default function HomePage() {
  /**
   * We only need to keep track of the Share-panel state so
   * the Chatbot can adjust its own top-offset when Share is open.
   */
  const [sharePanelInfo, setSharePanelInfo] = useState<{
    expanded: boolean
    height: number
  }>({ expanded: false, height: 0 })

  return (
    <>
      {/* Basic meta -- extend as you like */}
      <Head>
        <title>Smiley Brooms – Cleaning made easy</title>
        <meta name="description" content="Premium home & commercial cleaning services with transparent pricing." />
      </Head>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN PAGE CONTENT – substitute with your actual landing components */}
      {/* ------------------------------------------------------------------ */}
      <main className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Smiley Brooms</h1>
        <p className="max-w-xl text-muted-foreground mb-8">
          A sparkling-clean home (or office) is just one click away. Book a professional cleaning team in seconds, enjoy
          transparent pricing and 24×7 support.
        </p>
        {/* You can drop in your existing hero / CTA / feature sections here */}
      </main>

      {/* -------------------------------------------------------------- */}
      {/* FLOATING/SLIDE-IN PANELS                                          */}
      {/* These components include their own collapsed buttons, so        */}
      {/* simply mounting them is enough.                                 */}
      {/* -------------------------------------------------------------- */}
      <CollapsibleSettingsPanel />
      <CollapsibleSharePanel onPanelStateChange={setSharePanelInfo} />
      <CollapsibleChatbotPanel sharePanelInfo={sharePanelInfo} />
    </>
  )
}
