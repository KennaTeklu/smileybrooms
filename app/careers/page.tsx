/* Don't modify beyond what is requested ever. */
"use client"
import { useRouter } from "next/navigation"
import AccessibilityToolbar from "@/components/accessibility-toolbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCheck, Users, Star, Heart, Clock, MapPin } from "lucide-react"

export default function CareersPage() {
  const router = useRouter()

  const benefits = [
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Flexible Scheduling",
      description: "Choose shifts that work for your lifestyle",
    },
    {
      icon: <CheckCheck className="h-6 w-6 text-primary" />,
      title: "Competitive Pay",
      description: "Earn a fair wage plus tips and bonuses",
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Supportive Team",
      description: "Join a collaborative, positive work environment",
    },
    {
      icon: <Star className="h-6 w-6 text-primary" />,
      title: "Growth Opportunities",
      description: "Clear pathways for career advancement",
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Health Benefits",
      description: "Medical, dental, and vision insurance options",
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Local Jobs",
      description: "Work in your community with minimal travel",
    },
  ]

  const openPositions = [
    {
      title: "Professional Cleaner",
      slug: "professional-cleaner",
      location: "Multiple Locations",
      type: "Full-time / Part-time",
      description:
        "Join our team of cleaning professionals providing exceptional service to homes and businesses. Experience preferred but not required - we offer comprehensive training.",
    },
    {
      title: "Team Lead",
      slug: "team-lead",
      location: "Sparkle City, SC",
      type: "Full-time",
      description:
        "Lead a team of cleaners while ensuring quality standards and client satisfaction. Minimum 1 year cleaning experience required.",
    },
    {
      title: "Customer Service Representative",
      slug: "customer-service-representative",
      location: "Remote",
      type: "Full-time",
      description:
        "Be the friendly voice of Smiley Brooms, handling customer inquiries, scheduling, and ensuring client satisfaction.",
    },
    {
      title: "Operations Manager",
      slug: "operations-manager",
      location: "Sparkle City, SC",
      type: "Full-time",
      description:
        "Oversee daily operations, staff scheduling, and logistics to ensure smooth service delivery and team success.",
    },
  ]

  const handleApplyNow = (positionSlug: string) => {
    router.push(`/careers/${positionSlug}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/10 to-transparent py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Build your career with a company that values quality, integrity, and employee satisfaction.
            </p>
          </div>
        </div>

        {/* Why Work With Us */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">Why Work With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-primary/10 rounded-full mb-4">{benefit.icon}</div>
                      <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">Open Positions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {openPositions.map((position, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{position.title}</CardTitle>
                    <CardDescription className="flex flex-col sm:flex-row sm:justify-between">
                      <span>{position.location}</span>
                      <span>{position.type}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{position.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => handleApplyNow(position.slug)}>
                      Apply Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <AccessibilityToolbar />
    </div>
  )
}
