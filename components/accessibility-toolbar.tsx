"use client"

import React from "react"

import { useState, useEffect, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { VolumeIcon as VolumeUp, Volume2, VolumeX, Type, Maximize2, Minimize2, Settings, Share2 } from "lucide-react"
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
