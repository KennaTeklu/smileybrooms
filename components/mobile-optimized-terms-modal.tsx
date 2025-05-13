"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Markdown } from "react-markdown/lib/react-markdown"

interface MobileOptimizedTermsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  title: string
  content: string
  acceptLabel?: string
  cancelLabel?: string
}

export function MobileOptimizedTermsModal({
  isOpen,
  onClose,
  onAccept,
  title,
  content,
  acceptLabel = "Accept",
  cancelLabel = "Cancel",
}: MobileOptimizedTermsModalProps) {
  // Parse markdown content into sections
  const parseSections = () => {
    const lines = content.split("\n")
    const sections = []
    let currentSection = { id: "", title: "", content: "" }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Check for section headers (## in markdown)
      if (line.startsWith("## ")) {
        // Save previous section if it exists
        if (currentSection.id) {
          sections.push({ ...currentSection })
        }

        const title = line.replace("## ", "")
        currentSection = {
          id: title.toLowerCase().replace(/[^\w]+/g, "-"),
          title,
          content: line + "\n",
        }
      } else if (currentSection.id) {
        // Add line to current section
        currentSection.content += line + "\n"
      } else {
        // Handle content before first section (introduction)
        if (!currentSection.id) {
          currentSection = {
            id: "introduction",
            title: "Introduction",
            content: (currentSection.content || "") + line + "\n",
          }
        }
      }
    }

    // Add the last section
    if (currentSection.id) {
      sections.push(currentSection)
    }

    return sections.length > 0 ? sections : [{ id: "full-content", title: "Terms and Conditions", content }]
  }

  const sectionsRef = useRef(parseSections())
  const sections = sectionsRef.current

  // Strategy 4: Font size controls
  const [fontSize, setFontSize] = useState(16)

  // Strategy 5: High contrast mode
  const [highContrast, setHighContrast] = useState(false)

  // Strategy 6: Text-to-speech
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)

  // Strategy 8: Simplified language
  const [simpleLanguage, setSimpleLanguage] = useState(false)

  // Strategy 10: Sticky navigation
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "introduction")

  // Strategy 13: Dark mode
  const [darkMode, setDarkMode] = useState(false)

  // Strategy 14: Zoom functionality
  const [isZoomed, setIsZoomed] = useState(false)

  // Strategy 16: Bookmarks
  const [bookmarks, setBookmarks] = useState<string[]>([])

  // Strategy 17: Search functionality
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{ id: string; matches: number }[]>([])

  // Strategy 18: Reading progress
  const [readProgress, setReadProgress] = useState(0)

  // Strategy 19: Table of contents view
  const [showTableOfContents, setShowTableOfContents] = useState(true)

  // Strategy 20: Offline reading
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false)

  // Responsive design
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Strategy 7: Reading time indicator
  const estimatedReadingTime = Math.ceil(content.length / 1000)

  // Strategy 11: Current section for gesture navigation
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)

  // Strategy 3: Touch-friendly UI adjustments for mobile
  const touchFriendlyClass = isMobile ? "p-6 space-y-6" : "p-4 space-y-4"

  // Strategy 12: Orientation handling
  useEffect(() => {
    const handleOrientation = () => {
      // Adjust layout based on orientation
      // This is handled by responsive Tailwind classes
    }

    window.addEventListener("orientationchange", handleOrientation)
    return () => window.removeEventListener("orientationchange", handleOrientation)
  }, [])

  // Strategy 6: Text-to-speech implementation
  useEffect(() => {
    if (typeof window !== "undefined") {
      speechSynthesisRef.current = window.speechSynthesis
    }

    return () => {
      if (speechSynthesisRef.current && isSpeaking) {
        speechSynthesisRef.current.cancel()
      }
    }
  }, [isSpeaking])

  const toggleSpeech = (text: string) => {
    if (!speechSynthesisRef.current) return

    if (isSpeaking) {
      speechSynthesisRef.current.cancel()
      setIsSpeaking(false)
    } else {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      speechSynthesisRef.current.speak(utterance)
      setIsSpeaking(true)

      utterance.onend = () => setIsSpeaking(false)
    }
  }

  // Strategy 17: Search implementation
  useEffect(() => {
    if (searchQuery.length > 2) {
      const results = sections
        .map((section) => {
          const regex = new RegExp(searchQuery, "gi")
          const matches = (section.content.match(regex) || []).length
          return { id: section.id, matches }
        })
        .filter((result) => result.matches > 0)

      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  // Strategy 20: Offline reading implementation
  useEffect(() => {
    const saveForOffline = () => {
      try {
        localStorage.setItem("terms-content", content)
        localStorage.setItem("terms-title", title)
        setIsOfflineAvailable(true)
      } catch (error) {
        console.error("Failed to save content offline", error)
      }
    }

    if (isOfflineAvailable) {
      saveForOffline()
    }
  }, [isOfflineAvailable, content, title])

  // Strategy 11: Gesture navigation
  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left" && currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1)
      setActiveSection(sections[currentSectionIndex + 1].id)
    } else if (direction === "right" && currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1)
      setActiveSection(sections[currentSectionIndex - 1].id)
    }
  }

  // Strategy 16: Bookmark functionality
  const toggleBookmark = (sectionId: string) => {
    if (bookmarks.includes(sectionId)) {
      setBookmarks(bookmarks.filter((id) => id !== sectionId))
    } else {
      setBookmarks([...bookmarks, sectionId])
    }
  }

  // Strategy 8: Simplified language toggle
  const getSimplifiedContent = (text: string) => {
    if (!simpleLanguage) return text

    // This is a simplified example - in a real app, you'd use a more sophisticated approach
    return text
      .replace(/pursuant to/g, "according to")
      .replace(/hereinafter/g, "from now on")
      .replace(/aforementioned/g, "mentioned above")
      .replace(/notwithstanding/g, "despite")
      .replace(/in accordance with/g, "following")
      .replace(/shall/g, "will")
      .replace(/utilize/g, "use")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Please read the following terms carefully before accepting.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 max-h-[60vh] mt-4 mb-6 pr-4">
          <div className="prose dark:prose-invert prose-sm">
            <Markdown>{content}</Markdown>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button onClick={onAccept}>{acceptLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
