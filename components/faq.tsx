"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  const FAQ_ITEMS = [
    {
      question: "How do I schedule a cleaning service?",
      answer:
        "You can schedule a cleaning service by visiting our booking page or calling our customer service. We offer flexible scheduling options to fit your needs.",
    },
    {
      question: "What cleaning products do you use?",
      answer:
        "We use eco-friendly, non-toxic cleaning products that are safe for your family and pets. If you have specific product preferences or allergies, please let us know.",
    },
    {
      question: "How long does a typical cleaning service take?",
      answer:
        "The duration depends on the size of your home and the type of service. A standard cleaning for a 2-bedroom home typically takes 2-3 hours, while deep cleaning may take 4-5 hours.",
    },
    {
      question: "Do I need to be home during the cleaning?",
      answer:
        "No, you don't need to be home. Many of our clients provide a key or access code. We ensure all our staff are background-checked and trustworthy.",
    },
    {
      question: "What's your cancellation policy?",
      answer:
        "We require 24 hours notice for cancellations. Cancellations made with less than 24 hours notice may be subject to a cancellation fee.",
    },
  ]

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Find answers to common questions about our cleaning services.
          </p>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
