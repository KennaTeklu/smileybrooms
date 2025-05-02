using System;
using System.IO;
using Newtonsoft.Json;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;

namespace SmileyBroomsWindows.Services
{
    public class SettingsService
    {
        private readonly string _dbPath;
        private readonly DatabaseService _databaseService;

        public SettingsService(DatabaseService databaseService)
        {
            _databaseService = databaseService;
            _dbPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "SmileyBrooms", "settings.db");
            
            // Ensure directory exists
            Directory.CreateDirectory(Path.GetDirectoryName(_dbPath));
            
            InitializeDatabase();
        }

        private void InitializeDatabase()
        {
            using var connection = new SqliteConnection($"Data Source={_dbPath}");
            connection.Open();

            var command = connection.CreateCommand();
            command.CommandText = @"
                CREATE TABLE IF NOT EXISTS Settings (
                    Key TEXT PRIMARY KEY,
                    Value TEXT NOT NULL
                );
            ";
            command.ExecuteNonQuery();
        }

        public async Task<T> GetSettingAsync<T>(string key, T defaultValue)
        {
            try
            {
                using var connection = new SqliteConnection($"Data Source={_dbPath}");
                await connection.OpenAsync();

                var command = connection.CreateCommand();
                command.CommandText = "SELECT Value FROM Settings WHERE Key = @Key";
                command.Parameters.AddWithValue("@Key", key);

                var result = await command.ExecuteScalarAsync();
                if (result == null)
                    return defaultValue;

                return JsonConvert.DeserializeObject<T>(result.ToString());
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting setting: {ex.Message}");
                return defaultValue;
            }
        }

        public async Task SaveSettingAsync<T>(string key, T value)
        {
            try
            {
                using var connection = new SqliteConnection($"Data Source={_dbPath}");
                await connection.OpenAsync();

                var serializedValue = JsonConvert.SerializeObject(value);

                var command = connection.CreateCommand();
                command.CommandText = @"
                    INSERT OR REPLACE INTO Settings (Key, Value)
                    VALUES (@Key, @Value);
                ";
                command.Parameters.AddWithValue("@Key", key);
                command.Parameters.AddWithValue("@Value", serializedValue);

                await command.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving setting: {ex.Message}");
            }
        }

        public async Task<bool> HasSettingAsync(string key)
        {
            try
            {
                using var connection = new SqliteConnection($"Data Source={_dbPath}");
                await connection.OpenAsync();

                var command = connection.CreateCommand();
                command.CommandText = "SELECT COUNT(*) FROM Settings WHERE Key = @Key";
                command.Parameters.AddWithValue("@Key", key);

                var result = await command.ExecuteScalarAsync();
                return Convert.ToInt32(result) > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error checking setting: {ex.Message}");
                return false;
            }
        }

        public async Task ClearSettingsAsync()
        {
            try
            {
                using var connection = new SqliteConnection($"Data Source={_dbPath}");
                await connection.OpenAsync();

                var command = connection.CreateCommand();
                command.CommandText = "DELETE FROM Settings";
                await command.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error clearing settings: {ex.Message}");
            }
        }
    }
}
