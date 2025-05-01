import { Card, CardContent } from "@/components/ui/card"

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Commitment to Quality</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            As a new startup, we're dedicated to providing exceptional cleaning services that will exceed your
            expectations.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-2">Personalized Service</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We take the time to understand your specific cleaning needs and preferences to deliver a customized
                experience.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-2">Attention to Detail</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We believe the little things matter. Our thorough approach ensures no corner goes uncleaned.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-2">Transparent Pricing</h3>
              <p className="text-gray-600 dark:text-gray-400">
                No hidden fees or surprises. Our straightforward pricing makes it easy to know exactly what you're
                paying for.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
