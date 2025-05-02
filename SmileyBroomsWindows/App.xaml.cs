using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SmileyBroomsWindows.Data.Database;
using SmileyBroomsWindows.Data.Repositories;
using SmileyBroomsWindows.Services;
using SmileyBroomsWindows.ViewModels;
using SmileyBroomsWindows.Views;
using Serilog;
using System;
using System.IO;
using System.Windows;

namespace SmileyBroomsWindows
{
    public partial class App : Application
    {
        public IServiceProvider ServiceProvider { get; private set; }
        public IConfiguration Configuration { get; private set; }

        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            // Configure services
            var serviceCollection = new ServiceCollection();
            ConfigureServices(serviceCollection);

            ServiceProvider = serviceCollection.BuildServiceProvider();

            // Initialize database
            var dbInitializer = ServiceProvider.GetRequiredService<DatabaseInitializer>();
            dbInitializer.Initialize();

            // Show main window
            var mainWindow = ServiceProvider.GetRequiredService<MainWindow>();
            mainWindow.Show();
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

            // Add database
            var connectionString = Configuration.GetConnectionString("DefaultConnection");
            services.AddSingleton(new DatabaseInitializer(connectionString, 
                new LoggerFactory().CreateLogger<DatabaseInitializer>()));

            // Add repositories
            services.AddSingleton(provider => 
                new ServiceRepository(connectionString, provider.GetRequiredService<ILogger<ServiceRepository>>()));
            services.AddSingleton(provider => 
                new BookingRepository(connectionString, provider.GetRequiredService<ILogger<BookingRepository>>()));
            services.AddSingleton(provider => 
                new SettingsRepository(connectionString, provider.GetRequiredService<ILogger<SettingsRepository>>()));

            // Add services
            services.AddSingleton<UpdateService>();
            services.AddSingleton<NotificationService>();
            services.AddSingleton<ApiService>();
            services.AddSingleton<NavigationService>();

            // Add view models
            services.AddSingleton<MainViewModel>();
            services.AddSingleton<HomeViewModel>();
            services.AddSingleton<ServicesViewModel>();
            services.AddSingleton<BookingsViewModel>();
            services.AddSingleton<SettingsViewModel>();

            // Add views
            services.AddSingleton<MainWindow>();
            services.AddTransient<HomeView>();
            services.AddTransient<ServicesView>();
            services.AddTransient<BookingsView>();
            services.AddTransient<SettingsView>();
        }

        protected override void OnExit(ExitEventArgs e)
        {
            Log.CloseAndFlush();
            base.OnExit(e);
        }
    }
}
