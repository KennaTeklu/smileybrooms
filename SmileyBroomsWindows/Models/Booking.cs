namespace SmileyBroomsWindows.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public string ServiceName { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerPhone { get; set; }
        public string BookingDate { get; set; }
        public string BookingTime { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }
        public string CreatedAt { get; set; }
    }
}
