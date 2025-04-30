using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Logging;
using SmileyBroomsWindows.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmileyBroomsWindows.Data.Repositories
{
    public class ServiceRepository
    {
        private readonly string _connectionString;
        private readonly ILogger<ServiceRepository> _logger;

        public ServiceRepository(string connectionString, ILogger<ServiceRepository> logger)
        {
            _connectionString = connectionString;
            _logger = logger;
        }

        public async Task<List<Service>> GetAllServicesAsync()
        {
            var services = new List<Service>();

            try
            {
                using (var connection = new SqliteConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "SELECT * FROM Services ORDER BY Category, Name";

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                services.Add(new Service
                                {
                                    Id = reader.GetInt32(0),
                                    Name = reader.GetString(1),
                                    Description = reader.GetString(2),
                                    Price = reader.GetDecimal(3),
                                    ImagePath = reader.IsDBNull(4) ? string.Empty : reader.GetString(4),
                                    IsPopular = reader.GetInt32(5) == 1,
                                    Category = reader.GetString(6),
                                    DurationMinutes = reader.GetInt32(7)
                                });
                            }
                        }
                    }
                }

                return services;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving services");
                throw;
            }
        }

        public async Task<Service> GetServiceByIdAsync(int id)
        {
            try
            {
                using (var connection = new SqliteConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "SELECT * FROM Services WHERE Id = @Id";
                        command.Parameters.AddWithValue("@Id", id);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                return new Service
                                {
                                    Id = reader.GetInt32(0),
                                    Name = reader.GetString(1),
                                    Description = reader.GetString(2),
                                    Price = reader.GetDecimal(3),
                                    ImagePath = reader.IsDBNull(4) ? string.Empty : reader.GetString(4),
                                    IsPopular = reader.GetInt32(5) == 1,
                                    Category = reader.GetString(6),
                                    DurationMinutes = reader.GetInt32(7)
                                };
                            }
                            else
                            {
                                throw new KeyNotFoundException($"Service with ID {id} not found");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving service with ID {Id}", id);
                throw;
            }
        }

        // Additional methods for CRUD operations would go here
    }
}
