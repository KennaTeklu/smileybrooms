"use client"

// Unified floating system inspired by JotForm chatbot behavior
export const FLOATING_LAYERS = {
  // Base layers (lowest)
  BACKGROUND_OVERLAY: 10,
  MODAL_BACKDROP: 20,

  // Content layers
  SIDEPANEL: 30,
  MODAL_CONTENT: 40,
  DROPDOWN: 50,

  // Interactive layers
  FLOATING_BUTTONS: 60,
  CART_BUTTON: 65,
  BOOK_NOW_BUTTON: 70,

  // System layers
  ACCESSIBILITY_PANEL: 80,
  TOUR_OVERLAY: 90,

  // Top layers (highest)
  CHATBOT: 100,
  TERMS_OVERLAY: 110,
  CRITICAL_ALERTS: 120,
} as const

export type FloatingLayer = (typeof FLOATING_LAYERS)[keyof typeof FLOATING_LAYERS]

export interface FloatingElementConfig {
  layer: FloatingLayer
  position: "left" | "right" | "center"
  offset?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
  responsive?: {
    mobile?: Partial<FloatingElementConfig>
    tablet?: Partial<FloatingElementConfig>
    desktop?: Partial<FloatingElementConfig>
  }
  behavior?: {
    hideOnScroll?: boolean
    showOnHover?: boolean
    persistAcrossPages?: boolean
    autoHide?: number // milliseconds
  }
  animation?: {
    entrance?: "fade" | "slide" | "bounce" | "scale"
    exit?: "fade" | "slide" | "bounce" | "scale"
    duration?: number
  }
}

export const DEFAULT_FLOATING_CONFIG: FloatingElementConfig = {
  layer: FLOATING_LAYERS.FLOATING_BUTTONS,
  position: "right",
  offset: {
    bottom: 20,
    right: 20,
  },
  behavior: {
    hideOnScroll: false,
    showOnHover: false,
    persistAcrossPages: true,
  },
  animation: {
    entrance: "scale",
    exit: "scale",
    duration: 300,
  },
}

export class FloatingElementManager {
  private static instance: FloatingElementManager
  private elements: Map<string, FloatingElementConfig> = new Map()
  private activeElements: Set<string> = new Set()

  static getInstance(): FloatingElementManager {
    if (!FloatingElementManager.instance) {
      FloatingElementManager.instance = new FloatingElementManager()
    }
    return FloatingElementManager.instance
  }

  register(id: string, config: Partial<FloatingElementConfig>): FloatingElementConfig {
    const fullConfig = { ...DEFAULT_FLOATING_CONFIG, ...config }
    this.elements.set(id, fullConfig)
    this.activeElements.add(id)
    return fullConfig
  }

  unregister(id: string): void {
    this.elements.delete(id)
    this.activeElements.delete(id)
  }

  getConfig(id: string): FloatingElementConfig | undefined {
    return this.elements.get(id)
  }

  getActiveElements(): string[] {
    return Array.from(this.activeElements)
  }

  // Calculate optimal positioning to avoid overlaps
  calculatePosition(id: string, elementHeight = 60): { bottom: number; right?: number; left?: number } {
    const config = this.getConfig(id)
    if (!config) return { bottom: 20, right: 20 }

    const samePositionElements = Array.from(this.activeElements)
      .filter((activeId) => {
        const activeConfig = this.getConfig(activeId)
        return activeConfig?.position === config.position && activeId !== id
      })
      .sort((a, b) => {
        const aConfig = this.getConfig(a)
        const bConfig = this.getConfig(b)
        return (aConfig?.layer || 0) - (bConfig?.layer || 0)
      })

    let baseOffset = config.offset?.bottom || 20

    // Stack elements vertically based on their layer order
    const elementIndex = samePositionElements.findIndex((activeId) => {
      const activeConfig = this.getConfig(activeId)
      return (activeConfig?.layer || 0) < config.layer
    })

    if (elementIndex >= 0) {
      baseOffset += (elementIndex + 1) * (elementHeight + 10) // 10px gap between elements
    }

    const position: { bottom: number; right?: number; left?: number } = {
      bottom: baseOffset,
    }

    if (config.position === "right") {
      position.right = config.offset?.right || 20
    } else if (config.position === "left") {
      position.left = config.offset?.left || 20
    }

    return position
  }
}

// CSS-in-JS styles for floating elements
export const getFloatingStyles = (
  config: FloatingElementConfig,
  calculated?: ReturnType<FloatingElementManager["calculatePosition"]>,
) => {
  const position = calculated || { bottom: config.offset?.bottom || 20 }

  return {
    position: "fixed" as const,
    zIndex: config.layer,
    bottom: `${position.bottom}px`,
    ...(position.right && { right: `${position.right}px` }),
    ...(position.left && { left: `${position.left}px` }),
    transition: `all ${config.animation?.duration || 300}ms ease-in-out`,
    transform: "translateZ(0)", // Force hardware acceleration
    willChange: "transform, opacity",
  }
}

// Animation variants for framer-motion
export const getFloatingAnimationVariants = (config: FloatingElementConfig) => {
  const duration = (config.animation?.duration || 300) / 1000

  const variants = {
    hidden: {
      opacity: 0,
      scale: config.animation?.entrance === "scale" ? 0.8 : 1,
      x: config.animation?.entrance === "slide" ? (config.position === "right" ? 100 : -100) : 0,
      y: config.animation?.entrance === "bounce" ? 50 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: config.animation?.entrance === "bounce" ? [0.68, -0.55, 0.265, 1.55] : "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: config.animation?.exit === "scale" ? 0.8 : 1,
      x: config.animation?.exit === "slide" ? (config.position === "right" ? 100 : -100) : 0,
      y: config.animation?.exit === "bounce" ? 50 : 0,
      transition: {
        duration: duration * 0.8,
        ease: "easeIn",
      },
    },
  }

  return variants
}
