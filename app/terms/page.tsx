import { generateTerms } from "@/lib/legal/terms-generator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TermsPageProps {
  searchParams: {
    service?: "standard" | "deep_clean" | "move_out" | "commercial"
    location?: string
  }
}

export default function TermsPage({ searchParams }: TermsPageProps) {
  const service = searchParams.service || "standard"
  const location = searchParams.location || "CA"

  const termsContent = generateTerms({
    service,
    location,
    date: new Date().toLocaleDateString(),
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Terms of Service</CardTitle>
          <p className="text-muted-foreground">
            Service: {service.replace("_", " ")} | Location: {location}
          </p>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: termsContent.replace(/\n/g, "<br>").replace(/## /g, "<h2>").replace(/# /g, "<h1>"),
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
