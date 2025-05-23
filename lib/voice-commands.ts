type CommandHandler = () => void

interface VoiceCommand {
  phrases: string[]
  handler: CommandHandler
  description: string
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: SpeechRecognitionError
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
    SpeechSynthesisUtterance: any
    speechSynthesis: any
  }
  interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
    onend: ((this: SpeechRecognition, ev: Event) => any) | null
    start(): void
    stop(): void
  }

  interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult
    length: number
    item(index: number): SpeechRecognitionResult
  }

  interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative
    length: number
    final: boolean
    item(index: number): SpeechRecognitionAlternative
  }

  interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
  }

  interface SpeechRecognitionError extends Event {
    error: string
    message: string
  }
}

class VoiceCommandManager {
  private commands: VoiceCommand[] = []
  private recognition: SpeechRecognition | null = null
  private isListening = false
  private onStateChange: ((isListening: boolean) => void) | null = null

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
          if (this.isListening) {
            // Restart if it ended unexpectedly while still supposed to be listening
            this.recognition?.start()
          }
        }
      }
    }
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
    this.isListening = false
    if (this.onStateChange) {
      this.onStateChange(false)
    }
  }

  private speakFeedback(message: string) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.volume = 0.8
      utterance.rate = 1.0
      utterance.pitch = 1.0
      window.speechSynthesis.speak(utterance)
    }
  }

  public registerCommand(command: VoiceCommand) {
    this.commands.push(command)
  }

  public registerCommands(commands: VoiceCommand[]) {
    this.commands.push(...commands)
  }

  public startListening() {
    if (!this.recognition) {
      console.error("Speech recognition not supported in this browser")
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

  public toggleListening() {
    if (this.isListening) {
      this.stopListening()
    } else {
      this.startListening()
    }
    return this.isListening
  }

  public isSupported() {
    return this.recognition !== null
  }

  public setOnStateChange(callback: (isListening: boolean) => void) {
    this.onStateChange = callback
  }

  public getCommands() {
    return this.commands
  }
}

// Singleton instance
export const voiceCommandManager = typeof window !== "undefined" ? new VoiceCommandManager() : null

// Hook for using voice commands
export function useVoiceCommands() {
  return voiceCommandManager
}
