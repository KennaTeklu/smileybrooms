import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      title: "Regular Cleaning",
      description: "Maintain a consistently clean home with our regular cleaning service.",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Dusting all surfaces", "Vacuuming and mopping floors", "Bathroom cleaning", "Kitchen cleaning"],
      price: "From $99",
      link: "/services/regular-cleaning",
    },
    {
      title: "Deep Cleaning",
      description: "A thorough cleaning of your entire home, from ceiling to floor.",
      image: "/placeholder.svg?height=300&width=400",
      features: [
        "All regular cleaning tasks",
        "Inside cabinets and drawers",
        "Baseboards and door frames",
        "Window sills and tracks",
      ],
      price: "From $199",
      link: "/services/deep-cleaning",
    },
    {
      title: "Move In/Out Cleaning",
      description: "Start fresh in your new home or leave your old one spotless.",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Deep cleaning of all rooms", "Inside appliances", "Cabinet and drawer cleaning", "Window cleaning"],
      price: "From $249",
      link: "/services/move-in-out",
    },
    {
      title: "Office Cleaning",
      description: "Keep your workspace clean, healthy, and professional.",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Desk and surface sanitizing", "Floor cleaning", "Break room cleaning", "Restroom sanitizing"],
      price: "From $149",
      link: "/services/office-cleaning",
    },
    {
      title: "Carpet Cleaning",
      description: "Revitalize your carpets and remove deep-seated dirt and stains.",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Hot water extraction", "Stain treatment", "Deodorizing", "Quick drying process"],
      price: "From $99",
      link: "/services/carpet-cleaning",
    },
    {
      title: "Window Cleaning",
      description: "Crystal clear windows that let in more light and improve your view.",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Interior and exterior cleaning", "Screen cleaning", "Track and sill cleaning", "Streak-free finish"],
      price: "From $79",
      link: "/services/window-cleaning",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/10 to-transparent py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Our Cleaning Services</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We offer a wide range of professional cleaning services to meet your needs. From regular maintenance to
              specialized cleaning, we've got you covered.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="overflow-hidden flex flex-col h-full">
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-primary">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xl font-bold">{service.price}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={service.link}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Need a Custom Cleaning Solution?</h2>
            <p className="mb-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We understand that every space is unique. Contact us for a customized cleaning plan tailored to your
              specific needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/calculator">Calculate Your Price</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
