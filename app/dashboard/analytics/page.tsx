"use client"

import { CartHealthDashboard } from "@/components/cart-health-dashboard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useTranslations } from "next-intl"

export default function AnalyticsDashboardPage() {
  const t = useTranslations("AnalyticsDashboard")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <p className="text-muted-foreground mb-8">{t("description")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cart Health Dashboard */}
        <div className="md:col-span-1 lg:col-span-1">
          <CartHealthDashboard />
        </div>

        {/* Placeholder for Form Submission Trends */}
        <Card className="md:col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>{t("formSubmissions.title")}</CardTitle>
            <CardDescription>{t("formSubmissions.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              {t("formSubmissions.placeholder")}
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for User Engagement */}
        <Card className="md:col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>{t("userEngagement.title")}</CardTitle>
            <CardDescription>{t("userEngagement.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              {t("userEngagement.placeholder")}
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for Revenue Overview */}
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("revenueOverview.title")}</CardTitle>
            <CardDescription>{t("revenueOverview.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              {t("revenueOverview.placeholder")}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
