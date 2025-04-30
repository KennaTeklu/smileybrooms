using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Logging;
using SmileyBroomsWindows.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmileyBroomsWindows.Data.Repositories
{
    public class BookingRepository
    {
        private readonly string _connectionString;
        private readonly ILogger<BookingRepository> _logger;

        public BookingRepository(string connectionString, ILogger<BookingRepository> logger)
        {
            _connectionString = connectionString;
            _logger = logger;
        }

        public async Task<List<Booking>> GetAllBookingsAsync()
        {
            var bookings = new List<Booking>();

            try
            {
                using (var connection = new SqliteConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "SELECT * FROM Bookings ORDER BY BookingDate DESC";

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                bookings.Add(new Booking
                                {
                                    Id = reader.GetInt32(0),
                                    ServiceId = reader.GetInt32(1),
                                    BookingDate = DateTime.Parse(reader.GetString(2)),
                                    CustomerName = reader.GetString(3),
                                    CustomerEmail = reader.GetString(4),
                                    CustomerPhone = reader.GetString(5),
                                    Address = reader.GetString(6),
                                    City = reader.GetString(7),
                                    PostalCode = reader.GetString(8),
                                    Notes = reader.IsDBNull(9) ? string.Empty : reader.GetString(9),
                                    Status = (BookingStatus)reader.GetInt32(10),
                                    CreatedAt = DateTime.Parse(reader.GetString(11)),
                                    UpdatedAt = reader.IsDBNull(12) ? null : DateTime.Parse(reader.GetString(12))
                                });
                            }
                        }
                    }
                }

                return bookings;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving bookings");
                throw;
            }
        }

        public async Task<int> CreateBookingAsync(Booking booking)
        {
            try
            {
                using (var connection = new SqliteConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = @"
                            INSERT INTO Bookings (
                                ServiceId, BookingDate, CustomerName, CustomerEmail, 
                                CustomerPhone, Address, City, PostalCode, 
                                Notes, Status, CreatedAt
                            ) VALUES (
                                @ServiceId, @BookingDate, @CustomerName, @CustomerEmail,
                                @CustomerPhone, @Address, @City, @PostalCode,
                                @Notes, @Status, @CreatedAt
                            );
                            SELECT last_insert_rowid();";

                        command.Parameters.AddWithValue("@ServiceId", booking.ServiceId);
                        command.Parameters.AddWithValue("@BookingDate", booking.BookingDate.ToString("o"));
                        command.Parameters.AddWithValue("@CustomerName", booking.CustomerName);
                        command.Parameters.AddWithValue("@CustomerEmail", booking.CustomerEmail);
                        command.Parameters.AddWithValue("@CustomerPhone", booking.CustomerPhone);
                        command.Parameters.AddWithValue("@Address", booking.Address);
                        command.Parameters.AddWithValue("@City", booking.City);
                        command.Parameters.AddWithValue("@PostalCode", booking.PostalCode);
                        command.Parameters.AddWithValue("@Notes", booking.Notes ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@Status", (int)booking.Status);
                        command.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow.ToString("o"));

                        var result = await command.ExecuteScalarAsync();
                        return Convert.ToInt32(result);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating booking");
                throw;
            }
        }

        // Additional methods for CRUD operations would go here
    }
}
