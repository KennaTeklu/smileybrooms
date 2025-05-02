using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using SmileyBroomsWindows.Models;
using System.Linq;

namespace SmileyBroomsWindows.Services
{
    public class BookingService
    {
        private readonly ApiService _apiService;
        private readonly NotificationService _notificationService;

        public BookingService(ApiService apiService, NotificationService notificationService)
        {
            _apiService = apiService;
            _notificationService = notificationService;
        }

        public async Task<List<Booking>> GetUserBookingsAsync()
        {
            try
            {
                var response = await _apiService.GetAsync("bookings");
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<List<Booking>>(content) ?? new List<Booking>();
                }
                return new List<Booking>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting bookings: {ex.Message}");
                return new List<Booking>();
            }
        }

        public async Task<bool> CreateBookingAsync(Booking booking)
        {
            try
            {
                var json = JsonConvert.SerializeObject(booking);
                var response = await _apiService.PostAsync("bookings", json);
                
                if (response.IsSuccessStatusCode)
                {
                    _notificationService.ShowNotification("Booking Created", 
                        $"Your booking for {booking.ServiceType} on {booking.ScheduledDate.ToShortDateString()} has been created.");
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating booking: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> CancelBookingAsync(string bookingId)
        {
            try
            {
                var response = await _apiService.DeleteAsync($"bookings/{bookingId}");
                
                if (response.IsSuccessStatusCode)
                {
                    _notificationService.ShowNotification("Booking Cancelled", 
                        "Your booking has been cancelled successfully.");
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error cancelling booking: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> RescheduleBookingAsync(string bookingId, DateTime newDate)
        {
            try
            {
                var json = JsonConvert.SerializeObject(new { scheduledDate = newDate });
                var response = await _apiService.PutAsync($"bookings/{bookingId}", json);
                
                if (response.IsSuccessStatusCode)
                {
                    _notificationService.ShowNotification("Booking Rescheduled", 
                        $"Your booking has been rescheduled to {newDate.ToShortDateString()}.");
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error rescheduling booking: {ex.Message}");
                return false;
            }
        }

        public List<DateTime> GetAvailableTimeSlots(DateTime date)
        {
            // This would normally call an API, but for demo purposes we'll generate some slots
            var slots = new List<DateTime>();
            var startTime = new DateTime(date.Year, date.Month, date.Day, 8, 0, 0);
            
            for (int i = 0; i < 16; i++) // 8 AM to 4 PM, every 30 minutes
            {
                slots.Add(startTime.AddMinutes(i * 30));
            }
            
            // Randomly remove some slots to simulate unavailability
            var random = new Random();
            var slotsToRemove = random.Next(1, 5);
            
            for (int i = 0; i < slotsToRemove; i++)
            {
                var indexToRemove = random.Next(0, slots.Count);
                slots.RemoveAt(indexToRemove);
            }
            
            return slots;
        }
    }
}
