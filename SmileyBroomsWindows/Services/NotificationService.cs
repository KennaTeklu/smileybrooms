using Microsoft.Extensions.Logging;
using Microsoft.Toolkit.Uwp.Notifications;
using System;
using System.IO;
using System.Media;
using System.Windows;

namespace SmileyBroomsWindows.Services
{
    public class NotificationService
    {
        private readonly ILogger<NotificationService> _logger;
        private readonly SoundPlayer _soundPlayer;

        public NotificationService(ILogger<NotificationService> logger)
        {
            _logger = logger;
            
            // Initialize sound player
            try
            {
                string soundPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Assets", "Sounds", "notification.wav");
                if (File.Exists(soundPath))
                {
                    _soundPlayer = new SoundPlayer(soundPath);
                    _soundPlayer.Load();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error initializing sound player");
            }
        }

        public void ShowToast(string title, string message)
        {
            try
            {
                // Play notification sound
                _soundPlayer?.Play();

                // Show toast notification
                new ToastContentBuilder()
                    .AddText(title)
                    .AddText(message)
                    .Show();

                _logger.LogInformation("Toast notification shown: {Title} - {Message}", title, message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error showing toast notification");
                
                // Fallback to message box if toast fails
                Application.Current.Dispatcher.Invoke(() =>
                {
                    MessageBox.Show(message, title, MessageBoxButton.OK, MessageBoxImage.Information);
                });
            }
        }

        public void ShowError(string title, string message)
        {
            try
            {
                // Show error toast notification
                new ToastContentBuilder()
                    .AddText(title)
                    .AddText(message)
                    .Show();

                _logger.LogError("Error notification shown: {Title} - {Message}", title, message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error showing error notification");
                
                // Fallback to message box if toast fails
                Application.Current.Dispatcher.Invoke(() =>
                {
                    MessageBox.Show(message, title, MessageBoxButton.OK, MessageBoxImage.Error);
                });
            }
        }
    }
}
