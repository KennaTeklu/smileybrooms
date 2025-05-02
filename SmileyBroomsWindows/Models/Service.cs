using System;
using System.Collections.Generic;

namespace SmileyBroomsWindows.Models
{
    public class Service
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public List<string> Inclusions { get; set; } = new List<string>();
        public List<string> Exclusions { get; set; } = new List<string>();
        public TimeSpan EstimatedDuration { get; set; } = TimeSpan.FromHours(2);
        public bool IsPopular { get; set; }
        public string Category { get; set; } = "Residential";
    }
}
