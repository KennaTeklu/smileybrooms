using System;
using System.Windows.Input;
using SmileyBroomsWindows.Services;

namespace SmileyBroomsWindows.ViewModels
{
    public class MainViewModel : ViewModelBase
    {
        private readonly NavigationService _navigationService;
        private readonly UpdateService _updateService;
        private readonly NotificationService _notificationService;
        private readonly SettingsService _settingsService;
        private bool _isCheckingForUpdates;
        private string _currentVersion;

        public MainViewModel(
            NavigationService navigationService,
            UpdateService updateService,
            NotificationService notificationService,
            SettingsService settingsService)
        {
            _navigationService = navigationService;
            _updateService = updateService;
            _notificationService = notificationService;
            _settingsService = settingsService;
            
            _currentVersion = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version.ToString();
            
            NavigateHomeCommand = new RelayCommand(NavigateHome);
            NavigateServicesCommand = new RelayCommand(NavigateServices);
            NavigateBookingsCommand = new RelayCommand(NavigateBookings);
            NavigateSettingsCommand = new RelayCommand(NavigateSettings);
            CheckForUpdatesCommand = new RelayCommand(CheckForUpdates);
            
            // Check for updates on startup
            CheckForUpdates();
        }

        public string CurrentVersion
        {
            get => _currentVersion;
            set => SetProperty(ref _currentVersion, value);
        }

        public bool IsCheckingForUpdates
        {
            get => _isCheckingForUpdates;
            set => SetProperty(ref _isCheckingForUpdates, value);
        }

        public ICommand NavigateHomeCommand { get; }
        public ICommand NavigateServicesCommand { get; }
        public ICommand NavigateBookingsCommand { get; }
        public ICommand NavigateSettingsCommand { get; }
        public ICommand CheckForUpdatesCommand { get; }

        private void NavigateHome()
        {
            _navigationService.NavigateTo("HomeView");
        }

        private void NavigateServices()
        {
            _navigationService.NavigateTo("ServicesView");
        }

        private void NavigateBookings()
        {
            _navigationService.NavigateTo("BookingsView");
        }

        private void NavigateSettings()
        {
            _navigationService.NavigateTo("SettingsView");
        }

        private async void CheckForUpdates()
        {
            try
            {
                IsCheckingForUpdates = true;
                var updateAvailable = await _updateService.CheckForUpdatesAsync();
                
                if (updateAvailable)
                {
                    var updateInfo = await _updateService.GetLatestUpdateInfoAsync();
                    _notificationService.ShowNotification(
                        "Update Available", 
                        $"Version {updateInfo.Version} is available. Would you like to update now?",
                        () => _updateService.DownloadAndInstallUpdateAsync(updateInfo));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error checking for updates: {ex.Message}");
            }
            finally
            {
                IsCheckingForUpdates = false;
            }
        }
    }
}
