using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Logging;
using System;
using System.IO;

namespace SmileyBroomsWindows.Data.Database
{
    public class DatabaseInitializer
    {
        private readonly string _connectionString;
        private readonly ILogger<DatabaseInitializer> _logger;

        public DatabaseInitializer(string connectionString, ILogger<DatabaseInitializer> logger)
        {
            _connectionString = connectionString;
            _logger = logger;
        }

        public void Initialize()
        {
            try
            {
                // Ensure the database directory exists
                string dbDirectory = Path.GetDirectoryName(GetDatabasePath());
                if (!string.IsNullOrEmpty(dbDirectory) && !Directory.Exists(dbDirectory))
                {
                    Directory.CreateDirectory(dbDirectory);
                }

                // Create the database if it doesn't exist
                using (var connection = new SqliteConnection(_connectionString))
                {
                    connection.Open();

                    // Read the schema script
                    string schemaScript = File.ReadAllText("Database/InitialSchema.sql");

                    // Execute the schema script
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = schemaScript;
                        command.ExecuteNonQuery();
                    }

                    // Seed initial data if needed
                    SeedInitialData(connection);
                }

                _logger.LogInformation("Database initialized successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error initializing database");
                throw;
            }
        }

        private void SeedInitialData(SqliteConnection connection)
        {
            // Check if services table is empty
            using (var command = connection.CreateCommand())
            {
                command.CommandText = "SELECT COUNT(*) FROM Services";
                int count = Convert.ToInt32(command.ExecuteScalar());

                if (count == 0)
                {
                    // Insert sample services
                    using (var insertCommand = connection.CreateCommand())
                    {
                        insertCommand.CommandText = @"
                            INSERT INTO Services (Name, Description, Price, ImagePath, IsPopular, Category, DurationMinutes)
                            VALUES 
                            ('Regular Cleaning', 'Standard cleaning service for your home', 99.99, 'Assets/Images/regular-cleaning.jpg', 1, 'Residential', 120),
                            ('Deep Cleaning', 'Thorough cleaning of all areas including hard to reach spots', 199.99, 'Assets/Images/deep-cleaning.jpg', 1, 'Residential', 240),
                            ('Office Cleaning', 'Professional cleaning for office spaces', 149.99, 'Assets/Images/office-cleaning.jpg', 0, 'Commercial', 180),
                            ('Carpet Cleaning', 'Deep cleaning for carpets and rugs', 79.99, 'Assets/Images/carpet-cleaning.jpg', 0, 'Specialized', 90),
                            ('Window Cleaning', 'Crystal clear windows inside and out', 59.99, 'Assets/Images/window-cleaning.jpg', 0, 'Specialized', 60)";
                        insertCommand.ExecuteNonQuery();
                    }

                    _logger.LogInformation("Initial data seeded successfully");
                }
            }
        }

        private string GetDatabasePath()
        {
            // Extract the database path from the connection string
            var builder = new SqliteConnectionStringBuilder(_connectionString);
            return builder.DataSource;
        }
    }
}
