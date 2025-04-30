using Microsoft.Extensions.Logging;
using SmileyBroomsWindows.ViewModels;
using System.ComponentModel;
using System.Windows;

namespace SmileyBroomsWindows
{
    public partial class MainWindow : Window
    {
        private readonly ILogger<MainWindow> _logger;
        private readonly MainViewModel _viewModel;
        private readonly SettingsService _settingsService;

        public MainWindow(
            ILogger<MainWindow> logger,
            MainViewModel viewModel,
            SettingsService settingsService)
        {
            InitializeComponent();

            _logger = logger;
            _viewModel = viewModel;
            _settingsService = settingsService;

            DataContext = _viewModel;

            Loaded += MainWindow_Loaded;
            Closing += MainWindow_Closing;
        }

        private void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            _logger.LogInformation("Application started");
            
            // Initialize the view model
            _viewModel.Initialize();
            
            // Apply window state from settings
            if (_settingsService.GetSetting<bool>("AppSettings:MinimizeToTray") && 
                _settingsService.GetSetting<bool>("AppSettings:StartMinimized"))
            {
                WindowState = WindowState.Minimized;
                if (_settingsService.GetSetting<bool>("AppSettings:HideWhenMinimized"))
                {
                    Hide();
                }
            }
        }

        private void MainWindow_Closing(object sender, CancelEventArgs e)
        {
            if (_settingsService.GetSetting<bool>("AppSettings:MinimizeToTray") && 
                _settingsService.GetSetting<bool>("AppSettings:MinimizeOnClose"))
            {
                e.Cancel = true;
                WindowState = WindowState.Minimized;
                if (_settingsService.GetSetting<bool>("AppSettings:HideWhenMinimized"))
                {
                    Hide();
                }
            }
            else
            {
                _logger.LogInformation("Application closing");
            }
        }
    }
}
