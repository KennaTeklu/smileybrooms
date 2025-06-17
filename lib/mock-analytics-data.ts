import { format, subDays } from "date-fns"

export interface DailyMetrics {
  date: string
  pageViews: number
  uniqueVisitors: number
  bookings: number
  feedbackSubmissions: number
}

export const generateMockAnalyticsData = (days = 30): DailyMetrics[] => {
  const data: DailyMetrics[] = []
  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), days - 1 - i)
    data.push({
      date: format(date, "MMM dd"),
      pageViews: Math.floor(Math.random() * 500) + 100,
      uniqueVisitors: Math.floor(Math.random() * 200) + 50,
      bookings: Math.floor(Math.random() * 20) + 1,
      feedbackSubmissions: Math.floor(Math.random() * 10) + 0,
    })
  }
  return data
}

export const mockOverviewMetrics = {
  totalPageViews: 12500,
  totalUniqueVisitors: 4800,
  totalBookings: 350,
  totalFeedbackSubmissions: 85,
  conversionRate: "7.3%",
  averageSessionDuration: "3:45 min",
}
