"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  Moon,
  Sun,
  Search,
  BookmarkPlus,
  BookmarkCheck,
  Volume2,
  VolumeX,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  Download,
  Clock,
  Eye,
} from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface MobileOptimizedTermsModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  onAccept?: () => void
  acceptLabel?: string
  cancelLabel?: string
}

export function MobileOptimizedTermsModal({
  isOpen,
  onClose,
  title,
  content,
  onAccept,
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "max-w-4xl max-h-[90vh] flex flex-col",
          darkMode ? "bg-gray-900 text-white" : "bg-white",
          highContrast ? "contrast-high" : "",
          isZoomed ? "scale-110" : "",
        )}
      >
        <DialogHeader className="flex flex-row items-center justify-between sticky top-0 z-10 bg-inherit pb-2 border-b">
          <div className="flex flex-col">
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
            {/* Strategy 7: Reading time indicator */}
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Clock className="h-4 w-4 mr-1" />
              <span>{estimatedReadingTime} min read</span>

              {/* Strategy 18: Reading progress */}
              <Progress value={readProgress} className="h-2 w-20 ml-2" />
            </div>
          </div>

          {/* Strategy 3: Mobile-friendly controls */}
          <div className="flex items-center space-x-2">
            {/* Strategy 13: Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Strategy 14: Zoom toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsZoomed(!isZoomed)}
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              {isZoomed ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>

            {/* Strategy 20: Offline reading */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOfflineAvailable(!isOfflineAvailable)}
              aria-label={isOfflineAvailable ? "Saved offline" : "Save for offline"}
              className={isOfflineAvailable ? "text-green-500" : ""}
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Strategy 17: Search bar */}
        <div className="flex items-center space-x-2 my-2 px-1">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search terms..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="bg-muted p-2 rounded-md mb-2">
            <p className="text-sm font-medium">
              Search Results ({searchResults.reduce((acc, curr) => acc + curr.matches, 0)} matches)
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {searchResults.map((result) => (
                <Badge
                  key={result.id}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setActiveSection(result.id)}
                >
                  {sections.find((s) => s.id === result.id)?.title} ({result.matches})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Strategy 19: Toggle between TOC and content views */}
        <Tabs defaultValue={showTableOfContents ? "toc" : "content"} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="toc" onClick={() => setShowTableOfContents(true)}>
              Table of Contents
            </TabsTrigger>
            <TabsTrigger value="content" onClick={() => setShowTableOfContents(false)}>
              Full Content
            </TabsTrigger>
          </TabsList>

          {/* Strategy 19: Interactive table of contents */}
          <TabsContent value="toc" className="flex-1 overflow-hidden">
            <ScrollArea className="h-[50vh]">
              <div className="space-y-2 p-4">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className={cn(
                      "p-3 rounded-md cursor-pointer transition-colors",
                      activeSection === section.id ? "bg-primary/10" : "hover:bg-muted",
                      bookmarks.includes(section.id) ? "border-l-4 border-primary" : "",
                    )}
                    onClick={() => {
                      setActiveSection(section.id)
                      setCurrentSectionIndex(index)
                      setShowTableOfContents(false)
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{section.title}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleBookmark(section.id)
                        }}
                        aria-label={bookmarks.includes(section.id) ? "Remove bookmark" : "Add bookmark"}
                      >
                        {bookmarks.includes(section.id) ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <BookmarkPlus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {section.content.substring(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Strategy 1 & 2: Progressive disclosure with collapsible sections */}
          <TabsContent value="content" className="flex-1 overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Strategy 10: Sticky navigation for sections */}
              <div className="bg-muted p-2 flex items-center space-x-2 overflow-x-auto scrollbar-hide">
                {sections.map((section, index) => (
                  <Badge
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "outline"}
                    className="cursor-pointer whitespace-nowrap"
                    onClick={() => {
                      setActiveSection(section.id)
                      setCurrentSectionIndex(index)
                    }}
                  >
                    {section.title}
                  </Badge>
                ))}
              </div>

              {/* Strategy 9: Mobile-optimized scrolling */}
              <ScrollArea
                className="flex-1"
                onScroll={(e) => {
                  // Update reading progress based on scroll position
                  const target = e.currentTarget
                  const scrollPercentage = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100
                  setReadProgress(Math.min(scrollPercentage, 100))
                }}
              >
                <div className={touchFriendlyClass}>
                  {/* Strategy 11: Gesture navigation controls */}
                  <div className="flex justify-between items-center mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSwipe("right")}
                      disabled={currentSectionIndex === 0}
                      className="flex items-center"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSwipe("left")}
                      disabled={currentSectionIndex === sections.length - 1}
                      className="flex items-center"
                    >
                      Next <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  {/* Current section content */}
                  <div className={cn("rounded-lg p-4", darkMode ? "bg-gray-800" : "bg-gray-50")}>
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-bold">{sections[currentSectionIndex].title}</h2>

                      <div className="flex items-center space-x-2">
                        {/* Strategy 6: Text-to-speech button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSpeech(sections[currentSectionIndex].content)}
                          aria-label={isSpeaking ? "Stop speaking" : "Read aloud"}
                        >
                          {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </Button>

                        {/* Strategy 16: Bookmark button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleBookmark(sections[currentSectionIndex].id)}
                          aria-label={
                            bookmarks.includes(sections[currentSectionIndex].id) ? "Remove bookmark" : "Add bookmark"
                          }
                        >
                          {bookmarks.includes(sections[currentSectionIndex].id) ? (
                            <BookmarkCheck className="h-5 w-5 text-primary" />
                          ) : (
                            <BookmarkPlus className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Strategy 8: Simplified language toggle */}
                    <div className="flex items-center space-x-2 mb-4">
                      <Switch id="simple-language" checked={simpleLanguage} onCheckedChange={setSimpleLanguage} />
                      <Label htmlFor="simple-language">Simplified language</Label>
                    </div>

                    {/* Strategy 4: Font size control */}
                    <div className="flex items-center space-x-2 mb-4">
                      <Label htmlFor="font-size" className="min-w-[80px]">
                        Font size
                      </Label>
                      <Slider
                        id="font-size"
                        min={12}
                        max={24}
                        step={1}
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                        className="w-[120px]"
                      />
                      <span className="text-sm">{fontSize}px</span>
                    </div>

                    {/* Strategy 5: High contrast toggle */}
                    <div className="flex items-center space-x-2 mb-4">
                      <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
                      <Label htmlFor="high-contrast">High contrast</Label>
                    </div>

                    {/* Content with applied accessibility settings */}
                    <div
                      className={cn("mt-4 whitespace-pre-wrap", highContrast ? "text-black bg-white" : "")}
                      style={{
                        fontSize: `${fontSize}px`,
                        lineHeight: fontSize > 18 ? 1.8 : 1.5,
                      }}
                    >
                      {getSimplifiedContent(sections[currentSectionIndex].content)}
                    </div>
                  </div>

                  {/* Strategy 18: Section completion tracking */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Section {currentSectionIndex + 1} of {sections.length}
                      </span>
                    </div>
                    <Checkbox
                      id={`read-${sections[currentSectionIndex].id}`}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 pt-2 border-t">
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button onClick={onAccept}>{acceptLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
