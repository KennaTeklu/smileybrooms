"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  const faqs = [
    {
      question: "What services do you offer?",
      answer:
        "We offer a wide range of cleaning services including regular home cleaning, deep cleaning, move-in/move-out cleaning, office cleaning, and specialized services like carpet cleaning, window cleaning, and more.",
    },
    {
      question: "How do you calculate pricing?",
      answer:
        "Our pricing is based on the number and types of rooms you need cleaned, as well as the frequency of service. You can get an instant quote using our price calculator, which takes into account all these factors.",
    },
    {
      question: "Are your cleaners insured and bonded?",
      answer:
        "Yes, all our cleaning professionals are fully insured and bonded. We also conduct thorough background checks on all our staff for your peace of mind.",
    },
    {
      question: "What cleaning products do you use?",
      answer:
        "We primarily use eco-friendly, non-toxic cleaning products that are safe for your family, pets, and the environment. If you have specific product preferences or allergies, please let us know.",
    },
    {
      question: "How do I schedule a cleaning service?",
      answer:
        "You can easily schedule a cleaning service through our website. Simply use our price calculator to get a quote, select your preferred date and time, and complete the booking process online.",
    },
    {
      question: "What if I'm not satisfied with the cleaning?",
      answer:
        "We offer a 100% satisfaction guarantee. If you're not completely satisfied with our service, contact us within 24 hours and we'll re-clean the areas you're unhappy with at no additional cost.",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Find answers to common questions about our cleaning services.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
