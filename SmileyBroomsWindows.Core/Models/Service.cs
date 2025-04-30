namespace SmileyBroomsWindows.Core.Models
{
    public class Service
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImagePath { get; set; } = string.Empty;
        public bool IsPopular { get; set; }
        public string Category { get; set; } = string.Empty;
        public int DurationMinutes { get; set; }
    }
}
