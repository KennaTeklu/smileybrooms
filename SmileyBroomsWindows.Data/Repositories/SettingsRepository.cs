using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmileyBroomsWindows.Data.Repositories
{
    public class SettingsRepository
    {
        private readonly string _connectionString;
        private readonly ILogger<SettingsRepository> _logger;

        public SettingsRepository(string connectionString, ILogger<SettingsRepository> logger)
        {
            _connectionString = connectionString;
            _logger = logger;
        }

        public async Task<string> GetSettingAsync(string key)
        {
            try
            {
                using (var connection = new SqliteConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "SELECT Value FROM Settings WHERE Key = @Key";
                        command.Parameters.AddWithValue("@Key", key);

                        var result = await command.ExecuteScalarAsync();
                        return result?.ToString() ?? string.Empty;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving setting with key {Key}", key);
                throw;
            }
        }

        public async Task<Dictionary<string, string>> GetAllSettingsAsync()
        {
            var settings = new Dictionary<string, string>();

            try
            {
                using (var connection = new SqliteConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "SELECT Key, Value FROM Settings";

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                settings[reader.GetString(0)] = reader.GetString(1);
                            }
                        }
                    }
                }

                return settings;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all settings");
                throw;
            }
        }

        public async Task SaveSettingAsync(string key, string value)
        {
            try
            {
                using (var connection = new SqliteConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = @"
                            INSERT OR REPLACE INTO Settings (Key, Value)
                            VALUES (@Key, @Value)";
                        command.Parameters.AddWithValue("@Key", key);
                        command.Parameters.AddWithValue("@Value", value);

                        await command.ExecuteNonQueryAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving setting {Key}", key);
                throw;
            }
        }
    }
}
