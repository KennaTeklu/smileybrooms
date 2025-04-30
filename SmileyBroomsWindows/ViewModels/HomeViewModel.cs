using Microsoft.Extensions.Logging;
using SmileyBroomsWindows.Models;
using SmileyBroomsWindows.Services;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows.Input;

namespace SmileyBroomsWindows.ViewModels
{
    public class HomeViewModel : ViewModelBase
    {
        private readonly ILogger<HomeViewModel> _logger;
        private readonly CleaningService _cleaningService;
        private readonly NavigationService _navigationService;
        private readonly MainViewModel _mainViewModel;

        private ObservableCollection<Service> _services;

        public ObservableCollection<Service> Services
        {
            get => _services;
            set => SetProperty(ref _services, value);
        }

        public ICommand BookNowCommand { get; }
        public ICommand ViewServicesCommand { get; }
        public ICommand BookServiceCommand { get; }

        public HomeViewModel(
            ILogger<HomeViewModel> logger,
            CleaningService cleaningService,
            NavigationService navigationService,
            MainViewModel mainViewModel)
        {
            _logger = logger;
            _cleaningService = cleaningService;
            _navigationService = navigationService;
            _mainViewModel = mainViewModel;

            Services = new ObservableCollection<Service>();

            BookNowCommand = new RelayCommand(_ => BookNow());
            ViewServicesCommand = new RelayCommand(_ => ViewServices());
            BookServiceCommand = new RelayCommand(param => BookService(param as Service));

            LoadServicesAsync().ConfigureAwait(false);
        }

        private async Task LoadServicesAsync()
        {
            try
            {
                var services = await _cleaningService.GetServicesAsync();
                
                Services.Clear();
                foreach (var service in services)
                {
                    Services.Add(service);
                }
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error loading services");
            }
        }

        private void BookNow()
        {
            _mainViewModel.SelectedNavigationIndex = 1; // Navigate to Services
        }

        private void ViewServices()
        {
            _mainViewModel.SelectedNavigationIndex = 1; // Navigate to Services
        }

        private void BookService(Service service)
        {
            if (service != null)
            {
                _mainViewModel.SelectedNavigationIndex = 1; // Navigate to Services
                // TODO: Select the specific service
            }
        }
    }
}
