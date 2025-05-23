"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export default function DynamicFavicon() {
  const { theme } = useTheme()

  useEffect(() => {
    // Create a dynamic favicon based on the current theme
    const canvas = document.createElement("canvas")
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)

      if (theme === "dark") {
        gradient.addColorStop(0, "#1e40af") // darker blue
        gradient.addColorStop(1, "#4338ca") // darker indigo
      } else {
        gradient.addColorStop(0, "#3b82f6") // blue-500
        gradient.addColorStop(1, "#4f46e5") // indigo-600
      }

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2)
      ctx.fill()

      // Draw smile icon
      ctx.fillStyle = "white"
      ctx.strokeStyle = "white"
      ctx.lineWidth = 2

      // Draw circle for the face
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 3, 0, Math.PI * 2)
      ctx.stroke()

      // Draw smile
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 5, 0, Math.PI)
      ctx.stroke()

      // Draw eyes
      const eyeRadius = canvas.width / 20
      const eyeOffsetX = canvas.width / 8
      const eyeOffsetY = canvas.width / 10

      ctx.beginPath()
      ctx.arc(canvas.width / 2 - eyeOffsetX, canvas.height / 2 - eyeOffsetY, eyeRadius, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(canvas.width / 2 + eyeOffsetX, canvas.height / 2 - eyeOffsetY, eyeRadius, 0, Math.PI * 2)
      ctx.fill()

      // Update favicon
      const link = document.querySelector("link#dynamic-favicon") || document.createElement("link")
      link.id = "dynamic-favicon"
      link.rel = "icon"
      link.href = canvas.toDataURL("image/png")
      document.head.appendChild(link)
    }
  }, [theme])

  return null
}
