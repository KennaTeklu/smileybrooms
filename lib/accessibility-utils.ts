// Text-to-speech utility functions
export const speak = (text: string, rate = 1, pitch = 1, volume = 1): SpeechSynthesisUtterance | null => {
  if (typeof window === "undefined" || !window.speechSynthesis) return null

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  // Create a new utterance
  const utterance = new SpeechSynthesisUtterance(text)

  // Configure speech parameters
  utterance.rate = rate // 0.1 to 10
  utterance.pitch = pitch // 0 to 2
  utterance.volume = volume // 0 to 1

  // Use the default voice
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) {
    // Try to find a natural sounding voice
    const preferredVoice = voices.find(
      (voice) => voice.name.includes("Natural") || voice.name.includes("Premium") || voice.name.includes("Enhanced"),
    )

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }
  }

  // Start speaking
  window.speechSynthesis.speak(utterance)

  return utterance
}

export const stopSpeaking = (): void => {
  if (typeof window === "undefined" || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
}

// Simplified language conversion
export const simplifyText = (text: string): string => {
  const replacements: Record<string, string> = {
    "pursuant to": "according to",
    hereinafter: "from now on",
    aforementioned: "mentioned above",
    notwithstanding: "despite",
    "in accordance with": "following",
    shall: "will",
    utilize: "use",
    commence: "start",
    terminate: "end",
    endeavor: "try",
    "in the event that": "if",
    "prior to": "before",
    "subsequent to": "after",
    "for the purpose of": "to",
    "in order to": "to",
    "with reference to": "about",
    "with regard to": "about",
    "in relation to": "about",
    "in the amount of": "for",
    "at this point in time": "now",
  }

  let simplifiedText = text

  Object.entries(replacements).forEach(([complex, simple]) => {
    const regex = new RegExp(complex, "gi")
    simplifiedText = simplifiedText.replace(regex, simple)
  })

  return simplifiedText
}

// Calculate reading time
export const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200
  const wordCount = text.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// High contrast mode CSS
export const getHighContrastStyles = (): Record<string, string> => {
  return {
    color: "#000000",
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    outline: "2px solid #000000",
  }
}
