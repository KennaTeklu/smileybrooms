"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { History } from "lucide-react"
import { motion } from "framer-motion"

export default function OurStory() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Image
              src="/professional-cleaning-team.png"
              alt="Smiley Brooms Cleaning Team"
              width={600}
              height={400}
              className="rounded-lg shadow-xl object-cover w-full h-auto"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                  <History className="h-8 w-8 text-blue-600" />
                  Our Story
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  From a humble beginning to a trusted name in cleaning.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Smiley Brooms began with a simple idea: to bring joy and sparkle back into people's lives through
                  impeccable cleaning services. Founded in [Year], our journey started with a small team of passionate
                  cleaners dedicated to transforming spaces and exceeding expectations.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Over the years, we've grown, but our core values remain the same: a commitment to quality,
                  reliability, and customer happiness. We believe a clean environment contributes to a happy life, and
                  we take pride in being a part of that.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Today, Smiley Brooms is a trusted name, serving countless homes and businesses with our professional
                  and eco-friendly cleaning solutions. We're more than just cleaners; we're a team dedicated to making
                  your world a little brighter, one clean space at a time.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
