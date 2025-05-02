using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using SmileyBroomsWindows.Models;

namespace SmileyBroomsWindows.Services
{
    public class CleaningService
    {
        private readonly ApiService _apiService;

        public CleaningService(ApiService apiService)
        {
            _apiService = apiService;
        }

        public async Task<List<Service>> GetServicesAsync()
        {
            try
            {
                var response = await _apiService.GetAsync("services");
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<List<Service>>(content) ?? new List<Service>();
                }
                return GetDefaultServices(); // Fallback to default services if API fails
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting services: {ex.Message}");
                return GetDefaultServices();
            }
        }

        public async Task<Service> GetServiceDetailsAsync(string serviceId)
        {
            try
            {
                var response = await _apiService.GetAsync($"services/{serviceId}");
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<Service>(content) ?? new Service();
                }
                return GetDefaultServices().Find(s => s.Id == serviceId) ?? new Service();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting service details: {ex.Message}");
                return GetDefaultServices().Find(s => s.Id == serviceId) ?? new Service();
            }
        }

        public decimal CalculatePrice(string serviceType, int roomCount, int bathroomCount, bool deepCleaning)
        {
            var basePrice = serviceType switch
            {
                "Regular Cleaning" => 80.0m,
                "Deep Cleaning" => 120.0m,
                "Move-in/Move-out" => 150.0m,
                "Post-Construction" => 180.0m,
                _ => 80.0m
            };

            var roomPrice = roomCount * 15.0m;
            var bathroomPrice = bathroomCount * 20.0m;
            var deepCleaningMultiplier = deepCleaning ? 1.5m : 1.0m;

            return (basePrice + roomPrice + bathroomPrice) * deepCleaningMultiplier;
        }

        private List<Service> GetDefaultServices()
        {
            return new List<Service>
            {
                new Service
                {
                    Id = "1",
                    Name = "Regular Cleaning",
                    Description = "Our standard cleaning service includes dusting, vacuuming, mopping, and sanitizing of all surfaces.",
                    BasePrice = 80.0m,
                    ImageUrl = "/Assets/Images/regular-cleaning.jpg"
                },
                new Service
                {
                    Id = "2",
                    Name = "Deep Cleaning",
                    Description = "A thorough cleaning that reaches deep into the corners and crevices, perfect for seasonal cleaning.",
                    BasePrice = 120.0m,
                    ImageUrl = "/Assets/Images/deep-cleaning.jpg"
                },
                new Service
                {
                    Id = "3",
                    Name = "Move-in/Move-out",
                    Description = "Prepare your new home or leave your old one spotless with our comprehensive cleaning service.",
                    BasePrice = 150.0m,
                    ImageUrl = "/Assets/Images/move-in-out.jpg"
                },
                new Service
                {
                    Id = "4",
                    Name = "Post-Construction",
                    Description = "Clean up after construction or renovation with our specialized cleaning service.",
                    BasePrice = 180.0m,
                    ImageUrl = "/Assets/Images/post-construction.jpg"
                }
            };
        }
    }
}
