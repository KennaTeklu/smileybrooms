import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DownloadButton } from "@/components/download-button"
import { Shield, CheckCircle, AlertTriangle } from "lucide-react"

export default function WindowsDownloadPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Download Smiley Brooms for Windows</h1>

      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-6 w-6 text-blue-500" />
              About Windows Security Warnings
            </CardTitle>
            <CardDescription>Why you might see security warnings and how to safely install our app</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              When downloading and installing applications from the internet, Windows Defender SmartScreen may display
              security warnings. This is a normal security feature of Windows that helps protect your computer.
            </p>

            <h3 className="text-lg font-semibold mb-2">Why does this happen?</h3>
            <p className="mb-4">Windows shows these warnings for applications that:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Are newly published and haven't established a reputation yet</li>
              <li>Aren't downloaded frequently enough to be automatically trusted</li>
              <li>Aren't signed with an Extended Validation (EV) Code Signing Certificate</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">Is the Smiley Brooms app safe?</h3>
            <p className="mb-4">Yes! Our application is:</p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                <span>Digitally signed with a trusted code signing certificate</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                <span>Regularly scanned for viruses and malware</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                <span>Built with security best practices</span>
              </li>
            </ul>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
              <div className="flex">
                <AlertTriangle className="h-6 w-6 text-amber-500 mr-2" />
                <div>
                  <h4 className="font-semibold text-amber-800">How to install safely</h4>
                  <p className="text-amber-700">
                    If you see a warning, you can safely proceed by clicking "More info" and then "Run anyway" to
                    install our application.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <DownloadButton platform="windows" className="w-full md:w-auto text-lg py-3 px-8" variant="default">
              Download for Windows
            </DownloadButton>
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>
            By downloading, you agree to our{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
          <p className="mt-2">Version 1.0.0 | Released April 30, 2023</p>
        </div>
      </div>
    </div>
  )
}
