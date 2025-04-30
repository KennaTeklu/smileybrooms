using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows;
using Newtonsoft.Json;

namespace SmileyBroomsWindows.Services
{
    public class UpdateService
    {
        private readonly HttpClient _httpClient;
        private readonly string _updateUrl = "https://www.smileybrooms.com/api/windows-update";
        private readonly Version _currentVersion;

        public UpdateService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _currentVersion = new Version(1, 0, 0); // Should match the app version
        }

        public async Task CheckForUpdatesAsync()
        {
            try
            {
                var response = await _httpClient.GetStringAsync(_updateUrl);
                var updateInfo = JsonConvert.DeserializeObject<UpdateInfo>(response);

                if (updateInfo != null && new Version(updateInfo.Version) > _currentVersion)
                {
                    var result = MessageBox.Show(
                        $"A new version ({updateInfo.Version}) is available. Would you like to download it now?",
                        "Update Available",
                        MessageBoxButton.YesNo,
                        MessageBoxImage.Information);

                    if (result == MessageBoxResult.Yes)
                    {
                        await DownloadAndInstallUpdateAsync(updateInfo.DownloadUrl);
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the error but don't show it to the user
                Debug.WriteLine($"Error checking for updates: {ex.Message}");
            }
        }

        private async Task DownloadAndInstallUpdateAsync(string downloadUrl)
        {
            try
            {
                // Show download progress
                var progressWindow = new ProgressWindow("Downloading Update");
                progressWindow.Show();

                // Download the installer
                var tempFile = Path.Combine(Path.GetTempPath(), "SmileyBroomsSetup.exe");
                using (var response = await _httpClient.GetAsync(downloadUrl, HttpCompletionOption.ResponseHeadersRead))
                {
                    response.EnsureSuccessStatusCode();
                    var totalBytes = response.Content.Headers.ContentLength ?? -1L;
                    using (var contentStream = await response.Content.ReadAsStreamAsync())
                    using (var fileStream = new FileStream(tempFile, FileMode.Create, FileAccess.Write, FileShare.None))
                    {
                        var buffer = new byte[8192];
                        var bytesRead = 0;
                        var totalBytesRead = 0L;

                        while ((bytesRead = await contentStream.ReadAsync(buffer, 0, buffer.Length)) > 0)
                        {
                            await fileStream.WriteAsync(buffer, 0, bytesRead);
                            totalBytesRead += bytesRead;

                            if (totalBytes > 0)
                            {
                                var progressPercentage = (double)totalBytesRead / totalBytes;
                                progressWindow.UpdateProgress(progressPercentage);
                            }
                        }
                    }
                }

                progressWindow.Close();

                // Run the installer
                var startInfo = new ProcessStartInfo
                {
                    FileName = tempFile,
                    UseShellExecute = true,
                    Verb = "runas" // Request admin privileges
                };

                Process.Start(startInfo);

                // Close the application to allow the installer to run
                Application.Current.Shutdown();
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    $"Failed to download or install the update: {ex.Message}",
                    "Update Failed",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }

        private class UpdateInfo
        {
            public string Version { get; set; }
            public string DownloadUrl { get; set; }
            public string ReleaseNotes { get; set; }
        }
    }

    public class ProgressWindow : Window
    {
        private System.Windows.Controls.ProgressBar _progressBar;

        public ProgressWindow(string title)
        {
            Title = title;
            Width = 400;
            Height = 100;
            WindowStartupLocation = WindowStartupLocation.CenterScreen;
            ResizeMode = ResizeMode.NoResize;

            var grid = new System.Windows.Controls.Grid();
            Content = grid;

            _progressBar = new System.Windows.Controls.ProgressBar
            {
                Margin = new Thickness(20),
                Height = 20
            };

            grid.Children.Add(_progressBar);
        }

        public void UpdateProgress(double progress)
        {
            Dispatcher.Invoke(() => _progressBar.Value = progress * 100);
        }
    }
}
