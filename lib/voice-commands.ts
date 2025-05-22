// Voice command utilities

interface VoiceCommandOptions {
  continuous?: boolean
  interimResults?: boolean
  lang?: string
  onResult?: (transcript: string, isFinal: boolean) => void
  onError?: (error: Error) => void
  commands?: Record<string, () => void>
}

/**
 * Creates a voice command system
 */
export function createVoiceCommands(options: VoiceCommandOptions = {}) {
  // Check if browser supports speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SpeechRecognition) {
    console.error("Speech recognition not supported in this browser")
    return {
      start: () => {},
      stop: () => {},
      isListening: false,
    }
  }

  // Create recognition instance
  const recognition = new SpeechRecognition()

  // Configure recognition
  recognition.continuous = options.continuous ?? true
  recognition.interimResults = options.interimResults ?? true
  recognition.lang = options.lang ?? "en-US"

  let isListening = false

  // Set up result handler
  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join("")

    const isFinal = event.results[event.results.length - 1].isFinal

    // Call the result callback if provided
    if (options.onResult) {
      options.onResult(transcript, isFinal)
    }

    // Process commands if final result and commands are provided
    if (isFinal && options.commands) {
      const lowerTranscript = transcript.toLowerCase().trim()

      // Check each command
      Object.entries(options.commands).forEach(([command, action]) => {
        if (lowerTranscript.includes(command.toLowerCase())) {
          action()
        }
      })
    }
  }

  // Set up error handler
  recognition.onerror = (event) => {
    if (options.onError) {
      options.onError(new Error(`Speech recognition error: ${event.error}`))
    }
  }

  // Restart recognition when it ends
  recognition.onend = () => {
    if (isListening) {
      recognition.start()
    }
  }

  return {
    start: () => {
      if (!isListening) {
        recognition.start()
        isListening = true
      }
    },
    stop: () => {
      recognition.stop()
      isListening = false
    },
    isListening: () => isListening,
  }
}

/**
 * Predefined voice commands for common actions
 */
export const commonVoiceCommands = {
  "go home": () => {
    window.location.href = "/"
  },
  "go back": () => {
    window.history.back()
  },
  "scroll down": () => {
    window.scrollBy({ top: 300, behavior: "smooth" })
  },
  "scroll up": () => {
    window.scrollBy({ top: -300, behavior: "smooth" })
  },
  "scroll to top": () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  },
  "scroll to bottom": () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
  },
  "click button": () => {
    // Find the most prominent button and click it
    const buttons = Array.from(document.querySelectorAll("button"))
    if (buttons.length > 0) {
      // Sort by size and position to find the most prominent
      const mainButton = buttons.sort((a, b) => {
        const aRect = a.getBoundingClientRect()
        const bRect = b.getBoundingClientRect()
        const aArea = aRect.width * aRect.height
        const bArea = bRect.width * bRect.height
        return bArea - aArea
      })[0]
      mainButton.click()
    }
  },
}

/**
 * Creates a voice feedback system for screen reader-like functionality
 */
export function createVoiceFeedback() {
  // Check if browser supports speech synthesis
  if (!window.speechSynthesis) {
    console.error("Speech synthesis not supported in this browser")
    return {
      speak: () => {},
      stop: () => {},
    }
  }

  return {
    speak: (text: string, options: { rate?: number; pitch?: number; volume?: number } = {}) => {
      const utterance = new SpeechSynthesisUtterance(text)

      // Configure utterance
      utterance.rate = options.rate ?? 1
      utterance.pitch = options.pitch ?? 1
      utterance.volume = options.volume ?? 1

      // Use the first available voice
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        utterance.voice = voices[0]
      }

      // Speak the text
      window.speechSynthesis.speak(utterance)
    },
    stop: () => {
      window.speechSynthesis.cancel()
    },
  }
}

export default {
  createVoiceCommands,
  commonVoiceCommands,
  createVoiceFeedback,
}
