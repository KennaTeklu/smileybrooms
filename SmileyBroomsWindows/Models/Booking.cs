using System;

namespace SmileyBroomsWindows.Models
{
    public class Booking
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ServiceType { get; set; } = string.Empty;
        public DateTime ScheduledDate { get; set; } = DateTime.Now.AddDays(1);
        public string Address { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int RoomCount { get; set; } = 1;
        public int BathroomCount { get; set; } = 1;
        public bool DeepCleaning { get; set; }
        public string Notes { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = "Credit Card";
        public bool IsPaid { get; set; }
        public string CleanerId { get; set; } = string.Empty;
        public string CleanerName { get; set; } = string.Empty;
    }
}
