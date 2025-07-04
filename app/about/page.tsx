import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MissionVision } from "@/components/about/mission-vision"
import { OurStory } from "@/components/about/our-story"
import { CoreValues } from "@/components/about/core-values"
import { WhySmileyBrooms } from "@/components/about/why-smileybrooms"
import { Separator } from "@/components/ui/separator"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-10">About Us</h1>

      <div className="grid gap-10">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-center">Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <OurStory />
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-center">Mission & Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <MissionVision />
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-center">Our Core Values</CardTitle>
          </CardHeader>
          <CardContent>
            <CoreValues />
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-center">Why Choose SmileyBrooms?</CardTitle>
          </CardHeader>
          <CardContent>
            <WhySmileyBrooms />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
