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
/* Don't modify beyond what is requested ever. */
"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { VolumeIcon as VolumeUp, Volume2, VolumeX, Type, Maximize2, Minimize2, Settings } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"

interface AccessibilityToolbarProps {
  className?: string
}

export default function AccessibilityToolbar({ className }: AccessibilityToolbarProps) {
  const [isReading, setIsReading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [fontSize, setFontSize] = useState(1)
  const [showSubtitles, setShowSubtitles] = useState(false)
  const [subtitle, setSubtitle] = useState("")
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [readingSpeed, setReadingSpeed] = useState(0.9)
  const [readingPitch, setReadingPitch] = useState(1)
  const [volume, setVolume] = useState(1) // New volume state
  const [prevVolume, setPrevVolume] = useState(1) // To store volume before muting
  const [highContrast, setHighContrast] = useState(false)
  const { theme, setTheme } = useTheme()
  const contentRef = useRef<HTMLDivElement>(null)

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance()
      u.rate = readingSpeed
      u.pitch = readingPitch
      u.volume = volume
      setUtterance(u)

      // Handle speech events
      u.onstart = () => setIsReading(true)
      u.onend = () => {
        setIsReading(false)
        setSubtitle("")
      }
      u.onpause = () => setIsReading(false)
      u.onresume = () => setIsReading(true)
      u.onboundary = (event) => {
        if (event.name === "word" && showSubtitles) {
          const text = u.text.substring(event.charIndex, event.charIndex + event.charLength)
          setSubtitle(text)
        }
      }

      return () => {
        window.speechSynthesis.cancel()
      }
    }
  }, [showSubtitles, readingSpeed, readingPitch, volume])

  // Apply font size to body
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--accessibility-font-scale", fontSize.toString())
    }
  }, [fontSize])

  // Apply high contrast mode
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (highContrast) {
        document.body.classList.add("high-contrast")
      } else {
        document.body.classList.remove("high-contrast")
      }
    }
  }, [highContrast])

  // Update volume whenever it changes
  useEffect(() => {
    if (utterance) {
      utterance.volume = volume

      // If volume is set to 0, pause the speech
      if (volume === 0 && isReading) {
        window.speechSynthesis.pause()
        setIsMuted(true)
      } else if (volume > 0 && isMuted && isReading) {
        // If coming back from volume 0, resume the speech
        window.speechSynthesis.resume()
        setIsMuted(false)
      }
    }
  }, [volume, utterance, isReading, isMuted])

  const readPage = () => {
    if (!utterance || !window.speechSynthesis) return

    // If already reading, stop
    if (isReading) {
      window.speechSynthesis.cancel()
      setIsReading(false)
      setSubtitle("")
      return
    }

    // Get all visible text from the page
    const textContent = document.body.innerText
    utterance.text = textContent
    utterance.rate = readingSpeed
    utterance.pitch = readingPitch
    utterance.volume = volume

    // Start reading
    window.speechSynthesis.speak(utterance)
  }

  const toggleMute = () => {
    if (!utterance) return

    if (isMuted) {
      // Restore previous volume
      setVolume(prevVolume)
      utterance.volume = prevVolume
      if (isReading) {
        window.speechSynthesis.resume()
      }
    } else {
      // Store current volume and mute
      setPrevVolume(volume)
      setVolume(0)
      utterance.volume = 0
      if (isReading) {
        window.speechSynthesis.pause()
      }
    }
    setIsMuted(!isMuted)
  }

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 0.1, 2))
  }

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 0.1, 0.8))
  }

  const resetFontSize = () => {
    setFontSize(1)
  }

  return (
    <>
      <TooltipProvider>
        <div
          className={cn(
            "fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-900 rounded-lg shadow-lg border p-2",
            "transition-all duration-300 ease-in-out",
            isExpanded ? "w-auto" : "w-auto",
            className,
          )}
        >
          <div className="flex items-center gap-2">
            {/* Expand/Collapse Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 w-8"
                  aria-label={isExpanded ? "Collapse toolbar" : "Expand toolbar"}
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isExpanded ? "Collapse" : "Expand"} Toolbar</p>
              </TooltipContent>
            </Tooltip>

            {/* Always visible buttons */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isReading ? "default" : "ghost"}
                  size="icon"
                  onClick={readPage}
                  className="h-8 w-8"
                  aria-label={isReading ? "Stop reading" : "Read page aloud"}
                >
                  {isReading ? <VolumeUp className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isReading ? "Stop Reading" : "Read Page"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Expanded buttons */}
            {isExpanded && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isMuted ? "destructive" : "ghost"}
                      size="icon"
                      onClick={toggleMute}
                      className="h-8 w-8"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <VolumeUp className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isMuted ? "Unmute" : "Mute"}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={increaseFontSize}
                      className="h-8 w-8"
                      aria-label="Increase font size"
                    >
                      <Type className="h-4 w-4" />
                      <span className="text-xs ml-1">+</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Increase Font Size</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={decreaseFontSize}
                      className="h-8 w-8"
                      aria-label="Decrease font size"
                    >
                      <Type className="h-4 w-4" />
                      <span className="text-xs ml-1">-</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Decrease Font Size</p>
                  </TooltipContent>
                </Tooltip>

                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More accessibility options">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>More Options</p>
                      </TooltipContent>
                    </Tooltip>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                      <DrawerHeader>
                        <DrawerTitle>Accessibility Settings</DrawerTitle>
                        <DrawerDescription>Customize your reading and viewing experience</DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4 pb-0 space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="reading-speed">Reading Speed</Label>
                          <Slider
                            id="reading-speed"
                            value={[readingSpeed * 100]}
                            min={50}
                            max={200}
                            step={10}
                            onValueChange={(value) => setReadingSpeed(value[0] / 100)}
                          />
                          <p className="text-xs text-muted-foreground text-right">{Math.round(readingSpeed * 100)}%</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="reading-pitch">Voice Pitch</Label>
                          <Slider
                            id="reading-pitch"
                            value={[readingPitch * 100]}
                            min={50}
                            max={200}
                            step={10}
                            onValueChange={(value) => setReadingPitch(value[0] / 100)}
                          />
                          <p className="text-xs text-muted-foreground text-right">{Math.round(readingPitch * 100)}%</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="volume">Volume</Label>
                          <Slider
                            id="volume"
                            value={[volume * 100]}
                            min={0}
                            max={100}
                            step={5}
                            onValueChange={(value) => setVolume(value[0] / 100)}
                          />
                          <p className="text-xs text-muted-foreground text-right">{Math.round(volume * 100)}%</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="font-size-slider">Font Size</Label>
                          <Slider
                            id="font-size-slider"
                            value={[fontSize * 100]}
                            min={80}
                            max={200}
                            step={10}
                            onValueChange={(value) => setFontSize(value[0] / 100)}
                          />
                          <p className="text-xs text-muted-foreground text-right">{Math.round(fontSize * 100)}%</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="subtitles">Show Subtitles</Label>
                            <p className="text-xs text-muted-foreground">Display words as they're spoken</p>
                          </div>
                          <Switch
                            id="subtitles"
                            checked={showSubtitles}
                            onCheckedChange={setShowSubtitles}
                            aria-label="Toggle subtitles"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="high-contrast">High Contrast</Label>
                            <p className="text-xs text-muted-foreground">Increase text/background contrast</p>
                          </div>
                          <Switch
                            id="high-contrast"
                            checked={highContrast}
                            onCheckedChange={setHighContrast}
                            aria-label="Toggle high contrast mode"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="dark-mode">Dark Mode</Label>
                            <p className="text-xs text-muted-foreground">Switch between light and dark</p>
                          </div>
                          <Switch
                            id="dark-mode"
                            checked={theme === "dark"}
                            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                            aria-label="Toggle dark mode"
                          />
                        </div>
                      </div>
                      <DrawerFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setFontSize(1)
                            setReadingSpeed(0.9)
                            setReadingPitch(1)
                            setVolume(1)
                            setShowSubtitles(false)
                            setHighContrast(false)
                          }}
                        >
                          Reset to Defaults
                        </Button>
                        <DrawerClose asChild>
                          <Button variant="outline">Close</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>
              </>
            )}
          </div>
        </div>
      </TooltipProvider>

      {/* Subtitle overlay */}
      {showSubtitles && subtitle && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg">
          <p className="text-lg font-medium">{subtitle}</p>
        </div>
      )}
    </>
  )
}
