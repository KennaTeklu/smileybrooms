"use client"

import React from "react"

import { useState, useEffect, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { VolumeIcon as VolumeUp, Volume2, VolumeX, Type, Maximize2, Minimize2, Settings } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
import { ScrollAwareWrapper } from "@/components/scroll-aware-wrapper"

interface AccessibilityToolbarProps {
  className?: string
}

const AccessibilityToolbar = memo(function AccessibilityToolbar({ className }: AccessibilityToolbarProps) {
  const [isReading, setIsReading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [fontSize, setFontSize] = useState(1)
  const [showSubtitles, setShowSubtitles] = useState(false)
  const [subtitle, setSubtitle] = useState("")
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [readingSpeed, setReadingSpeed] = useState(0.9)
  const [readingPitch, setReadingPitch] = useState(1)
  const [volume, setVolume] = useState(1)
  const [prevVolume, setPrevVolume] = useState(1)
  const [highContrast, setHighContrast] = useState(false)
  const { theme, setTheme } = useTheme()

  // Memoized scroll config to prevent re-renders
  const scrollConfig = React.useMemo(
    () => ({
      defaultPosition: "center" as const,
      scrollPosition: "bottom" as const,
      offset: { bottom: 100, left: 20 },
    }),
    [],
  )

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance()
      u.rate = readingSpeed
      u.pitch = readingPitch
      u.volume = volume
      setUtterance(u)

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

      if (volume === 0 && isReading) {
        window.speechSynthesis.pause()
        setIsMuted(true)
      } else if (volume > 0 && isMuted && isReading) {
        window.speechSynthesis.resume()
        setIsMuted(false)
      }
    }
  }, [volume, utterance, isReading, isMuted])

  const readPage = useCallback(() => {
    if (!utterance || !window.speechSynthesis) return

    if (isReading) {
      window.speechSynthesis.cancel()
      setIsReading(false)
      setSubtitle("")
      return
    }

    const textContent = document.body.innerText
    utterance.text = textContent
    utterance.rate = readingSpeed
    utterance.pitch = readingPitch
    utterance.volume = volume

    window.speechSynthesis.speak(utterance)
  }, [utterance, isReading, readingSpeed, readingPitch, volume])

  const toggleMute = useCallback(() => {
    if (!utterance) return

    if (isMuted) {
      setVolume(prevVolume)
      utterance.volume = prevVolume
      if (isReading) {
        window.speechSynthesis.resume()
      }
    } else {
      setPrevVolume(volume)
      setVolume(0)
      utterance.volume = 0
      if (isReading) {
        window.speechSynthesis.pause()
      }
    }

    setIsMuted(!isMuted)
  }, [utterance, isMuted, prevVolume, volume, isReading])

  const handleVolumeChange = useCallback(
    (value: number[]) => {
      const newVolume = value[0]

      if (newVolume === 0) {
        if (!isMuted) {
          setPrevVolume(volume)
          setIsMuted(true)
          if (isReading) {
            window.speechSynthesis.pause()
          }
        }
      } else {
        if (isMuted) {
          setIsMuted(false)
          if (isReading) {
            window.speechSynthesis.resume()
          }
        }
      }

      setVolume(newVolume)
      if (utterance) {
        utterance.volume = newVolume
      }
    },
    [isMuted, volume, isReading, utterance],
  )

  const increaseFontSize = useCallback(() => {
    if (fontSize < 1.5) {
      setFontSize((prev) => Math.min(prev + 0.1, 1.5))
    }
  }, [fontSize])

  const decreaseFontSize = useCallback(() => {
    if (fontSize > 0.8) {
      setFontSize((prev) => Math.max(prev - 0.1, 0.8))
    }
  }, [fontSize])

  const handleReadingSpeedChange = useCallback(
    (value: number[]) => {
      const newSpeed = value[0]
      setReadingSpeed(newSpeed)
      if (utterance) {
        utterance.rate = newSpeed
      }
    },
    [utterance],
  )

  const handlePitchChange = useCallback(
    (value: number[]) => {
      const newPitch = value[0]
      setReadingPitch(newPitch)
      if (utterance) {
        utterance.pitch = newPitch
      }
    },
    [utterance],
  )

  return (
    <>
      <ScrollAwareWrapper side="left" className={className} config={scrollConfig}>
        <TooltipProvider>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex flex-col gap-2">
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Accessibility Settings</DrawerTitle>
                    <DrawerDescription>
                      Customize your experience to make this site more accessible for your needs.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Text Size</h3>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={decreaseFontSize}>
                          <Minimize2 className="h-4 w-4" />
                        </Button>
                        <Slider
                          value={[fontSize * 100]}
                          min={80}
                          max={150}
                          step={5}
                          onValueChange={(value) => setFontSize(value[0] / 100)}
                          className="flex-1"
                        />
                        <Button variant="outline" size="icon" onClick={increaseFontSize}>
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Current: {Math.round(fontSize * 100)}%</p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Volume</h3>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={toggleMute}>
                          {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        <Slider
                          value={[volume]}
                          min={0}
                          max={1}
                          step={0.05}
                          onValueChange={handleVolumeChange}
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Volume: {Math.round(volume * 100)}%</p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Reading Speed</h3>
                      <Slider
                        value={[readingSpeed]}
                        min={0.5}
                        max={2}
                        step={0.1}
                        onValueChange={handleReadingSpeedChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        {readingSpeed < 1 ? "Slower" : readingSpeed > 1 ? "Faster" : "Normal"} (
                        {readingSpeed.toFixed(1)}x)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Voice Pitch</h3>
                      <Slider value={[readingPitch]} min={0.5} max={2} step={0.1} onValueChange={handlePitchChange} />
                      <p className="text-xs text-muted-foreground">
                        {readingPitch < 1 ? "Lower" : readingPitch > 1 ? "Higher" : "Normal"} ({readingPitch.toFixed(1)}
                        )
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-subtitles">Show Subtitles</Label>
                        <p className="text-xs text-muted-foreground">Display text being read aloud</p>
                      </div>
                      <Switch id="show-subtitles" checked={showSubtitles} onCheckedChange={setShowSubtitles} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="high-contrast">High Contrast</Label>
                        <p className="text-xs text-muted-foreground">Increase text and background contrast</p>
                      </div>
                      <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
                      </div>
                      <Switch
                        id="dark-mode"
                        checked={theme === "dark"}
                        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                      />
                    </div>
                  </div>
                  <DrawerFooter>
                    <Button onClick={() => setIsDrawerOpen(false)}>Save Changes</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={readPage}
                  className={isReading ? "bg-primary text-primary-foreground" : ""}
                >
                  {isReading ? <Volume2 className="h-4 w-4" /> : <VolumeUp className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{isReading ? "Stop Reading" : "Read Page Aloud"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={toggleMute} disabled={!isReading}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{isMuted ? "Unmute" : "Mute"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={showSubtitles ? "bg-primary text-primary-foreground" : ""}
                >
                  <Type className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{showSubtitles ? "Hide Subtitles" : "Show Subtitles"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={increaseFontSize}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Increase Font Size</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={decreaseFontSize}>
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Decrease Font Size</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </ScrollAwareWrapper>

      {/* Subtitle display */}
      {showSubtitles && isReading && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-lg text-lg max-w-2xl text-center z-50">
          {subtitle || "..."}
        </div>
      )}
    </>
  )
})

export default AccessibilityToolbar
