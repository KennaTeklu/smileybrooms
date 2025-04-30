using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.IO;

namespace SmileyBroomsWindows.Services
{
    public class DatabaseService
    {
        private readonly ILogger<DatabaseService> _logger;
        private readonly string _connectionString;

        public DatabaseService(
            ILogger<DatabaseService> logger,
            IConfiguration configuration)
        {
            _logger = logger;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public void Initialize()
        {
            try
            {
                // Create database file if it doesn't exist
                var dbPath = _connectionString.Replace("Data Source=", "");
                var dbDirectory = Path.GetDirectoryName(dbPath);
                
                if (!string.IsNullOrEmpty(dbDirectory) && !Directory.Exists(dbDirectory))
                {
                    Directory.CreateDirectory(dbDirectory);
                }

                // Create tables
                using (var connection = new SqliteConnection(_connectionString))
                {
                    connection.Open();

                    // Create tables
                    var command = connection.CreateCommand();
                    command.CommandText = @"
                        CREATE TABLE IF NOT EXISTS Services (
                            Id INTEGER PRIMARY KEY AUTOINCREMENT,
                            Name TEXT NOT NULL,
                            Description TEXT,
                            Price REAL NOT NULL,
                            Duration INTEGER NOT NULL,
                            ImagePath TEXT
                        );

                        CREATE TABLE IF NOT EXISTS Bookings (
                            Id INTEGER PRIMARY KEY AUTOINCREMENT,
                            ServiceId INTEGER NOT NULL,
                            CustomerName TEXT NOT NULL,
                            CustomerEmail TEXT NOT NULL,
                            CustomerPhone TEXT,
                            BookingDate TEXT NOT NULL,
                            BookingTime TEXT NOT NULL,
                            Status TEXT NOT NULL,
                            Notes TEXT,
                            CreatedAt TEXT NOT NULL,
                            FOREIGN KEY (ServiceId) REFERENCES Services (Id)
                        );

                        CREATE TABLE IF NOT EXISTS Settings (
                            Key TEXT PRIMARY KEY,
                            Value TEXT NOT NULL
                        );
                    ";
                    command.ExecuteNonQuery();

                    // Load initial data if tables are empty
                    command = connection.CreateCommand();
                    command.CommandText = "SELECT COUNT(*) FROM Services";
                    var count = Convert.ToInt32(command.ExecuteScalar());

                    if (count == 0)
                    {
                        _logger.LogInformation("Loading initial data");
                        LoadInitialData(connection);
                    }
                }

                _logger.LogInformation("Database initialized successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error initializing database");
                throw;
            }
        }

        private void LoadInitialData(SqliteConnection connection)
        {
            try
            {
                // Load SQL from file
                var sqlFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "InitialData.sql");
                if (File.Exists(sqlFile))
                {
                    var sql = File.ReadAllText(sqlFile);
                    var command = connection.CreateCommand();
                    command.CommandText = sql;
                    command.ExecuteNonQuery();
                }
                else
                {
                    // Insert default services
                    var command = connection.CreateCommand();
                    command.CommandText = @"
                        INSERT INTO Services (Name, Description, Price, Duration, ImagePath) 
                        VALUES 
                        ('Regular Cleaning', 'Standard cleaning service for homes that need regular maintenance.', 120.00, 120, 'Assets/Images/regular-cleaning.jpg'),
                        ('Deep Cleaning', 'Thorough cleaning for homes that need extra attention to detail.', 220.00, 240, 'Assets/Images/deep-cleaning.jpg'),
                        ('Move In/Out Cleaning', 'Comprehensive cleaning for when you''re moving in or out of a property.', 320.00, 360, 'Assets/Images/move-cleaning.jpg'),
                        ('Office Cleaning', 'Professional cleaning services for office spaces and commercial properties.', 180.00, 180, 'Assets/Images/office-cleaning.jpg');
                        
                        INSERT INTO Settings (Key, Value)
                        VALUES
                        ('AppSettings:AutoStartWithWindows', 'false'),
                        ('AppSettings:MinimizeToTray', 'true'),
                        ('AppSettings:CheckForUpdatesOnStartup', 'true'),
                        ('AppSettings:NotificationsEnabled', 'true'),
                        ('AppSettings:StartMinimized', 'false'),
                        ('AppSettings:HideWhenMinimized', 'false'),
                        ('AppSettings:MinimizeOnClose', 'true');
                    ";
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading initial data");
                throw;
            }
        }
    }
}
