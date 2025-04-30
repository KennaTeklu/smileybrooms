using Microsoft.Extensions.Logging;
using System.Windows.Controls;

namespace SmileyBroomsWindows.Services
{
    public class NavigationService
    {
        private readonly ILogger<NavigationService> _logger;
        private Frame _navigationFrame;

        public NavigationService(ILogger<NavigationService> logger)
        {
            _logger = logger;
        }

        public void Initialize(Frame navigationFrame)
        {
            _navigationFrame = navigationFrame;
        }

        public void Navigate(UserControl view)
        {
            if (_navigationFrame != null)
            {
                _logger.LogInformation($"Navigating to {view.GetType().Name}");
                _navigationFrame.Content = view;
            }
        }
    }
}
