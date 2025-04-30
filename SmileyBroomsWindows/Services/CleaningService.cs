using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SmileyBroomsWindows.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmileyBroomsWindows.Services
{
    public class CleaningService
    {
        private readonly ILogger<CleaningService> _logger;
        private readonly string _connectionString;
        private readonly ApiService _apiService;

        public CleaningService(
            ILogger<CleaningService> logger,
            IConfiguration configuration,
            ApiService apiService)
        {
            _logger = logger;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _apiService = apiService;
        }

        public async Task<List<Service>> GetServicesAsync()
        {
            try
            {
                var services = new List<Service>();

                using (var connection = new SqliteConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    var command = connection.CreateCommand();
                    command.CommandText = "SELECT * FROM Services ORDER BY Price";

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            services.Add(new Service
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                Name = reader.GetString(reader.GetOrdinal("Name")),
                                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                                Price = reader.GetDouble(reader.GetOrdinal("Price")),
                                Duration = reader.GetInt32(reader.GetOrdinal("Duration")),
                                ImagePath = reader.IsDBNull(reader.GetOrdinal("ImagePath")) ? null : reader.GetString(reader.GetOrdinal("ImagePath"))
                            });
                        }
                    }
                }

                return services;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting services");
                throw;
            }
        }

        public async Task<Service> GetServiceAsync(int id)
        {
            try
            {
                using (var connection = new SqliteConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    var command = connection.CreateCommand();
                    command.CommandText = "SELECT * FROM Services WHERE Id = @Id";
                    command.Parameters.AddWithValue("@Id", id);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new Service
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                Name = reader.GetString(reader.GetOrdinal("Name")),
                                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                                Price = reader.GetDouble(reader.GetOrdinal("Price")),
                                Duration = reader.GetInt32(reader.GetOrdinal("Duration")),
                                ImagePath = reader.IsDBNull(reader.GetOrdinal("ImagePath")) ? null : reader.GetString(reader.GetOrdinal("ImagePath"))
                            };
                        }
                    }
                }

                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting service {id}");
                throw;
            }
        }

        public async Task SyncServicesAsync()
        {
            try
            {
                _logger.LogInformation("Syncing services with server");
                
                // Get services from server
                var services = await _apiService.GetServicesAsync();
                if (services == null || services.Length == 0)
                {
                    _logger.LogWarning("No services returned from server");
                    return;
                }

                // Update local database
                using (var connection = new SqliteConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    
                    // Begin transaction
                    using (var transaction = connection.BeginTransaction())
                    {
                        try
                        {
                            foreach (var service in services)
                            {
                                var command = connection.CreateCommand();
                                command.Transaction = transaction;
                                command.CommandText = @"
                                    INSERT INTO Services (Id, Name, Description, Price, Duration, ImagePath)
                                    VALUES (@Id, @Name, @Description, @Price, @Duration, @ImagePath)
                                    ON CONFLICT(Id) DO UPDATE SET
                                        Name = @Name,
                                        Description = @Description,
                                        Price = @Price,
                                        Duration = @Duration,
                                        ImagePath = @ImagePath
                                ";
                                command.Parameters.AddWithValue("@Id", service.Id);
                                command.Parameters.AddWithValue("@Name", service.Name);
                                command.Parameters.AddWithValue("@Description", service.Description ?? (object)DBNull.Value);
                                command.Parameters.AddWithValue("@Price", service.Price);
                                command.Parameters.AddWithValue("@Duration", service.Duration);
                                command.Parameters.AddWithValue("@ImagePath", service.ImagePath ?? (object)DBNull.Value);
                                
                                await command.ExecuteNonQueryAsync();
                            }
                            
                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Error updating services in transaction");
                            transaction.Rollback();
                            throw;
                        }
                    }
                }

                _logger.LogInformation("Services synced successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error syncing services");
                throw;
            }
        }
    }
}
