"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"
import { motion } from "framer-motion"

export default function CallToAction() {
  return (
    <section className="py-12 md:py-20 bg-blue-600 text-white">
      <div className="container mx-auto px-4 max-w-6xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for a Sparkling Clean Home?</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Book your professional cleaning service today and experience the Smiley Brooms difference!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              <Link href="/pricing">
                Book Your Clean
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg bg-transparent"
            >
              <Link href="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Link>
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-80">
            Or email us at{" "}
            <a href="mailto:info@smileybrooms.com" className="underline hover:no-underline">
              info@smileybrooms.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
