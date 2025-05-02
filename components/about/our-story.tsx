import { Card, CardContent } from "@/components/ui/card"

export function OurStory() {
  return (
    <section className="h-full flex items-center justify-center bg-gradient-to-b from-primary/5 to-transparent py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <Card>
            <CardContent className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                <p>
                  smileybrooms was founded in 2015 with a simple but powerful idea: cleaning services should leave
                  everyone smiling—both the clients who enjoy a spotless space and the cleaning professionals who take
                  pride in their work.
                </p>
                <p>
                  What started as a small team of three dedicated cleaners has grown into a trusted cleaning service
                  with dozens of professionals serving hundreds of happy clients. Throughout our growth, we've remained
                  committed to our core values of quality, trust, and sustainability.
                </p>
                <p>
                  We named our company "smileybrooms" because we believe cleaning should be a positive experience that
                  brings joy. A clean space isn't just about appearance—it's about creating a healthy, comfortable
                  environment where you can thrive.
                </p>
                <p>
                  Today, we continue to innovate and improve our services, always with the goal of exceeding
                  expectations and leaving both homes and faces sparkling clean.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
