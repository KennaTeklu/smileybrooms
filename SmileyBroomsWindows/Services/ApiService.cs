using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SmileyBroomsWindows.Models;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SmileyBroomsWindows.Services
{
    public class ApiService
    {
        private readonly ILogger<ApiService> _logger;
        private readonly HttpClient _httpClient;

        public ApiService(
            ILogger<ApiService> logger,
            HttpClient httpClient)
        {
            _logger = logger;
            _httpClient = httpClient;
        }

        public async Task<bool> SyncBookingAsync(Booking booking)
        {
            try
            {
                _logger.LogInformation($"Syncing booking {booking.Id} with server");
                
                var json = JsonConvert.SerializeObject(booking);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync("bookings/sync", content);
                response.EnsureSuccessStatusCode();
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error syncing booking {booking.Id}");
                return false;
            }
        }

        public async Task<bool> DeleteBookingAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Deleting booking {id} from server");
                
                var response = await _httpClient.DeleteAsync($"bookings/{id}");
                response.EnsureSuccessStatusCode();
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting booking {id} from server");
                return false;
            }
        }

        public async Task<Service[]> GetServicesAsync()
        {
            try
            {
                _logger.LogInformation("Getting services from server");
                
                var response = await _httpClient.GetStringAsync("services");
                var services = JsonConvert.DeserializeObject<Service[]>(response);
                
                return services;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting services from server");
                return null;
            }
        }
    }
}
