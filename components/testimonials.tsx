/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Homeowner",
    content:
      "Smiley Brooms transformed my home! Their attention to detail is incredible, and my house has never looked better. The team is professional, thorough, and always on time.",
    avatar: "/professional-woman-smiling-headshot.png",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Business Owner",
    content:
      "We've been using Smiley Brooms for our office cleaning for 6 months now, and the difference is remarkable. Our workspace is always spotless, and their team is respectful of our equipment and privacy.",
    avatar: "/asian-man-professional-headshot.png",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Apartment Resident",
    content:
      "As someone with allergies, finding a cleaning service that uses eco-friendly products was essential. Smiley Brooms not only uses safe products but leaves my apartment smelling fresh without harsh chemicals.",
    avatar: "/placeholder.svg?key=fnodm",
    rating: 4,
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Real Estate Agent",
    content:
      "I recommend Smiley Brooms to all my clients for move-in/move-out cleanings. They make properties show-ready and have helped me close deals faster with their impeccable service.",
    avatar: "/professional-man-suit-headshot.png",
    rating: 5,
  },
  {
    id: 5,
    name: "Lisa Patel",
    role: "Working Parent",
    content:
      "With two kids and a full-time job, I was struggling to keep up with housework. Smiley Brooms has given me back my weekends and peace of mind. Worth every penny!",
    avatar: "/indian-woman-professional-headshot.png",
    rating: 5,
  },
]

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 2,
          spacing: 16,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 3,
          spacing: 24,
        },
      },
    },
    created() {
      setLoaded(true)
    },
  })

  useEffect(() => {
    if (inView && instanceRef.current) {
      // Auto-advance slides every 5 seconds when in view
      const interval = setInterval(() => {
        if (instanceRef.current) {
          instanceRef.current.next()
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [inView, instanceRef])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          className="text-center mb-12"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h2 className="text-3xl font-bold mb-4" variants={itemVariants}>
            What Our Customers Say
          </motion.h2>
          <motion.p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" variants={itemVariants}>
            Don't just take our word for it. Here's what our satisfied customers have to say about our cleaning
            services.
          </motion.p>
        </motion.div>

        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="keen-slider__slide">
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <blockquote className="text-gray-700 dark:text-gray-300">"{testimonial.content}"</blockquote>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{testimonial.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>

          {loaded && instanceRef.current && (
            <div className="flex justify-center mt-6 gap-2">
              {[...Array(instanceRef.current.track.details.slides.length).keys()].map((idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    instanceRef.current?.moveToIdx(idx)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === idx ? "bg-primary w-4" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
