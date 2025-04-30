using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SmileyBroomsWindows.Services;
using SmileyBroomsWindows.ViewModels;
using SmileyBroomsWindows.Views;
using Serilog;
using System;
using System.IO;
using System.Windows;
using Hardcodet.Wpf.TaskbarNotification;

namespace SmileyBroomsWindows
{
    public partial class App : Application
    {
        public IServiceProvider ServiceProvider { get; private set; }
        public IConfiguration Configuration { get; private set; }
        private TaskbarIcon _notifyIcon;

        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            // Configure services
            var serviceCollection = new ServiceCollection();
            ConfigureServices(serviceCollection);

            ServiceProvider = serviceCollection.BuildServiceProvider();

            // Initialize database
            var databaseService = ServiceProvider.GetRequiredService<DatabaseService>();
            databaseService.Initialize();

            // Initialize notification icon
            _notifyIcon = (TaskbarIcon)FindResource("NotifyIcon");
            if (_notifyIcon != null)
            {
                _notifyIcon.DataContext = ServiceProvider.GetRequiredService<NotifyIconViewModel>();
            }

            // Show main window
            var mainWindow = ServiceProvider.GetRequiredService<MainWindow>();
            mainWindow.Show();

            // Check for updates
            var updateService = ServiceProvider.GetRequiredService<UpdateService>();
            updateService.CheckForUpdatesAsync().ConfigureAwait(false);
        }

        private void ConfigureServices(IServiceCollection services)
        {
            // Configuration
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

            Configuration = builder.Build();

            // Configure Serilog
            var logPath = Configuration.GetSection("Logging:File:Path").Value;
            var logDir = Path.GetDirectoryName(logPath);
            if (!Directory.Exists(logDir))
            {
                Directory.CreateDirectory(logDir);
            }

            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(Configuration)
                .WriteTo.File(logPath, rollingInterval: RollingInterval.Day)
                .CreateLogger();

            // Add logging
            services.AddLogging(builder =>
            {
                builder.AddSerilog(dispose: true);
            });

            // Add configuration
            services.AddSingleton(Configuration);

            // Add services
            services.AddSingleton<DatabaseService>();
            services.AddSingleton<UpdateService>();
            services.AddSingleton<NotificationService>();
            services.AddSingleton<ApiService>();
            services.AddSingleton<NavigationService>();
            services.AddSingleton<BookingService>();
            services.AddSingleton<SettingsService>();
            services.AddSingleton<CleaningService>();

            // Add view models
            services.AddSingleton<MainViewModel>();
            services.AddSingleton<HomeViewModel>();
            services.AddSingleton<ServicesViewModel>();
            services.AddSingleton<BookingsViewModel>();
            services.AddSingleton<SettingsViewModel>();
            services.AddSingleton<NotifyIconViewModel>();

            // Add views
            services.AddSingleton<MainWindow>();
            services.AddTransient<HomeView>();
            services.AddTransient<ServicesView>();
            services.AddTransient<BookingsView>();
            services.AddTransient<SettingsView>();

            // Add HttpClient
            services.AddHttpClient<ApiService>(client =>
            {
                client.BaseAddress = new Uri(Configuration["ApiSettings:BaseUrl"]);
                client.DefaultRequestHeaders.Add("x-api-key", Configuration["ApiSettings:ApiKey"]);
            });
        }

        protected override void OnExit(ExitEventArgs e)
        {
            _notifyIcon?.Dispose();
            Log.CloseAndFlush();
            base.OnExit(e);
        }
    }
}
