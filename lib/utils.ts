import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const ms = Math.floor((milliseconds % 1000) / 10) // Get two digits for milliseconds

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return "" // Browser should use relative path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // Vercel deployment
  return `http://localhost:${process.env.PORT ?? 3000}` // Localhost
}

export function absoluteUrl(path: string) {
  return `${getBaseUrl()}${path}`
}

export function generateRandomId(length = 10): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321"
  let result = ""
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function capitalizeFirstLetter(string: string) {
  if (!string) return ""
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function slugify(text: string) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

export function unslugify(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength) + "..."
}

export function isValidEmail(email: string): boolean {
  // Basic regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhoneNumber(phone: string): boolean {
  // Basic regex for phone number validation (e.g., 10 digits)
  const phoneRegex = /^\d{10}$/
  return phoneRegex.test(phone.replace(/\D/g, "")) // Remove non-digits before testing
}

export function getInitials(name: string): string {
  if (!name) return ""
  const parts = name.split(" ")
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export function getDomainFromUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname
  } catch (error) {
    return null
  }
}

export function getQueryParams(url: string): Record<string, string> {
  const params: Record<string, string> = {}
  const queryString = url.split("?")[1]
  if (queryString) {
    queryString.split("&").forEach((param) => {
      const [key, value] = param.split("=")
      params[key] = decodeURIComponent(value || "")
    })
  }
  return params
}

export function updateQueryParams(url: string, newParams: Record<string, string>): string {
  const [baseUrl, queryString] = url.split("?")
  const currentParams = getQueryParams(url)
  const updatedParams = { ...currentParams, ...newParams }
  const newQueryString = Object.keys(updatedParams)
    .filter((key) => updatedParams[key] !== undefined && updatedParams[key] !== null)
    .map((key) => `${key}=${encodeURIComponent(updatedParams[key])}`)
    .join("&")
  return newQueryString ? `${baseUrl}?${newQueryString}` : baseUrl
}

export function removeQueryParams(url: string, paramsToRemove: string[]): string {
  const [baseUrl, queryString] = url.split("?")
  if (!queryString) return url

  const currentParams = getQueryParams(url)
  const filteredParams: Record<string, string> = {}
  for (const key in currentParams) {
    if (!paramsToRemove.includes(key)) {
      filteredParams[key] = currentParams[key]
    }
  }

  const newQueryString = Object.keys(filteredParams)
    .map((key) => `${key}=${encodeURIComponent(filteredParams[key])}`)
    .join("&")
  return newQueryString ? `${baseUrl}?${newQueryString}` : baseUrl
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return
  let expires = ""
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = "; expires=" + date.toUTCString()
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/"
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = name + "=; Max-Age=-99999999;"
}

export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeout: NodeJS.Timeout
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), delay)
  }) as T
}

export function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
  let inThrottle: boolean
  let lastResult: ReturnType<T>
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
      lastResult = func(...args)
    }
    return lastResult
  }) as T
}

export function getScrollbarWidth(): number {
  if (typeof window === "undefined") return 0
  const outer = document.createElement("div")
  outer.style.visibility = "hidden"
  outer.style.overflow = "scroll" // forcing scrollbar to appear
  // @ts-ignore
  outer.style.msOverflowStyle = "scrollbar" // for IE11
  document.body.appendChild(outer)
  const inner = document.createElement("div")
  outer.appendChild(inner)
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
  outer.parentNode?.removeChild(outer)
  return scrollbarWidth
}

export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false
  return "ontouchstart" in window || navigator.maxTouchPoints > 0
}

export function getBrowserInfo(): { name: string; version: string } {
  if (typeof navigator === "undefined") return { name: "Unknown", version: "Unknown" }
  const userAgent = navigator.userAgent
  let name = "Unknown"
  let version = "Unknown"

  if (/firefox/i.test(userAgent)) {
    name = "Firefox"
    const match = userAgent.match(/firefox\/(\d+\.\d+)/i)
    if (match) version = match[1]
  } else if (/chrome|crios|crmo/i.test(userAgent)) {
    name = "Chrome"
    const match = userAgent.match(/(?:chrome|crios|crmo)\/(\d+\.\d+)/i)
    if (match) version = match[1]
  } else if (/safari/i.test(userAgent)) {
    name = "Safari"
    const match = userAgent.match(/version\/(\d+\.\d+)/i)
    if (match) version = match[1]
  } else if (/msie|trident/i.test(userAgent)) {
    name = "IE"
    const match = userAgent.match(/(?:msie |rv:)(\d+\.\d+)/i)
    if (match) version = match[1]
  } else if (/edge/i.test(userAgent)) {
    name = "Edge"
    const match = userAgent.match(/edge\/(\d+\.\d+)/i)
    if (match) version = match[1]
  }

  return { name, version }
}

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
  return /android|ipad|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
}

export function getOperatingSystem(): string {
  if (typeof navigator === "undefined") return "Unknown"
  const userAgent = navigator.userAgent
  if (/windows phone/i.test(userAgent)) return "Windows Phone"
  if (/android/i.test(userAgent)) return "Android"
  if (/ipad|iphone|ipod/i.test(userAgent)) return "iOS"
  if (/mac/i.test(userAgent)) return "macOS"
  if (/linux/i.test(userAgent)) return "Linux"
  if (/windows/i.test(userAgent)) return "Windows"
  return "Unknown"
}

export function getDeviceType(): "desktop" | "tablet" | "mobile" | "unknown" {
  if (typeof navigator === "undefined") return "unknown"
  const userAgent = navigator.userAgent

  // Regular expressions for common device types
  const mobileRegex =
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|rim)|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i
  const tabletRegex = /android|ipad|playbook|silk/i

  if (mobileRegex.test(userAgent)) {
    return "mobile"
  }
  if (
    tabletRegex.test(userAgent) ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform))
  ) {
    // Added check for iPadOS 13+ which reports as MacIntel
    return "tablet"
  }
  return "desktop"
}

export function getScreenOrientation(): "portrait" | "landscape" | "unknown" {
  if (typeof window === "undefined" || !window.screen?.orientation) return "unknown"
  const angle = window.screen.orientation.angle
  if (angle === 0 || angle === 180) {
    return "portrait"
  } else if (angle === 90 || angle === 270) {
    return "landscape"
  }
  return "unknown"
}

export function getViewportDimensions(): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 0, height: 0 }
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
  }
}

export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__test_localStorage__"
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

export function isSessionStorageAvailable(): boolean {
  try {
    const testKey = "__test_sessionStorage__"
    sessionStorage.setItem(testKey, testKey)
    sessionStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

export function isOnline(): boolean {
  if (typeof navigator === "undefined") return true // Assume online if not in browser
  return navigator.onLine
}

export function getBatteryLevel(): Promise<number | null> {
  if (typeof navigator === "undefined" || !("getBattery" in navigator)) {
    return Promise.resolve(null)
  }
  return (navigator as any).getBattery().then((battery: any) => battery.level)
}

export function isLowPowerMode(): Promise<boolean | null> {
  if (typeof navigator === "undefined" || !("getBattery" in navigator)) {
    return Promise.resolve(null)
  }
  return (navigator as any).getBattery().then((battery: any) => battery.charging === false && battery.level < 0.2)
}

export function getNetworkSpeed(): Promise<number | null> {
  if (typeof navigator === "undefined" || !navigator.connection) {
    return Promise.resolve(null)
  }
  // @ts-ignore
  return Promise.resolve(navigator.connection.downlink || null)
}

export function getPreferredLanguage(): string {
  if (typeof navigator === "undefined") return "en-US"
  return navigator.language || (navigator.languages && navigator.languages[0]) || "en-US"
}

export function getSystemTheme(): "light" | "dark" | "unknown" {
  if (typeof window === "undefined" || !window.matchMedia) return "unknown"
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark"
  }
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light"
  }
  return "unknown"
}

export function isDarkMode(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export function getScrollPosition(): { x: number; y: number } {
  if (typeof window === "undefined") return { x: 0, y: 0 }
  return {
    x: window.scrollX || window.pageXOffset,
    y: window.scrollY || window.pageYOffset,
  }
}

export function scrollToTop(behavior: ScrollBehavior = "smooth") {
  if (typeof window === "undefined") return
  window.scrollTo({ top: 0, behavior })
}

export function scrollToElement(elementId: string, behavior: ScrollBehavior = "smooth") {
  if (typeof document === "undefined") return
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior })
  }
}

export function getElementDimensions(
  elementId: string,
): { width: number; height: number; top: number; left: number } | null {
  if (typeof document === "undefined") return null
  const element = document.getElementById(elementId)
  if (element) {
    const rect = element.getBoundingClientRect()
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    }
  }
  return null
}

export function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return Promise.reject(new Error("Clipboard API not available"))
  }
  return navigator.clipboard.writeText(text)
}

export function shareContent(data: ShareData): Promise<void> {
  if (typeof navigator === "undefined" || !navigator.share) {
    return Promise.reject(new Error("Web Share API not available"))
  }
  return navigator.share(data)
}

export function isPWAInstalled(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone
}

export function getDevicePixelRatio(): number {
  if (typeof window === "undefined") return 1
  return window.devicePixelRatio || 1
}

export function getPageVisibilityState(): DocumentVisibilityState {
  if (typeof document === "undefined") return "visible"
  return document.visibilityState
}

export function getReferrer(): string {
  if (typeof document === "undefined") return ""
  return document.referrer
}

export function getPageTitle(): string {
  if (typeof document === "undefined") return ""
  return document.title
}

export function getMetaContent(name: string): string | null {
  if (typeof document === "undefined") return null
  const element = document.querySelector(`meta[name="${name}"]`)
  return element ? element.getAttribute("content") : null
}

export function getLinkHref(rel: string): string | null {
  if (typeof document === "undefined") return null
  const element = document.querySelector(`link[rel="${rel}"]`)
  return element ? element.getAttribute("href") : null
}

export function getCanonicalUrl(): string | null {
  return getLinkHref("canonical")
}

export function getFaviconUrl(): string | null {
  return getLinkHref("icon")
}

export function getAppleTouchIconUrl(): string | null {
  return getLinkHref("apple-touch-icon")
}

export function getManifestUrl(): string | null {
  return getLinkHref("manifest")
}

export function getRobotsContent(): string | null {
  return getMetaContent("robots")
}

export function getViewportContent(): string | null {
  return getMetaContent("viewport")
}

export function getCsrfToken(): string | null {
  return getMetaContent("csrf-token")
}

export function getThemeColor(): string | null {
  return getMetaContent("theme-color")
}

export function getAppleMobileWebAppCapable(): boolean {
  return getMetaContent("apple-mobile-web-app-capable") === "yes"
}

export function getAppleMobileWebAppStatusBarStyle(): string | null {
  return getMetaContent("apple-mobile-web-app-status-bar-style")
}

export function getTwitterCardType(): string | null {
  return getMetaContent("twitter:card")
}

export function getTwitterSite(): string | null {
  return getMetaContent("twitter:site")
}

export function getTwitterCreator(): string | null {
  return getMetaContent("twitter:creator")
}

export function getTwitterTitle(): string | null {
  return getMetaContent("twitter:title")
}

export function getTwitterDescription(): string | null {
  return getMetaContent("twitter:description")
}

export function getTwitterImage(): string | null {
  return getMetaContent("twitter:image")
}

export function getOgTitle(): string | null {
  return getMetaContent("og:title")
}

export function getOgDescription(): string | null {
  return getMetaContent("og:description")
}

export function getOgImage(): string | null {
  return getMetaContent("og:image")
}

export function getOgUrl(): string | null {
  return getMetaContent("og:url")
}

export function getOgType(): string | null {
  return getMetaContent("og:type")
}

export function getOgLocale(): string | null {
  return getMetaContent("og:locale")
}

export function getOgSiteName(): string | null {
  return getMetaContent("og:site_name")
}

export function getArticlePublishedTime(): string | null {
  return getMetaContent("article:published_time")
}

export function getArticleModifiedTime(): string | null {
  return getMetaContent("article:modified_time")
}

export function getArticleAuthor(): string | null {
  return getMetaContent("article:author")
}

export function getArticleSection(): string | null {
  return getMetaContent("article:section")
}

export function getArticleTag(): string | null {
  return getMetaContent("article:tag")
}

export function getProfileFirstName(): string | null {
  return getMetaContent("profile:first_name")
}

export function getProfileLastName(): string | null {
  return getMetaContent("profile:last_name")
}

export function getProfileUsername(): string | null {
  return getMetaContent("profile:username")
}

export function getProfileGender(): string | null {
  return getMetaContent("profile:gender")
}

export function getBookAuthor(): string | null {
  return getMetaContent("book:author")
}

export function getBookIsbn(): string | null {
  return getMetaContent("book:isbn")
}

export function getBookReleaseDate(): string | null {
  return getMetaContent("book:release_date")
}

export function getBookTag(): string | null {
  return getMetaContent("book:tag")
}

export function getVideoActor(): string | null {
  return getMetaContent("video:actor")
}

export function getVideoDirector(): string | null {
  return getMetaContent("video:director")
}

export function getVideoWriter(): string | null {
  return getMetaContent("video:writer")
}

export function getVideoDuration(): string | null {
  return getMetaContent("video:duration")
}

export function getVideoReleaseDate(): string | null {
  return getMetaContent("video:release_date")
}

export function getVideoTag(): string | null {
  return getMetaContent("video:tag")
}

export function getVideoSeries(): string | null {
  return getMetaContent("video:series")
}

export function getAudioAlbum(): string | null {
  return getMetaContent("audio:album")
}

export function getAudioArtist(): string | null {
  return getMetaContent("audio:artist")
}

export function getAudioDisc(): string | null {
  return getMetaContent("audio:disc")
}

export function getAudioTrack(): string | null {
  return getMetaContent("audio:track")
}

export function getAudioReleaseDate(): string | null {
  return getMetaContent("audio:release_date")
}

export function getPlaceLocation(): string | null {
  return getMetaContent("place:location")
}

export function getPlaceLatitude(): string | null {
  return getMetaContent("place:latitude")
}

export function getPlaceLongitude(): string | null {
  return getMetaContent("place:longitude")
}

export function getPlaceStreetAddress(): string | null {
  return getMetaContent("place:street_address")
}

export function getPlaceLocality(): string | null {
  return getMetaContent("place:locality")
}

export function getPlaceRegion(): string | null {
  return getMetaContent("place:region")
}

export function getPlacePostalCode(): string | null {
  return getMetaContent("place:postal_code")
}

export function getPlaceCountryName(): string | null {
  return getMetaContent("place:country_name")
}

export function getRestaurantMenu(): string | null {
  return getMetaContent("restaurant:menu")
}

export function getRestaurantPriceRange(): string | null {
  return getMetaContent("restaurant:price_range")
}

export function getRestaurantReservations(): string | null {
  return getMetaContent("restaurant:reservations")
}

export function getRestaurantSection(): string | null {
  return getMetaContent("restaurant:section")
}

export function getRestaurantVariation(): string | null {
  return getMetaContent("restaurant:variation")
}

export function getProductRetailerItemId(): string | null {
  return getMetaContent("product:retailer_item_id")
}

export function getProductRetailerCategory(): string | null {
  return getMetaContent("product:retailer_category")
}

export function getProductRetailerPartNumber(): string | null {
  return getMetaContent("product:retailer_part_number")
}

export function getProductRetailerBrand(): string | null {
  return getMetaContent("product:retailer_brand")
}

export function getProductRetailerColor(): string | null {
  return getMetaContent("product:retailer_color")
}

export function getProductRetailerMaterial(): string | null {
  return getMetaContent("product:retailer_material")
}

export function getProductRetailerPattern(): string | null {
  return getMetaContent("product:retailer_pattern")
}

export function getProductRetailerSize(): string | null {
  return getMetaContent("product:retailer_size")
}

export function getProductRetailerWeight(): string | null {
  return getMetaContent("product:retailer_weight")
}

export function getProductRetailerCondition(): string | null {
  return getMetaContent("product:retailer_condition")
}

export function getProductRetailerAvailability(): string | null {
  return getMetaContent("product:retailer_availability")
}

export function getProductRetailerPrice(): string | null {
  return getMetaContent("product:retailer_price")
}

export function getProductRetailerCurrency(): string | null {
  return getMetaContent("product:retailer_currency")
}

export function getProductRetailerSalePrice(): string | null {
  return getMetaContent("product:retailer_sale_price")
}

export function getProductRetailerSalePriceDates(): string | null {
  return getMetaContent("product:retailer_sale_price_dates")
}

export function getProductRetailerShippingCost(): string | null {
  return getMetaContent("product:retailer_shipping_cost")
}

export function getProductRetailerShippingCurrency(): string | null {
  return getMetaContent("product:retailer_shipping_currency")
}

export function getProductRetailerShippingRegion(): string | null {
  return getMetaContent("product:retailer_shipping_region")
}

export function getProductRetailerShippingCountry(): string | null {
  return getMetaContent("product:retailer_shipping_country")
}

export function getProductRetailerShippingPostalCode(): string | null {
  return getMetaContent("product:retailer_shipping_postal_code")
}

export function getProductRetailerShippingAvailability(): string | null {
  return getMetaContent("product:retailer_shipping_availability")
}

export function getProductRetailerShippingMethod(): string | null {
  return getMetaContent("product:retailer_shipping_method")
}

export function getProductRetailerShippingTime(): string | null {
  return getMetaContent("product:retailer_shipping_time")
}

export function getProductRetailerShippingWeight(): string | null {
  return getMetaContent("product:retailer_shipping_weight")
}

export function getProductRetailerShippingWeightUnit(): string | null {
  return getMetaContent("product:retailer_shipping_weight_unit")
}

export function getProductRetailerShippingLength(): string | null {
  return getMetaContent("product:retailer_shipping_length")
}

export function getProductRetailerShippingWidth(): string | null {
  return getMetaContent("product:retailer_shipping_width")
}

export function getProductRetailerShippingHeight(): string | null {
  return getMetaContent("product:retailer_shipping_height")
}

export function getProductRetailerShippingDimensionUnit(): string | null {
  return getMetaContent("product:retailer_shipping_dimension_unit")
}

export function getProductRetailerShippingHandlingFee(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee")
}

export function getProductRetailerShippingHandlingFeeCurrency(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_currency")
}

export function getProductRetailerShippingHandlingFeeRegion(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_region")
}

export function getProductRetailerShippingHandlingFeeCountry(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_country")
}

export function getProductRetailerShippingHandlingFeePostalCode(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_postal_code")
}

export function getProductRetailerShippingHandlingFeeAvailability(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_availability")
}

export function getProductRetailerShippingHandlingFeeMethod(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_method")
}

export function getProductRetailerShippingHandlingFeeTime(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_time")
}

export function getProductRetailerShippingHandlingFeeWeight(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_weight")
}

export function getProductRetailerShippingHandlingFeeWeightUnit(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_weight_unit")
}

export function getProductRetailerShippingHandlingFeeLength(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_length")
}

export function getProductRetailerShippingHandlingFeeWidth(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_width")
}

export function getProductRetailerShippingHandlingFeeHeight(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_height")
}

export function getProductRetailerShippingHandlingFeeDimensionUnit(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_dimension_unit")
}

export function getProductRetailerShippingHandlingFeeTaxRate(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate")
}

export function getProductRetailerShippingHandlingFeeTaxRateCurrency(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_currency")
}

export function getProductRetailerShippingHandlingFeeTaxRateRegion(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_region")
}

export function getProductRetailerShippingHandlingFeeTaxRateCountry(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_country")
}

export function getProductRetailerShippingHandlingFeeTaxRatePostalCode(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_postal_code")
}

export function getProductRetailerShippingHandlingFeeTaxRateAvailability(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_availability")
}

export function getProductRetailerShippingHandlingFeeTaxRateMethod(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_method")
}

export function getProductRetailerShippingHandlingFeeTaxRateTime(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_time")
}

export function getProductRetailerShippingHandlingFeeTaxRateWeight(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_weight")
}

export function getProductRetailerShippingHandlingFeeTaxRateWeightUnit(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_weight_unit")
}

export function getProductRetailerShippingHandlingFeeTaxRateLength(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_length")
}

export function getProductRetailerShippingHandlingFeeTaxRateWidth(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_width")
}

export function getProductRetailerShippingHandlingFeeTaxRateHeight(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_height")
}

export function getProductRetailerShippingHandlingFeeTaxRateDimensionUnit(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_dimension_unit")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRate(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateCurrency(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_currency")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateRegion(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_region")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateCountry(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_country")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRatePostalCode(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_postal_code")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateAvailability(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_availability")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateMethod(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_method")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTime(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_time")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateWeight(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_weight")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateWeightUnit(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_weight_unit")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateLength(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_length")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateWidth(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_width")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateHeight(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_height")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateDimensionUnit(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_dimension_unit")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRate(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateCurrency(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_currency")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateRegion(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_region")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateCountry(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_country")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRatePostalCode(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_postal_code")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateAvailability(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_availability")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateMethod(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_method")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTime(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_time")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateWeight(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_weight")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateWeightUnit(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_weight_unit")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateLength(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_length")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateWidth(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_width")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateHeight(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_height")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateDimensionUnit(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_dimension_unit")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRate(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateCurrency(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_currency")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateRegion(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_region")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateCountry(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_country")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRatePostalCode(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_postal_code")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateAvailability(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_availability")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateMethod(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_method")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTime(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_time")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateWeight(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_weight")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateWeightUnit(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_weight_unit")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateLength(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_length")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateWidth(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_width")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateHeight(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_height")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateDimensionUnit(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_dimension_unit")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRate(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateCurrency(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_currency")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateRegion(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_region")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateCountry(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_country")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRatePostalCode(): string | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_postal_code",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateAvailability(): string | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_availability",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateMethod(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_method")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTime(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_time")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateWeight(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_weight")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateWeightUnit(): string | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_weight_unit",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateLength(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_length")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateWidth(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_width")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateHeight(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_height")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateDimensionUnit(): string | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_dimension_unit",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRate(): string | null {
  return getMetaContent("product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate")
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateCurrency():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_currency",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateRegion(): string | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_region",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateCountry():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_country",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRatePostalCode():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_postal_code",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateAvailability():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_availability",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateMethod(): string | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_method",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTime(): string | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_time",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateWeight(): string | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_weight",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateWeightUnit():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_weight_unit",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateLength(): string | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_length",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateWidth(): string | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_width",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateHeight(): string | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_height",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateDimensionUnit():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_dimension_unit",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRate():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateCurrency():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_currency",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateRegion():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_region",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateCountry():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_country",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRatePostalCode():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_postal_code",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateAvailability():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_availability",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateMethod():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_method",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTime():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_time",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateWeight():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_weight",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateWeightUnit():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_weight_unit",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateLength():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_length",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateWidth():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_width",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateHeight():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_height",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateDimensionUnit():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_dimension_unit",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRate():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateCurrency():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_currency",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateRegion():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_region",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateCountry():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_country",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRatePostalCode():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_postal_code",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateAvailability():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_availability",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateMethod():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_method",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTime():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_time",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateWeight():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_weight",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateWeightUnit():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_weight_unit",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateLength():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_length",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateWidth():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_width",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateHeight():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_height",
  )
}

export function getProductRetailerShippingHandlingFeeTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateTaxRateDimensionUnit():
  | string
  | null {
  return getMetaContent(
    "product:retailer_shipping_handling_fee_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_tax_rate_dimension_unit",
  )
}
