"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SalesCTA() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="py-16 bg-indigo-600 dark:bg-indigo-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-indigo-800 dark:to-indigo-950 opacity-90"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-400 dark:bg-indigo-700 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-300 dark:bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">Ready for a Spotless Home?</h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Book your cleaning service today and experience the smileybroom difference.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-indigo-700 hover:bg-indigo-50 group relative overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Link href="/pricing">
                  See Pricing & Book Now
                  <motion.span animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.2 }} className="ml-2">
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Link>
              </Button>
            </div>

            <p className="mt-6 text-indigo-200 text-sm">No credit card required. 100% satisfaction guaranteed.</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
