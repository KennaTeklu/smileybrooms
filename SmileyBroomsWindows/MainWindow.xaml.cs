using Microsoft.Extensions.Logging;
using SmileyBroomsWindows.Services;
using SmileyBroomsWindows.ViewModels;
using SmileyBroomsWindows.Views;
using System.Windows;
using System.Windows.Controls;

namespace SmileyBroomsWindows
{
    public partial class MainWindow : Window
    {
        private readonly ILogger<MainWindow> _logger;
        private readonly NavigationService _navigationService;
        private readonly MainViewModel _viewModel;
        private readonly HomeView _homeView;
        private readonly ServicesView _servicesView;
        private readonly BookingsView _bookingsView;
        private readonly SettingsView _settingsView;
        private readonly UpdateService _updateService;

        public MainWindow(
            ILogger<MainWindow> logger,
            NavigationService navigationService,
            MainViewModel viewModel,
            HomeView homeView,
            ServicesView servicesView,
            BookingsView bookingsView,
            SettingsView settingsView,
            UpdateService updateService)
        {
            InitializeComponent();

            _logger = logger;
            _navigationService = navigationService;
            _viewModel = viewModel;
            _homeView = homeView;
            _servicesView = servicesView;
            _bookingsView = bookingsView;
            _settingsView = settingsView;
            _updateService = updateService;

            DataContext = _viewModel;
            _navigationService.Initialize(ContentFrame);

            Loaded += MainWindow_Loaded;
        }

        private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            _logger.LogInformation("Application started");
            _navigationService.Navigate(_homeView);

            // Check for updates
            await _updateService.CheckForUpdatesAsync();
        }

        private void MenuToggleButton_Click(object sender, RoutedEventArgs e)
        {
            // Handled by binding
        }

        private void NavigationList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (e.AddedItems.Count > 0)
            {
                var selectedItem = e.AddedItems[0] as ListBoxItem;

                if (selectedItem == HomeItem)
                {
                    _navigationService.Navigate(_homeView);
                }
                else if (selectedItem == ServicesItem)
                {
                    _navigationService.Navigate(_servicesView);
                }
                else if (selectedItem == BookingsItem)
                {
                    _navigationService.Navigate(_bookingsView);
                }
                else if (selectedItem == SupportItem)
                {
                    // Navigate to support view
                }
            }
        }

        private void SettingsButton_Click(object sender, RoutedEventArgs e)
        {
            _navigationService.Navigate(_settingsView);
        }
    }
}
