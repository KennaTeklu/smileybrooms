import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Users, Star } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/professional-woman-smiling-headshot.png",
      bio: "Sarah founded SmileyBrooms with a vision to transform the cleaning industry through quality service and employee satisfaction.",
    },
    {
      name: "Michael Chen",
      role: "Operations Director",
      image: "/asian-man-professional-headshot.png",
      bio: "Michael oversees all cleaning operations, ensuring our high standards are consistently met across all services.",
    },
    {
      name: "David Williams",
      role: "Customer Experience Manager",
      image: "/professional-man-suit-headshot.png",
      bio: "David leads our customer service team, dedicated to ensuring every client has an exceptional experience.",
    },
    {
      name: "Priya Patel",
      role: "Training Specialist",
      image: "/indian-woman-professional-headshot.png",
      bio: "Priya develops our comprehensive training programs, ensuring every cleaner delivers consistent, high-quality service.",
    },
  ]

  const values = [
    {
      title: "Quality First",
      description:
        "We never compromise on the quality of our cleaning services, using premium products and thorough techniques.",
    },
    {
      title: "Reliability",
      description: "We show up on time, every time, and deliver exactly what we promise.",
    },
    {
      title: "Transparency",
      description: "Clear pricing, honest communication, and no hidden fees or surprises.",
    },
    {
      title: "Sustainability",
      description: "We use eco-friendly products and practices whenever possible to minimize our environmental impact.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About SmileyBrooms</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          We're on a mission to make cleaning a happy experience for everyone.
        </p>
      </div>

      {/* Our Story */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <Badge className="mb-4">Our Story</Badge>
          <h2 className="text-3xl font-bold mb-4">Bringing Smiles Through Cleanliness</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            SmileyBrooms was founded in 2018 with a simple mission: to transform the cleaning industry by providing
            exceptional service while creating happy experiences for both customers and employees.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            What started as a small team of three dedicated cleaners has grown into a thriving company serving thousands
            of satisfied customers across multiple cities. Our growth is built on our unwavering commitment to quality,
            reliability, and customer satisfaction.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            We believe that a clean space contributes significantly to wellbeing and productivity. That's why we
            approach each cleaning job with care, attention to detail, and a commitment to excellence.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="/professional-cleaning-team.png"
            alt="SmileyBrooms professional cleaning team"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <Badge className="mb-2">Our Values</Badge>
          <h2 className="text-3xl font-bold">What We Stand For</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Our Team */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <Badge className="mb-2">Our Team</Badge>
          <h2 className="text-3xl font-bold">Meet The People Behind SmileyBrooms</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index}>
              <CardContent className="pt-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-primary mb-2">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 mb-16">
        <div className="text-center mb-8">
          <Badge className="mb-2">Why Choose Us</Badge>
          <h2 className="text-3xl font-bold">The SmileyBrooms Difference</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">100% Satisfaction Guarantee</h3>
              <p className="text-gray-600 dark:text-gray-400">
                If you're not completely satisfied, we'll re-clean at no additional cost.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Vetted Professionals</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All our cleaners undergo thorough background checks and extensive training.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">5-Star Service</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We maintain a 4.9/5 rating across all review platforms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Experience the SmileyBrooms Difference?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          Book your first cleaning service today and see why thousands of customers trust us with their homes.
        </p>
        <Button asChild size="lg">
          <Link href="/pricing">Get Started</Link>
        </Button>
      </div>
    </div>
  )
}
