import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Github, BellIcon as Vercel } from "lucide-react"
import Link from "next/link"

export default function DownloadPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl text-center shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg py-8">
          <Download className="mx-auto h-20 w-20 mb-4" />
          <CardTitle className="text-4xl font-bold">Download Your Project</CardTitle>
          <CardDescription className="text-blue-100">Get your generated code and deploy it anywhere.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Your v0 project is ready! You can download the code directly or deploy it to Vercel.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button size="lg" className="w-full py-3 text-lg bg-green-600 hover:bg-green-700">
              <Download className="mr-2 h-5 w-5" /> Download Code (ZIP)
            </Button>
            <Link href="https://vercel.com/new/git" target="_blank" rel="noopener noreferrer" passHref>
              <Button
                size="lg"
                variant="outline"
                className="w-full py-3 text-lg border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 bg-transparent"
              >
                <Vercel className="mr-2 h-5 w-5" /> Deploy to Vercel
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <h3 className="text-xl font-semibold">Integrate with Git</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Push your code to a GitHub repository to manage versions and collaborate.
            </p>
            <Link href="https://github.com/new" target="_blank" rel="noopener noreferrer" passHref>
              <Button variant="outline" className="w-full py-3 text-lg bg-transparent">
                <Github className="mr-2 h-5 w-5" /> Create GitHub Repository
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <h3 className="text-xl font-semibold">Need Help?</h3>
            <p className="text-gray-600 dark:text-gray-400">
              If you encounter any issues or have questions, our support team is here to assist you.
            </p>
            <Link href="/contact" passHref>
              <Button variant="link" className="w-full text-lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
