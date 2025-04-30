using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SmileyBroomsWindows.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmileyBroomsWindows.Services
{
    public class BookingService
    {
        private readonly ILogger<BookingService> _logger;
        private readonly string _connectionString;
        private readonly ApiService _apiService;
        private readonly NotificationService _notificationService;

        public BookingService(
            ILogger<BookingService> logger,
            IConfiguration configuration,
            ApiService apiService,
            NotificationService notificationService)
        {
            _logger = logger;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _apiService = apiService;
            _notificationService = notificationService;
        }

        public async Task<List<Booking>> GetBookingsAsync()
        {
            try
            {
                var bookings = new List<Booking>();

                using (var connection = new SqliteConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    var command = connection.CreateCommand();
                    command.CommandText = @"
                        SELECT b.*, s.Name as ServiceName
                        FROM Bookings b
                        JOIN Services s ON b.ServiceId = s.Id
                        ORDER BY b.BookingDate DESC, b.BookingTime DESC
                    ";

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            bookings.Add(new Booking
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                ServiceId = reader.GetInt32(reader.GetOrdinal("ServiceId")),
                                ServiceName = reader.GetString(reader.GetOrdinal("ServiceName")),
                                CustomerName = reader.GetString(reader.GetOrdinal("CustomerName")),
                                CustomerEmail = reader.GetString(reader.GetOrdinal("CustomerEmail")),
                                CustomerPhone = reader.IsDBNull(reader.GetOrdinal("CustomerPhone")) ? null : reader.GetString(reader.GetOrdinal("CustomerPhone")),
                                BookingDate = reader.GetString(reader.GetOrdinal("BookingDate")),
                                BookingTime = reader.GetString(reader.GetOrdinal("BookingTime")),
                                Status = reader.GetString(reader.GetOrdinal("Status")),
                                Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes")),
                                CreatedAt = reader.GetString(reader.GetOrdinal("CreatedAt"))
                            });
                        }
                    }
                }

                return bookings;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting bookings");
                throw;
            }
        }

        public async Task<Booking> GetBookingAsync(int id)
        {
            try
            {
                using (var connection = new SqliteConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    var command = connection.CreateCommand();
                    command.CommandText = @"
                        SELECT b.*, s.Name as ServiceName
                        FROM Bookings b
                        JOIN Services s ON b.ServiceId = s.Id
                        WHERE b.Id = @Id
                    ";
                    command.Parameters.AddWithValue("@Id", id);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new Booking
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                ServiceId = reader.GetInt32(reader.GetOrdinal("ServiceId")),
                                ServiceName = reader.GetString(reader.GetOrdinal("ServiceName")),
                                CustomerName = reader.GetString(reader.GetOrdinal("CustomerName")),
                                CustomerEmail = reader.GetString(reader.GetOrdinal("CustomerEmail")),
                                CustomerPhone = reader.IsDBNull(reader.GetOrdinal("CustomerPhone")) ? null : reader.GetString(reader.GetOrdinal("CustomerPhone")),
                                BookingDate = reader.GetString(reader.GetOrdinal("BookingDate")),
                                BookingTime = reader.GetString(reader.GetOrdinal("BookingTime")),
                                Status = reader.GetString(reader.GetOrdinal("Status")),
                                Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes")),
                                CreatedAt = reader.GetString(reader.GetOrdinal("CreatedAt"))
                            };
                        }
                    }
                }

                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting booking {id}");
                throw;
            }
        }

        public async Task<int> CreateBookingAsync(Booking booking)
        {
            try
            {
                // Set created date
                booking.CreatedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                
                // Set default status
                if (string.IsNullOrEmpty(booking.Status))
                {
                    booking.Status = "Pending";
                }

                using (var connection = new SqliteConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    var command = connection.CreateCommand();
                    command.CommandText = @"
                        INSERT INTO Bookings (
                            ServiceId, CustomerName, CustomerEmail, CustomerPhone,
                            BookingDate, BookingTime, Status, Notes, CreatedAt
                        ) VALUES (
                            @ServiceId, @CustomerName, @CustomerEmail, @CustomerPhone,
                            @BookingDate, @BookingTime, @Status, @Notes, @CreatedAt
                        );
                        SELECT last_insert_rowid();
                    ";
                    command.Parameters.AddWithValue("@ServiceId", booking.ServiceId);
                    command.Parameters.AddWithValue("@CustomerName", booking.CustomerName);
                    command.Parameters.AddWithValue("@CustomerEmail", booking.CustomerEmail);
                    command.Parameters.AddWithValue("@CustomerPhone", booking.CustomerPhone ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@BookingDate", booking.BookingDate);
                    command.Parameters.AddWithValue("@BookingTime", booking.BookingTime);
                    command.Parameters.AddWithValue("@Status", booking.Status);
                    command.Parameters.AddWithValue("@Notes", booking.Notes ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@CreatedAt", booking.CreatedAt);

                    var id = Convert.ToInt32(await command.ExecuteScalarAsync());
                    booking.Id = id;
                }

                // Sync with server
                await _apiService.SyncBookingAsync(booking);

                // Show notification
                _notificationService.ShowBookingConfirmation(booking);

                return booking.Id;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating booking");
                throw;
            }
        }

        public async Task UpdateBookingAsync(Booking booking)
        {
            try
            {
                using (var connection = new SqliteConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    var command = connection.CreateCommand();
                    command.CommandText = @"
                        UPDATE Bookings SET
                            ServiceId = @ServiceId,
                            CustomerName = @CustomerName,
                            CustomerEmail = @CustomerEmail,
                            CustomerPhone = @CustomerPhone,
                            BookingDate = @BookingDate,
                            BookingTime = @BookingTime,
                            Status = @Status,
                            Notes = @Notes
                        WHERE Id = @Id
                    ";
                    command.Parameters.AddWithValue("@Id", booking.Id);
                    command.Parameters.AddWithValue("@ServiceId", booking.ServiceId);
                    command.Parameters.AddWithValue("@CustomerName", booking.CustomerName);
                    command.Parameters.AddWithValue("@CustomerEmail", booking.CustomerEmail);
                    command.Parameters.AddWithValue("@CustomerPhone", booking.CustomerPhone ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@BookingDate", booking.BookingDate);
                    command.Parameters.AddWithValue("@BookingTime", booking.BookingTime);
                    command.Parameters.AddWithValue("@Status", booking.Status);
                    command.Parameters.AddWithValue("@Notes", booking.Notes ?? (object)DBNull.Value);

                    await command.ExecuteNonQueryAsync();
                }

                // Sync with server
                await _apiService.SyncBookingAsync(booking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating booking {booking.Id}");
                throw;
            }
        }

        public async Task DeleteBookingAsync(int id)
        {
            try
            {
                using (var connection = new SqliteConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    var command = connection.CreateCommand();
                    command.CommandText = "DELETE FROM Bookings WHERE Id = @Id";
                    command.Parameters.AddWithValue("@Id", id);
                    await command.ExecuteNonQueryAsync();
                }

                // Sync with server
                await _apiService.DeleteBookingAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting booking {id}");
                throw;
            }
        }

        public async Task CheckUpcomingBookingsAsync()
        {
            try
            {
                var tomorrow = DateTime.Now.AddDays(1).ToString("yyyy-MM-dd");
                
                using (var connection = new SqliteConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    var command = connection.CreateCommand();
                    command.CommandText = @"
                        SELECT b.*, s.Name as ServiceName
                        FROM Bookings b
                        JOIN Services s ON b.ServiceId = s.Id
                        WHERE b.BookingDate = @Tomorrow AND b.Status = 'Confirmed'
                    ";
                    command.Parameters.AddWithValue("@Tomorrow", tomorrow);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var booking = new Booking
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                ServiceId = reader.GetInt32(reader.GetOrdinal("ServiceId")),
                                ServiceName = reader.GetString(reader.GetOrdinal("ServiceName")),
                                CustomerName = reader.GetString(reader.GetOrdinal("CustomerName")),
                                CustomerEmail = reader.GetString(reader.GetOrdinal("CustomerEmail")),
                                CustomerPhone = reader.IsDBNull(reader.GetOrdinal("CustomerPhone")) ? null : reader.GetString(reader.GetOrdinal("CustomerPhone")),
                                BookingDate = reader.GetString(reader.GetOrdinal("BookingDate")),
                                BookingTime = reader.GetString(reader.GetOrdinal("BookingTime")),
                                Status = reader.GetString(reader.GetOrdinal("Status")),
                                Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes")),
                                CreatedAt = reader.GetString(reader.GetOrdinal("CreatedAt"))
                            };

                            _notificationService.ShowBookingReminder(booking);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking upcoming bookings");
            }
        }
    }
}
