/**
 * Smooth scroll to a specific element or section
 */
export function scrollToSection(elementId: string, offset = 100) {
  const element = document.getElementById(elementId)
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
  }
}

/**
 * Scroll to element with selector
 */
export function scrollToSelector(selector: string, offset = 100) {
  const element = document.querySelector(selector)
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
  }
}

/**
 * Scroll to top of page
 */
export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

/**
 * Auto-scroll with delay for sidebar opening
 */
export function autoScrollToSection(elementId: string, delay = 300, offset = 100) {
  setTimeout(() => {
    scrollToSection(elementId, offset)
  }, delay)
}
