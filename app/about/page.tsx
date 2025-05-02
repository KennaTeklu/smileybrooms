import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Leaf, Award, Users } from "lucide-react"
import AccessibilityToolbar from "@/components/accessibility-toolbar"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Trust",
      description:
        "We build lasting relationships with our clients through honesty, reliability, and consistent quality.",
    },
    {
      icon: Shield,
      title: "Quality",
      description: "We're committed to excellence in every cleaning job, no matter how big or small.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "We use eco-friendly products and practices to protect your health and our planet.",
    },
    {
      icon: Award,
      title: "Professionalism",
      description: "Our trained and vetted cleaning specialists take pride in their work and attention to detail.",
    },
    {
      icon: Users,
      title: "Community",
      description: "We're proud to serve our local community and contribute to making homes healthier and happier.",
    },
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      bio: "With over 15 years in the cleaning industry, Sarah founded Smiley Brooms with a vision to transform the cleaning experience for both clients and cleaning professionals.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Michael Rodriguez",
      role: "Operations Manager",
      bio: "Michael ensures that every cleaning job is scheduled efficiently and completed to our high standards of quality.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Jennifer Lee",
      role: "Customer Experience Director",
      bio: "Jennifer is dedicated to making sure every client has an exceptional experience with Smiley Brooms.",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary/10 to-transparent py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">About Smiley Brooms</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We're on a mission to make cleaning a happy experience for everyone.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p>
                  Smiley Brooms was founded in 2015 with a simple but powerful idea: cleaning services should leave
                  everyone smiling—both the clients who enjoy a spotless space and the cleaning professionals who take
                  pride in their work.
                </p>
                <p>
                  What started as a small team of three dedicated cleaners has grown into a trusted cleaning service
                  with dozens of professionals serving hundreds of happy clients. Throughout our growth, we've remained
                  committed to our core values of quality, trust, and sustainability.
                </p>
                <p>
                  We named our company "Smiley Brooms" because we believe cleaning should be a positive experience that
                  brings joy. A clean space isn't just about appearance—it's about creating a healthy, comfortable
                  environment where you can thrive.
                </p>
                <p>
                  Today, we continue to innovate and improve our services, always with the goal of exceeding
                  expectations and leaving both homes and faces sparkling clean.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Mission & Vision</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Mission</h3>
                  <p className="text-lg">
                    To provide exceptional cleaning services that create healthier, happier spaces while treating our
                    team members with respect and offering sustainable career opportunities.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Vision</h3>
                  <p className="text-lg">
                    To transform the cleaning industry by setting new standards for quality, sustainability, and
                    customer satisfaction, one spotless space at a time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-primary/10 rounded-full mb-4">
                        <value.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Commitment</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">To Our Customers</h3>
                  <p>
                    We promise to deliver exceptional cleaning services that exceed your expectations. We respect your
                    home or office as if it were our own, using only the highest quality products and techniques.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">To Our Employees</h3>
                  <p>
                    We're committed to providing fair wages, comprehensive training, and opportunities for growth. Our
                    team members are the heart of our business, and we invest in their success and well-being.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">To Our Environment</h3>
                  <p>
                    We use eco-friendly cleaning products and sustainable practices whenever possible. We're constantly
                    researching and implementing new ways to reduce our environmental footprint.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">To Our Community</h3>
                  <p>
                    We actively participate in community initiatives and support local causes. We believe in giving back
                    to the communities that have helped us grow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why "Smiley"? */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Why "Smiley Brooms"?</h2>
              <div className="text-lg">
                <p>
                  Our name reflects our philosophy: cleaning should bring happiness. The "Smiley" represents the
                  satisfaction and joy that comes from a clean, healthy space. The "Brooms" symbolize our commitment to
                  traditional cleaning values combined with modern techniques.
                </p>
                <p className="mt-4">
                  We believe that when we leave your space spotless, it creates a ripple effect of positivity in your
                  life. That's why we're not just cleaning—we're creating smiles, one broom at a time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AccessibilityToolbar />
      <Footer />
    </div>
  )
}
