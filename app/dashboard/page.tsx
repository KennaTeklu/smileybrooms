import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Calendar,
  AlertTriangle,
  Mail,
  Play,
  Eye,
  MapPin,
  AlertCircle,
  Wrench,
  BookOpen,
  CalendarCheck,
  MessageSquare,
  ListChecks,
  DollarSign,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-2">Welcome back, Alice!</h1>
      <p className="text-muted-foreground mb-8">Your daily overview and quick actions.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Current Shift Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Current Shift
            </CardTitle>
            <Badge variant="secondary" className="bg-yellow-400 text-yellow-900">
              Scheduled
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Downtown Office</div>
            <p className="text-xs text-muted-foreground">09:00 AM - 01:00 PM</p>

            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <ListChecks className="h-4 w-4 text-muted-foreground" />
                  Tasks Completed
                </div>
                <span>5/12</span>
              </div>
              <Progress value={42} className="h-2" />
              <p className="text-xs text-muted-foreground">42% complete</p>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Estimated Earnings
                </div>
                <span className="font-bold">$85.00</span>
              </div>
              <p className="text-xs text-muted-foreground">For this shift</p>
            </div>

            <div className="flex gap-2 mt-6">
              <Button className="flex-1">
                <Play className="h-4 w-4 mr-2" /> Start Shift
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Eye className="h-4 w-4 mr-2" /> View Details
              </Button>
              <Button variant="outline" size="icon">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Shifts Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Next Shifts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-semibold">Tomorrow</div>
              <p className="text-sm text-muted-foreground">10:00 AM - Uptown Residence</p>
              <Button variant="link" className="p-0 h-auto text-sm">
                View
              </Button>
            </div>
            <div>
              <div className="font-semibold">Friday</div>
              <p className="text-sm text-muted-foreground">02:00 PM - Suburban Home</p>
              <Button variant="link" className="p-0 h-auto text-sm">
                View
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />1 urgent alert!
                <Button variant="link" className="p-0 h-auto text-sm text-red-600">
                  Review
                </Button>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <Mail className="h-4 w-4" />2 unread messages.
                <Button variant="link" className="p-0 h-auto text-sm text-yellow-600">
                  Go to Inbox
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card className="flex flex-col items-center justify-center p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <AlertCircle className="h-8 w-8 mb-2 text-primary" />
          <span className="text-sm font-medium">Report Hazard</span>
        </Card>
        <Card className="flex flex-col items-center justify-center p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <Wrench className="h-8 w-8 mb-2 text-primary" />
          <span className="text-sm font-medium">Request Supplies</span>
        </Card>
        <Card className="flex flex-col items-center justify-center p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <BookOpen className="h-8 w-8 mb-2 text-primary" />
          <span className="text-sm font-medium">View Training</span>
        </Card>
        <Card className="flex flex-col items-center justify-center p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <CalendarCheck className="h-8 w-8 mb-2 text-primary" />
          <span className="text-sm font-medium">Request PTO</span>
        </Card>
        <Card className="flex flex-col items-center justify-center p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <MessageSquare className="h-8 w-8 mb-2 text-primary" />
          <span className="text-sm font-medium">Message Manager</span>
        </Card>
      </div>
    </div>
  )
}
