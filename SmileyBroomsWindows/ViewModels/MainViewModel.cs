using Microsoft.Extensions.Logging;
using SmileyBroomsWindows.Services;
using SmileyBroomsWindows.Views;
using System.Windows.Controls;
using System.Windows.Input;

namespace SmileyBroomsWindows.ViewModels
{
    public class MainViewModel : ViewModelBase
    {
        private readonly ILogger<MainViewModel> _logger;
        private readonly NavigationService _navigationService;
        private readonly HomeView _homeView;
        private readonly ServicesView _servicesView;
        private readonly BookingsView _bookingsView;
        private readonly SettingsView _settingsView;

        private bool _isMenuOpen;
        private int _selectedNavigationIndex;
        private UserControl _currentView;

        public bool IsMenuOpen
        {
            get => _isMenuOpen;
            set => SetProperty(ref _isMenuOpen, value);
        }

        public int SelectedNavigationIndex
        {
            get => _selectedNavigationIndex;
            set
            {
                if (SetProperty(ref _selectedNavigationIndex, value))
                {
                    NavigateBasedOnIndex(value);
                }
            }
        }

        public UserControl CurrentView
        {
            get => _currentView;
            set => SetProperty(ref _currentView, value);
        }

        public ICommand ToggleMenuCommand { get; }
        public ICommand NavigateToSettingsCommand { get; }

        public MainViewModel(
            ILogger<MainViewModel> logger,
            NavigationService navigationService,
            HomeView homeView,
            ServicesView servicesView,
            BookingsView bookingsView,
            SettingsView settingsView)
        {
            _logger = logger;
            _navigationService = navigationService;
            _homeView = homeView;
            _servicesView = servicesView;
            _bookingsView = bookingsView;
            _settingsView = settingsView;

            ToggleMenuCommand = new RelayCommand(_ => IsMenuOpen = !IsMenuOpen);
            NavigateToSettingsCommand = new RelayCommand(_ => NavigateToSettings());
        }

        public void Initialize()
        {
            // Set default view
            CurrentView = _homeView;
            SelectedNavigationIndex = 0;
        }

        private void NavigateBasedOnIndex(int index)
        {
            switch (index)
            {
                case 0:
                    CurrentView = _homeView;
                    break;
                case 1:
                    CurrentView = _servicesView;
                    break;
                case 2:
                    CurrentView = _bookingsView;
                    break;
                case 3:
                    // Support view
                    break;
            }
        }

        private void NavigateToSettings()
        {
            CurrentView = _settingsView;
        }
    }
}
