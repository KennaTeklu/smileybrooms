"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Clock, CalendarIcon, ArrowRight, Check, X } from "lucide-react"
import { format } from "date-fns"

interface TimeSlot {
  time: string
  available: boolean
}

interface BookingTimelineProps {
  onDateSelected: (date: Date | undefined) => void
  onTimeSelected: (time: string) => void
  selectedDate?: Date
  selectedTime?: string
}

export function BookingTimeline({ onDateSelected, onTimeSelected, selectedDate, selectedTime }: BookingTimelineProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { time: "8:00 AM", available: true },
    { time: "9:00 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "12:00 PM", available: true },
    { time: "1:00 PM", available: true },
    { time: "2:00 PM", available: false },
    { time: "3:00 PM", available: true },
    { time: "4:00 PM", available: true },
    { time: "5:00 PM", available: false },
    { time: "6:00 PM", available: true },
  ])

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    onDateSelected(newDate)

    // Simulate different availability for different dates
    if (newDate) {
      const day = newDate.getDay()
      const newTimeSlots = [...timeSlots]

      // Make weekends have different availability
      if (day === 0 || day === 6) {
        newTimeSlots.forEach((slot, index) => {
          slot.available = index % 3 !== 0
        })
      } else {
        newTimeSlots.forEach((slot, index) => {
          slot.available = index % 4 !== 0
        })
      }

      setTimeSlots(newTimeSlots)
    }
  }

  const handleTimeSelection = (time: string) => {
    onTimeSelected(time)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Booking Timeline</CardTitle>
        <CardDescription>Select your preferred date and time for cleaning service</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Select Date</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              className="rounded-md border"
              disabled={{ before: new Date() }}
            />

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-gray-300 mr-1"></div>
                <span>Unavailable</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
                <span>Selected</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Select Time</h3>
            {date ? (
              <>
                <div className="mb-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    <span>{format(date, "EEEE, MMMM d, yyyy")}</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      disabled={!slot.available}
                      onClick={() => handleTimeSelection(slot.time)}
                      className="justify-start"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {slot.time}
                      {!slot.available && <X className="h-4 w-4 ml-auto text-gray-400" />}
                      {selectedTime === slot.time && <Check className="h-4 w-4 ml-auto" />}
                    </Button>
                  ))}
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  <p>* Cleaning sessions typically last 2-4 hours depending on service level and home size.</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] border rounded-md bg-gray-50">
                <CalendarIcon className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">Please select a date first</p>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Booking Summary</h3>

          {date && selectedTime ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{format(date, "EEEE, MMMM d, yyyy")}</p>
                </div>
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{selectedTime}</p>
                </div>
              </div>

              <div className="p-4 border rounded-md">
                <p className="text-sm text-gray-500">Estimated Duration</p>
                <p className="font-medium">3 hours (based on your selections)</p>
              </div>

              <Button className="w-full">
                Confirm Booking <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="p-4 border rounded-md bg-gray-50 text-center">
              <p className="text-gray-500">Select both date and time to see booking summary</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
