using Microsoft.Extensions.Logging;
using Microsoft.Toolkit.Uwp.Notifications;
using SmileyBroomsWindows.Models;
using System;
using System.IO;
using System.Media;
using System.Windows;

namespace SmileyBroomsWindows.Services
{
    public class NotificationService
    {
        private readonly ILogger<NotificationService> _logger;
        private readonly SettingsService _settingsService;
        private SoundPlayer _soundPlayer;

        public NotificationService(
            ILogger<NotificationService> logger,
            SettingsService settingsService)
        {
            _logger = logger;
            _settingsService = settingsService;
            
            // Initialize sound player
            var soundPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Assets", "Sounds", "notification.wav");
            if (File.Exists(soundPath))
            {
                _soundPlayer = new SoundPlayer(soundPath);
                _soundPlayer.Load();
            }
        }

        public void ShowNotification(string title, string message, NotificationType type = NotificationType.Information)
        {
            try
            {
                if (!_settingsService.GetSetting<bool>("AppSettings:NotificationsEnabled"))
                {
                    return;
                }

                _logger.LogInformation($"Showing notification: {title} - {message}");

                // Play sound
                _soundPlayer?.Play();

                // Show toast notification
                var builder = new ToastContentBuilder()
                    .AddText(title)
                    .AddText(message);

                // Add appropriate icon based on type
                switch (type)
                {
                    case NotificationType.Success:
                        builder.AddAppLogoOverride(new Uri("ms-appx:///Assets/Images/success.png"));
                        break;
                    case NotificationType.Warning:
                        builder.AddAppLogoOverride(new Uri("ms-appx:///Assets/Images/warning.png"));
                        break;
                    case NotificationType.Error:
                        builder.AddAppLogoOverride(new Uri("ms-appx:///Assets/Images/error.png"));
                        break;
                    default:
                        builder.AddAppLogoOverride(new Uri("ms-appx:///Assets/Images/info.png"));
                        break;
                }

                builder.Show();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error showing notification");
            }
        }

        public void ShowBookingConfirmation(Booking booking)
        {
            try
            {
                var title = "Booking Confirmed";
                var message = $"Your {booking.ServiceName} is scheduled for {booking.BookingDate} at {booking.BookingTime}.";
                
                ShowNotification(title, message, NotificationType.Success);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error showing booking confirmation");
            }
        }

        public void ShowBookingReminder(Booking booking)
        {
            try
            {
                var title = "Booking Reminder";
                var message = $"Your {booking.ServiceName} is scheduled for tomorrow at {booking.BookingTime}.";
                
                ShowNotification(title, message, NotificationType.Information);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error showing booking reminder");
            }
        }
    }

    public enum NotificationType
    {
        Information,
        Success,
        Warning,
        Error
    }
}
