using Microsoft.Extensions.Logging;
using SmileyBroomsWindows.Core.Models;
using SmileyBroomsWindows.Data.Repositories;
using SmileyBroomsWindows.Services;
using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows.Input;

namespace SmileyBroomsWindows.ViewModels
{
    public class HomeViewModel : ViewModelBase
    {
        private readonly ILogger<HomeViewModel> _logger;
        private readonly ServiceRepository _serviceRepository;
        private readonly NavigationService _navigationService;

        public ObservableCollection<Service> PopularServices { get; } = new ObservableCollection<Service>();
        public ObservableCollection<Testimonial> Testimonials { get; } = new ObservableCollection<Testimonial>();

        public ICommand BookNowCommand { get; }
        public ICommand ViewServiceCommand { get; }

        public HomeViewModel(
            ILogger<HomeViewModel> logger,
            ServiceRepository serviceRepository,
            NavigationService navigationService)
        {
            _logger = logger;
            _serviceRepository = serviceRepository;
            _navigationService = navigationService;

            BookNowCommand = new RelayCommand(ExecuteBookNow);
            ViewServiceCommand = new RelayCommand<Service>(ExecuteViewService);

            LoadDataAsync();
        }

        private async void LoadDataAsync()
        {
            try
            {
                // Load popular services
                var services = await _serviceRepository.GetAllServicesAsync();
                foreach (var service in services)
                {
                    if (service.IsPopular)
                    {
                        PopularServices.Add(service);
                    }
                }

                // Add sample testimonials
                Testimonials.Add(new Testimonial
                {
                    Name = "John Smith",
                    Location = "New York",
                    Comment = "The cleaning service was exceptional! My home has never looked better.",
                    AvatarPath = "/Assets/Images/avatar1.jpg"
                });

                Testimonials.Add(new Testimonial
                {
                    Name = "Sarah Johnson",
                    Location = "Chicago",
                    Comment = "Professional, thorough, and friendly. I highly recommend Smiley Brooms!",
                    AvatarPath = "/Assets/Images/avatar2.jpg"
                });

                Testimonials.Add(new Testimonial
                {
                    Name = "Michael Brown",
                    Location = "Los Angeles",
                    Comment = "Consistent quality service every time. They truly live up to their tagline!",
                    AvatarPath = "/Assets/Images/avatar3.jpg"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading home data");
            }
        }

        private void ExecuteBookNow()
        {
            // Navigate to booking page
            _logger.LogInformation("Book Now button clicked");
        }

        private void ExecuteViewService(Service service)
        {
            if (service != null)
            {
                _logger.LogInformation("View service clicked for service: {ServiceName}", service.Name);
                // Navigate to service details
            }
        }
    }

    public class Testimonial
    {
        public string Name { get; set; }
        public string Location { get; set; }
        public string Comment { get; set; }
        public string AvatarPath { get; set; }
    }
}
