import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Mail, Sparkles, Star } from "lucide-react"

export default function DownloadPage() {
  return (
    <div className="container max-w-6xl py-12 px-4 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Coming Soon</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're working hard to bring you our new download center. Sign up to be notified when it's ready.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
        <Card>
          <CardHeader>
            <Sparkles className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Premium Resources</CardTitle>
            <CardDescription>Access professional cleaning guides and checklists</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Our downloadable resources are designed by cleaning experts to help you maintain a spotless home.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Clock className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>We're putting the finishing touches on our download center</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Our team is working diligently to create valuable resources that will enhance your cleaning experience.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Star className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Early Access</CardTitle>
            <CardDescription>Be the first to know when we launch</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Sign up for our newsletter to receive early access to our premium cleaning resources and guides.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Get Notified</CardTitle>
          <CardDescription>We'll let you know when our download center is ready</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Input type="email" placeholder="Enter your email" />
            </div>
            <Button type="submit" className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Subscribe for Updates
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          We respect your privacy. Unsubscribe at any time.
        </CardFooter>
      </Card>
    </div>
  )
}
