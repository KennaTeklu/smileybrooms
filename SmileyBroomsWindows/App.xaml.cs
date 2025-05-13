using Microsoft.Extensions.DependencyInjection;
using System;
using System.Windows;

namespace SmileyBroomsWindows
{
    public partial class App : Application
    {
        public IServiceProvider ServiceProvider { get; private set; }

        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            // Configure basic services
            var serviceCollection = new ServiceCollection();
            ConfigureServices(serviceCollection);

            ServiceProvider = serviceCollection.BuildServiceProvider();

            // Show main window
            var mainWindow = new MainWindow();
            mainWindow.Show();
        }

        private void ConfigureServices(IServiceCollection services)
        {
            // Basic services configuration
            // Empty template - functionality removed
        }
    }
}
