"use client"

import React from "react"

import { useState, useEffect, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { VolumeIcon as VolumeUp, Volume2, VolumeX, Maximize2, Minimize2, Settings, Share2 } from "lucide-react"
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
  const [showSharePanel, setShowSharePanel] = useState(false)
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

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          url: window.location.href,
        })
        .catch((error) => {
          console.log("Error sharing:", error)
          // Fallback to clipboard
          navigator.clipboard.writeText(window.location.href)
        })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
    setShowSharePanel(false)
  }, [])

  return (
    <>
      <ScrollAwareWrapper side="left" className={className} config={scrollConfig}>
        <TooltipProvider>
          <div className="flex flex-col gap-2">
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={readPage}>
                {isReading ? <VolumeX className="h-5 w-5" /> : <VolumeUp className="h-5 w-5" />}
                <span className="sr-only">{isReading ? "Stop Read Aloud" : "Read Aloud"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{isReading ? "Stop Read Aloud" : "Read Aloud"}</TooltipContent>

            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : volume > 0.5 ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
                <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{isMuted ? "Unmute" : "Mute"}</TooltipContent>

            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={increaseFontSize}>
                <Maximize2 className="h-5 w-5" />
                <span className="sr-only">Increase Font Size</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Increase Font Size</TooltipContent>

            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={decreaseFontSize}>
                <Minimize2 className="h-5 w-5" />
                <span className="sr-only">Decrease Font Size</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Decrease Font Size</TooltipContent>

            <TooltipTrigger asChild>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DrawerTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>

            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setShowSharePanel(true)}>
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Share</TooltipContent>
          </div>
        </TooltipProvider>
      </ScrollAwareWrapper>

      <div className="fixed bottom-0 left-0 w-full bg-background/50 backdrop-blur-md p-4 text-center text-sm text-muted-foreground">
        {subtitle}
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Accessibility Settings</DrawerTitle>
            <DrawerDescription>Customize the accessibility features to fit your needs.</DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="font-size" className="text-right">
                Font Size
              </Label>
              <Slider
                id="font-size"
                defaultValue={[fontSize]}
                min={0.8}
                max={1.5}
                step={0.1}
                onValueChange={(value) => setFontSize(value[0])}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reading-speed" className="text-right">
                Reading Speed
              </Label>
              <Slider
                id="reading-speed"
                defaultValue={[readingSpeed]}
                min={0.5}
                max={1.5}
                step={0.1}
                onValueChange={handleReadingSpeedChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reading-pitch" className="text-right">
                Reading Pitch
              </Label>
              <Slider
                id="reading-pitch"
                defaultValue={[readingPitch]}
                min={0.5}
                max={1.5}
                step={0.1}
                onValueChange={handlePitchChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="volume" className="text-right">
                Volume
              </Label>
              <Slider
                id="volume"
                defaultValue={[volume]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="col-span-3"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="show-subtitles" checked={showSubtitles} onCheckedChange={setShowSubtitles} />
              <Label htmlFor="show-subtitles">Show Subtitles</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
              <Label htmlFor="high-contrast">High Contrast</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="theme">Theme</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTheme(theme === "light" ? "dark" : "light")
                }}
              >
                {theme === "light" ? "Dark" : "Light"}
              </Button>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {showSharePanel && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 backdrop-blur-sm">
          <div className="flex items-center justify-center min-h-screen">
            <div className="relative w-full max-w-md p-6 bg-card rounded-xl shadow-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Share this page</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Share this page with your friends, family, or colleagues.
              </p>
              <div className="flex justify-end mt-6">
                <Button variant="ghost" onClick={() => setShowSharePanel(false)}>
                  Cancel
                </Button>
                <Button onClick={handleShare}>Share</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

export default AccessibilityToolbar
