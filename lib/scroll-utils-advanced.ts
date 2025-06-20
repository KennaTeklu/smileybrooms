export class ScrollManager {
  private static instance: ScrollManager
  private scrollElements: Map<string, HTMLElement> = new Map()
  private scrollStates: Map<string, any> = new Map()

  static getInstance(): ScrollManager {
    if (!ScrollManager.instance) {
      ScrollManager.instance = new ScrollManager()
    }
    return ScrollManager.instance
  }

  registerScrollElement(id: string, element: HTMLElement) {
    this.scrollElements.set(id, element)
  }

  unregisterScrollElement(id: string) {
    this.scrollElements.delete(id)
    this.scrollStates.delete(id)
  }

  saveScrollState(id: string) {
    const element = this.scrollElements.get(id)
    if (element) {
      this.scrollStates.set(id, {
        scrollTop: element.scrollTop,
        scrollLeft: element.scrollLeft,
        timestamp: Date.now(),
      })
    }
  }

  restoreScrollState(id: string) {
    const element = this.scrollElements.get(id)
    const state = this.scrollStates.get(id)

    if (element && state) {
      element.scrollTop = state.scrollTop
      element.scrollLeft = state.scrollLeft
    }
  }

  syncScrollElements(sourceId: string, targetIds: string[], ratio = 1) {
    const sourceElement = this.scrollElements.get(sourceId)
    if (!sourceElement) return

    const handleScroll = () => {
      targetIds.forEach((targetId) => {
        const targetElement = this.scrollElements.get(targetId)
        if (targetElement) {
          targetElement.scrollTop = sourceElement.scrollTop * ratio
        }
      })
    }

    sourceElement.addEventListener("scroll", handleScroll, { passive: true })
    return () => sourceElement.removeEventListener("scroll", handleScroll)
  }

  smoothScrollToElement(elementId: string, targetId: string, duration = 500) {
    const container = this.scrollElements.get(elementId)
    const target = document.getElementById(targetId)

    if (!container || !target) return

    const containerRect = container.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const targetPosition = targetRect.top - containerRect.top + container.scrollTop

    this.smoothScrollTo(container, targetPosition, duration)
  }

  private smoothScrollTo(element: HTMLElement, targetPosition: number, duration: number) {
    const startPosition = element.scrollTop
    const distance = targetPosition - startPosition
    const startTime = performance.now()

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function
      const easeInOutCubic =
        progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

      element.scrollTop = startPosition + distance * easeInOutCubic

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }
}

export const scrollManager = ScrollManager.getInstance()
