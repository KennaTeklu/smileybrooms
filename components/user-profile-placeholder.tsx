import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UserProfilePlaceholder() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-500">User profiles are not available in this version.</p>
      </CardContent>
    </Card>
  )
}
