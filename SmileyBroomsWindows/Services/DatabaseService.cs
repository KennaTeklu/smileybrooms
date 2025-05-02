using System;
using System.IO;
using Microsoft.Data.Sqlite;
using System.Threading.Tasks;

namespace SmileyBroomsWindows.Services
{
    public class DatabaseService
    {
        private readonly string _dbPath;

        public DatabaseService()
        {
            _dbPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "SmileyBrooms", "smiley_brooms.db");
            
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
                CREATE TABLE IF NOT EXISTS Bookings (
                    Id TEXT PRIMARY KEY,
                    ServiceType TEXT NOT NULL,
                    ScheduledDate TEXT NOT NULL,
                    Address TEXT NOT NULL,
                    Price REAL NOT NULL,
                    Status TEXT NOT NULL,
                    CreatedAt TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS Services (
                    Id TEXT PRIMARY KEY,
                    Name TEXT NOT NULL,
                    Description TEXT NOT NULL,
                    BasePrice REAL NOT NULL,
                    ImageUrl TEXT
                );

                CREATE TABLE IF NOT EXISTS UserProfile (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Name TEXT NOT NULL,
                    Email TEXT NOT NULL,
                    Phone TEXT,
                    DefaultAddress TEXT
                );
            ";
            command.ExecuteNonQuery();
        }

        public SqliteConnection GetConnection()
        {
            var connection = new SqliteConnection($"Data Source={_dbPath}");
            connection.Open();
            return connection;
        }

        public async Task<SqliteConnection> GetConnectionAsync()
        {
            var connection = new SqliteConnection($"Data Source={_dbPath}");
            await connection.OpenAsync();
            return connection;
        }

        public async Task ExecuteNonQueryAsync(string sql, params SqliteParameter[] parameters)
        {
            using var connection = await GetConnectionAsync();
            using var command = connection.CreateCommand();
            command.CommandText = sql;
            
            if (parameters != null)
            {
                command.Parameters.AddRange(parameters);
            }
            
            await command.ExecuteNonQueryAsync();
        }

        public async Task<T> ExecuteScalarAsync<T>(string sql, params SqliteParameter[] parameters)
        {
            using var connection = await GetConnectionAsync();
            using var command = connection.CreateCommand();
            command.CommandText = sql;
            
            if (parameters != null)
            {
                command.Parameters.AddRange(parameters);
            }
            
            var result = await command.ExecuteScalarAsync();
            return (T)Convert.ChangeType(result, typeof(T));
        }

        public void BackupDatabase()
        {
            var backupPath = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "SmileyBrooms",
                "Backups",
                $"smiley_brooms_backup_{DateTime.Now:yyyyMMdd_HHmmss}.db");
            
            // Ensure backup directory exists
            Directory.CreateDirectory(Path.GetDirectoryName(backupPath));
            
            // Close any open connections
            using (var connection = new SqliteConnection($"Data Source={_dbPath}"))
            {
                connection.Open();
                using var backupCommand = connection.CreateCommand();
                backupCommand.CommandText = $"VACUUM INTO '{backupPath}'";
                backupCommand.ExecuteNonQuery();
            }
        }
    }
}
