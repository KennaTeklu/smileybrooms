import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HardDrive, Download, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

export function WindowsDownloadInstructions() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <HardDrive className="mr-2 h-6 w-6 text-blue-500" />
          Install to C:\ Drive Instructions
        </CardTitle>
        <CardDescription>Follow these steps to install Smiley Brooms to your C:\ drive</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
            <div className="flex">
              <AlertTriangle className="h-6 w-6 text-amber-500 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800">Important Note</h4>
                <p className="text-amber-700">
                  Modern browsers typically download files to your Downloads folder by default. You'll need to manually
                  move the installer to your C:\ drive after downloading.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Step 1: Download the Installer</h3>
            <p className="mb-2">Click the download button on the previous page to download the installer.</p>
            <div className="border rounded-md p-4 bg-gray-50">
              <div className="flex items-center">
                <Download className="h-5 w-5 text-blue-500 mr-2" />
                <span className="font-medium">SmileyBrooms_Setup.exe</span>
                <span className="ml-auto text-sm text-gray-500">25.4 MB</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Step 2: Move to C:\ Drive</h3>
            <p className="mb-2">After downloading, move the installer to your C:\ drive:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Open File Explorer</li>
              <li>Navigate to your Downloads folder</li>
              <li>
                Find <span className="font-mono bg-gray-100 px-1 rounded">SmileyBrooms_Setup.exe</span>
              </li>
              <li>Cut the file (Ctrl+X)</li>
              <li>Navigate to C:\ drive</li>
              <li>Paste the file (Ctrl+V)</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Step 3: Run the Installer</h3>
            <p className="mb-2">Run the installer from your C:\ drive:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Double-click <span className="font-mono bg-gray-100 px-1 rounded">SmileyBrooms_Setup.exe</span>
              </li>
              <li>If prompted by User Account Control, click "Yes"</li>
              <li>Follow the on-screen instructions to complete installation</li>
              <li>When asked for installation location, keep the default C:\Smiley Brooms</li>
            </ol>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <div className="flex">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-800">Installation Complete</h4>
                <p className="text-green-700">
                  After installation, you can launch Smiley Brooms from your desktop or Start menu. The application will
                  be installed in C:\Smiley Brooms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/windows-download" className="w-full">
          <Button className="w-full">
            <Download className="mr-2 h-5 w-5" />
            Return to Download Page
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
