"use client"

import { useEffect, useState, useCallback } from "react"

type CommandHandler = () => void

interface VoiceCommand {
  phrases: string[]
  handler: CommandHandler
  description: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  start: () => void
  stop: () => void
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: SpeechRecognitionError
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult
  length: number
  item(index: number): SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative
  length: number
  item(index: number): SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

type SpeechRecognitionError =
  | "aborted"
  | "audio-capture"
  | "bad-grammar"
  | "language-not-supported"
  | "network"
  | "no-speech"
  | "not-allowed"
  | "service-not-allowed"
  | "timeout"

class VoiceCommandEngine {
  private commands: VoiceCommand[] = []
  private recognition: SpeechRecognition | null = null
  private isListening = false
  private onStateChange: ((isListening: boolean) => void) | null = null
  private onError: ((error: string) => void) | null = null
  private permissionGranted = false

  constructor() {
    this.initSpeechRecognition()
  }

  private initSpeechRecognition() {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()

      if (this.recognition) {
        this.recognition.continuous = true
        this.recognition.interimResults = false
        this.recognition.lang = "en-US"

        this.recognition.onresult = this.handleSpeechResult.bind(this)
        this.recognition.onerror = this.handleSpeechError.bind(this)
        this.recognition.onend = () => {
          if (this.isListening && this.permissionGranted) {
            // Restart if it ended unexpectedly while still supposed to be listening
            try {
              this.recognition?.start()
            } catch (error) {
              console.error("Error restarting speech recognition:", error)
              this.stopListening()
            }
          }
        }
      }
    }
  }

  private async requestMicrophonePermission(): Promise<boolean> {
    try {
      // Check if we already have permission
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: "microphone" as PermissionName })
        if (permission.state === "granted") {
          this.permissionGranted = true
          return true
        }
        if (permission.state === "denied") {
          this.handlePermissionDenied()
          return false
        }
      }

      // Request permission by trying to access the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop()) // Stop the stream immediately
      this.permissionGranted = true
      return true
    } catch (error) {
      console.error("Microphone permission denied:", error)
      this.handlePermissionDenied()
      return false
    }
  }

  private handlePermissionDenied() {
    const errorMessage =
      "Microphone access is required for voice commands. Please enable microphone permissions in your browser settings."
    if (this.onError) {
      this.onError(errorMessage)
    }
    this.speakFeedback("Microphone permission is required for voice commands.")
  }

  private handleSpeechResult(event: SpeechRecognitionEvent) {
    const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase()
    console.log("Voice command detected:", transcript)

    // Check if the transcript matches any registered command
    for (const command of this.commands) {
      if (command.phrases.some((phrase) => transcript.includes(phrase.toLowerCase()))) {
        command.handler()
        // Provide feedback that command was recognized
        this.speakFeedback(`Executing command: ${command.description}`)
        return
      }
    }

    // If we get here, no command matched
    this.speakFeedback("Command not recognized. Please try again.")
  }

  private handleSpeechError(event: SpeechRecognitionErrorEvent) {
    console.error("Speech recognition error:", event.error)

    let errorMessage = "Voice recognition error occurred."

    switch (event.error) {
      case "not-allowed":
        errorMessage = "Microphone access denied. Please enable microphone permissions."
        this.handlePermissionDenied()
        break
      case "no-speech":
        errorMessage = "No speech detected. Please try again."
        break
      case "audio-capture":
        errorMessage = "No microphone found. Please check your microphone connection."
        break
      case "network":
        errorMessage = "Network error occurred. Please check your internet connection."
        break
      case "service-not-allowed":
        errorMessage = "Speech recognition service not allowed."
        break
      default:
        errorMessage = `Speech recognition error: ${event.error}`
    }

    if (this.onError) {
      this.onError(errorMessage)
    }

    this.isListening = false
    this.permissionGranted = false
    if (this.onStateChange) {
      this.onStateChange(false)
    }
  }

  private speakFeedback(message: string) {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(message)
      utterance.volume = 0.8
      utterance.rate = 1.0
      utterance.pitch = 1.0
      window.speechSynthesis.speak(utterance)
    }
  }

  public addCommand(command: VoiceCommand) {
    this.commands.push(command)
  }

  public addCommands(commands: VoiceCommand[]) {
    this.commands.push(...commands)
  }

  public async startListening(): Promise<boolean> {
    if (!this.recognition) {
      const errorMessage = "Speech recognition not supported in this browser"
      console.error(errorMessage)
      if (this.onError) {
        this.onError(errorMessage)
      }
      return false
    }

    // Request microphone permission first
    const hasPermission = await this.requestMicrophonePermission()
    if (!hasPermission) {
      return false
    }

    try {
      this.recognition.start()
      this.isListening = true
      if (this.onStateChange) {
        this.onStateChange(true)
      }
      this.speakFeedback("Voice commands activated. What would you like to do?")
      return true
    } catch (error) {
      console.error("Error starting speech recognition:", error)
      const errorMessage = "Failed to start voice recognition. Please try again."
      if (this.onError) {
        this.onError(errorMessage)
      }
      return false
    }
  }

  public stopListening() {
    if (!this.recognition) return

    try {
      this.recognition.stop()
      this.isListening = false
      if (this.onStateChange) {
        this.onStateChange(false)
      }
      this.speakFeedback("Voice commands deactivated")
    } catch (error) {
      console.error("Error stopping speech recognition:", error)
    }
  }

  public async toggleListening(): Promise<boolean> {
    if (this.isListening) {
      this.stopListening()
      return false
    } else {
      return await this.startListening()
    }
  }

  public isSupported() {
    return this.recognition !== null
  }

  public setOnStateChange(callback: (isListening: boolean) => void) {
    this.onStateChange = callback
  }

  public setOnError(callback: (error: string) => void) {
    this.onError = callback
  }

  public getCommands() {
    return this.commands
  }
}

// Singleton instance
export const voiceEngine = typeof window !== "undefined" ? new VoiceCommandEngine() : null

// Hook for using voice commands
export function useVoiceCommands() {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (voiceEngine) {
      setIsSupported(voiceEngine.isSupported())
      voiceEngine.setOnStateChange(setIsListening)
      voiceEngine.setOnError(setError)
    }
  }, [])

  const addCommand = useCallback((command: VoiceCommand) => {
    voiceEngine?.addCommand(command)
  }, [])

  const addCommands = useCallback((commands: VoiceCommand[]) => {
    voiceEngine?.addCommands(commands)
  }, [])

  const startListening = useCallback(async () => {
    setError(null)
    return (await voiceEngine?.startListening()) || false
  }, [])

  const stopListening = useCallback(() => {
    voiceEngine?.stopListening()
  }, [])

  const toggleListening = useCallback(async () => {
    setError(null)
    return (await voiceEngine?.toggleListening()) || false
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isListening,
    isSupported,
    error,
    addCommand,
    addCommands,
    startListening,
    stopListening,
    toggleListening,
    clearError,
  }
}
