"use client"

import { useEffect, useRef } from "react"

export default function FaviconGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#3b82f6") // blue-500
    gradient.addColorStop(1, "#4f46e5") // indigo-600

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

    // Generate favicon link
    const link = document.querySelector("link[rel*='icon']") || document.createElement("link")
    link.setAttribute("rel", "shortcut icon")
    link.setAttribute("href", canvas.toDataURL("image/png"))
    document.getElementsByTagName("head")[0].appendChild(link)
  }, [])

  return <canvas ref={canvasRef} width={64} height={64} style={{ display: "none" }} aria-hidden="true" />
}
