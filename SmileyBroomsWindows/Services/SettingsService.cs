using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;

namespace SmileyBroomsWindows.Services
{
    public class SettingsService
    {
        private readonly ILogger<SettingsService> _logger;
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public SettingsService(
            ILogger<SettingsService> logger,
            IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public T GetSetting<T>(string key, T defaultValue = default)
        {
            try
            {
                // First check in database
                using (var connection = new SqliteConnection(_connectionString))
                {
                    connection.Open();
                    var command = connection.CreateCommand();
                    command.CommandText = "SELECT Value FROM Settings WHERE Key = @Key";
                    command.Parameters.AddWithValue("@Key", key);
                    
                    var result = command.ExecuteScalar();
                    if (result != null)
                    {
                        return (T)Convert.ChangeType(result, typeof(T));
                    }
                }

                // If not in database, check in configuration
                var value = _configuration[key];
                if (value != null)
                {
                    return (T)Convert.ChangeType(value, typeof(T));
                }

                return defaultValue;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting setting {key}");
                return defaultValue;
            }
        }

        public void SaveSetting<T>(string key, T value)
        {
            try
            {
                using (var connection = new SqliteConnection(_connectionString))
                {
                    connection.Open();
                    var command = connection.CreateCommand();
                    command.CommandText = @"
                        INSERT INTO Settings (Key, Value) 
                        VALUES (@Key, @Value)
                        ON CONFLICT(Key) DO UPDATE SET Value = @Value
                    ";
                    command.Parameters.AddWithValue("@Key", key);
                    command.Parameters.AddWithValue("@Value", value.ToString());
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error saving setting {key}");
                throw;
            }
        }
    }
}
