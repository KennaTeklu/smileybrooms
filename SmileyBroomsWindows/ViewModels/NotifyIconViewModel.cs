using Microsoft.Extensions.Logging;
using SmileyBroomsWindows.Services;
using System.Windows;
using System.Windows.Input;

namespace SmileyBroomsWindows.ViewModels
{
    public class NotifyIconViewModel : ViewModelBase
    {
        private readonly ILogger<NotifyIconViewModel> _logger;
        private readonly UpdateService _updateService;

        public ICommand OpenCommand { get; }
        public ICommand CheckUpdatesCommand { get; }
        public ICommand ExitCommand { get; }

        public NotifyIconViewModel(
            ILogger<NotifyIconViewModel> logger,
            UpdateService updateService)
        {
            _logger = logger;
            _updateService = updateService;

            OpenCommand = new RelayCommand(_ => OpenApplication());
            CheckUpdatesCommand = new RelayCommand(_ => CheckForUpdates());
            ExitCommand = new RelayCommand(_ => ExitApplication());
        }

        private void OpenApplication()
        {
            var mainWindow = Application.Current.MainWindow;
            if (mainWindow != null)
            {
                mainWindow.Show();
                mainWindow.WindowState = WindowState.Normal;
                mainWindow.Activate();
            }
        }

        private async void CheckForUpdates()
        {
            await _updateService.CheckForUpdatesAsync();
        }

        private void ExitApplication()
        {
            _logger.LogInformation("Application exiting from tray icon");
            Application.Current.Shutdown();
        }
    }
}
