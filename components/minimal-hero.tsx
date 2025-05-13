import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface MinimalHeroProps {
  title?: string
  description?: string
  imageSrc?: string
  primaryAction?: {
    text: string
    href: string
  }
  secondaryAction?: {
    text: string
    href: string
  }
}

export function MinimalHero({
  title = "Professional Cleaning Services",
  description = "Experience the joy of coming home to a perfectly clean space.",
  imageSrc = "/professional-cleaning-service.png",
  primaryAction = { text: "Book Now", href: "/services" },
  secondaryAction = { text: "Learn More", href: "/about" },
}: MinimalHeroProps) {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900 py-12 md:py-24">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex flex-col space-y-4 md:space-y-6 md:w-1/2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              {title || "Professional Cleaning Services"}
            </h1>
            <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
              {description || "Experience the joy of coming home to a perfectly clean space."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {primaryAction && (
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={primaryAction.href || "/services"}>{primaryAction.text || "Book Now"}</Link>
                </Button>
              )}
              {secondaryAction && (
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href={secondaryAction.href || "/about"}>{secondaryAction.text || "Learn More"}</Link>
                </Button>
              )}
            </div>
          </div>
          <div className="relative w-full md:w-1/2 h-[300px] md:h-[400px] lg:h-[500px]">
            {imageSrc && (
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt="Professional Cleaning"
                fill
                className="object-cover rounded-lg"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
