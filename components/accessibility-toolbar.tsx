/* Don't modify beyond what is requested ever. */
"use client"

import { useState, useEffect, useRef } from "react"
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
