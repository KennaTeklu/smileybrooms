"use client"

import { useEffect } from "react"

export default function DynamicFavicon() {
  useEffect(() => {
    // Create an SVG favicon with the same smiley face as the logo
    const createFavicon = () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.setAttribute("width", "64")
      svg.setAttribute("height", "64")
      svg.setAttribute("viewBox", "0 0 64 64")

      // Background circle - using the same gradient as the logo
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
      svg.appendChild(defs)

      const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient")
      gradient.setAttribute("id", "logoGradient")
      gradient.setAttribute("x1", "0%")
      gradient.setAttribute("y1", "0%")
      gradient.setAttribute("x2", "100%")
      gradient.setAttribute("y2", "100%")
      defs.appendChild(gradient)

      const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop")
      stop1.setAttribute("offset", "0%")
      stop1.setAttribute("stop-color", "#FFDE59")
      gradient.appendChild(stop1)

      const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop")
      stop2.setAttribute("offset", "100%")
      stop2.setAttribute("stop-color", "#FFB930")
      gradient.appendChild(stop2)

      // Background circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      circle.setAttribute("cx", "32")
      circle.setAttribute("cy", "32")
      circle.setAttribute("r", "32")
      circle.setAttribute("fill", "url(#logoGradient)")
      svg.appendChild(circle)

      // Left eye
      const leftEye = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      leftEye.setAttribute("cx", "20")
      leftEye.setAttribute("cy", "22")
      leftEye.setAttribute("r", "4")
      leftEye.setAttribute("fill", "#333333")
      svg.appendChild(leftEye)

      // Right eye
      const rightEye = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      rightEye.setAttribute("cx", "44")
      rightEye.setAttribute("cy", "22")
      rightEye.setAttribute("r", "4")
      rightEye.setAttribute("fill", "#333333")
      svg.appendChild(rightEye)

      // Smile - matching the logo's smile
      const smile = document.createElementNS("http://www.w3.org/2000/svg", "path")
      smile.setAttribute("d", "M20,38 Q32,48 44,38")
      smile.setAttribute("stroke", "#333333")
      smile.setAttribute("stroke-width", "4")
      smile.setAttribute("fill", "transparent")
      svg.appendChild(smile)

      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svg)
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
      const svgUrl = URL.createObjectURL(svgBlob)

      // Create and set the favicon link
      const link = document.querySelector("link[rel*='icon']") || document.createElement("link")
      link.type = "image/svg+xml"
      link.rel = "shortcut icon"
      link.href = svgUrl
      document.getElementsByTagName("head")[0].appendChild(link)
    }

    createFavicon()

    // Clean up the object URL when component unmounts
    return () => {
      const link = document.querySelector("link[rel*='icon']")
      if (link?.href) {
        URL.revokeObjectURL(link.href)
      }
    }
  }, [])

  return null
}
