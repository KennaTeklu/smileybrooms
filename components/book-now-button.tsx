"use client"

import { useState, useEffect } from "react"
import { motion, useSpring } from "framer-motion"
import { CalendarCheck, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const downloadVCardAndCall = () => {
  // Create vCard data
  const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:smileybrooms.com cleaning services
ORG:Smiley Brooms
TEL:+16616023000
URL:https://smileybrooms.com
EMAIL:smileybrooms@gmail.com
NOTE:Professional cleaning services - Always accessible and flexible for your needs
END:VCARD`

  // Create and download vCard
  const blob = new Blob([vCardData], { type: "text/vcard" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "smileybrooms-cleaning-services.vcf"
  link.style.display = "none"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)

  // Simultaneously initiate phone call
  window.location.href = "tel:+16616023000"
}

export default function BookNowButton() {
  const [scrollY, setScrollY] = useState(0)

  // Smooth scroll position with spring physics
  const smoothScrollY = useSpring(0, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  })

  // Track scroll position with smooth animation
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      smoothScrollY.set(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [smoothScrollY])

  return (
    <motion.div
      className="fixed right-4 z-40 flex flex-col gap-2"
      style={{
        bottom: 20,
        opacity: scrollY > 100 ? 1 : 0.8,
        scale: scrollY > 100 ? 1 : 0.95,
        transition: "opacity 0.3s ease, scale 0.3s ease",
      }}
    >
      <Link href="/pricing">
        <Button
          size="lg"
          className="rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-6"
        >
          <CalendarCheck className="mr-2 h-5 w-5" />
          Book Now
        </Button>
      </Link>

      <Button
        size="lg"
        onClick={downloadVCardAndCall}
        className="rounded-full shadow-lg bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-6 py-6"
      >
        <Phone className="mr-2 h-5 w-5" />
        Call Now
      </Button>
    </motion.div>
  )
}
