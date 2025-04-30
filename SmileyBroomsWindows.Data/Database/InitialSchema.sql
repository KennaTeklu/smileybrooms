-- Services table
CREATE TABLE IF NOT EXISTS Services (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Description TEXT NOT NULL,
    Price REAL NOT NULL,
    ImagePath TEXT,
    IsPopular INTEGER NOT NULL DEFAULT 0,
    Category TEXT NOT NULL,
    DurationMinutes INTEGER NOT NULL DEFAULT 60
);

-- Bookings table
CREATE TABLE IF NOT EXISTS Bookings (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    ServiceId INTEGER NOT NULL,
    BookingDate TEXT NOT NULL,
    CustomerName TEXT NOT NULL,
    CustomerEmail TEXT NOT NULL,
    CustomerPhone TEXT NOT NULL,
    Address TEXT NOT NULL,
    City TEXT NOT NULL,
    PostalCode TEXT NOT NULL,
    Notes TEXT,
    Status INTEGER NOT NULL DEFAULT 0,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    FOREIGN KEY (ServiceId) REFERENCES Services(Id)
);

-- Settings table
CREATE TABLE IF NOT EXISTS Settings (
    Key TEXT PRIMARY KEY,
    Value TEXT NOT NULL
);

-- User table
CREATE TABLE IF NOT EXISTS Users (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT NOT NULL UNIQUE,
    PasswordHash TEXT NOT NULL,
    Email TEXT NOT NULL,
    FirstName TEXT,
    LastName TEXT,
    IsAdmin INTEGER NOT NULL DEFAULT 0,
    CreatedAt TEXT NOT NULL,
    LastLoginAt TEXT
);

-- Insert default settings
INSERT OR IGNORE INTO Settings (Key, Value) VALUES ('NotificationsEnabled', 'true');
INSERT OR IGNORE INTO Settings (Key, Value) VALUES ('DarkModeEnabled', 'false');
INSERT OR IGNORE INTO Settings (Key, Value) VALUES ('AutoStartEnabled', 'true');
INSERT OR IGNORE INTO Settings (Key, Value) VALUES ('SyncFrequencyMinutes', '30');
