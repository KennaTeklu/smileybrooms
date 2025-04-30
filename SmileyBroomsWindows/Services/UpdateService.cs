using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SmileyBroomsWindows.Models;
using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows;

namespace SmileyBroomsWindows.Services
{
    public class UpdateService
    {
        private readonly ILogger<UpdateService> _logger;
        private readonly HttpClient _httpClient;
        private readonly SettingsService _settingsService;
        private readonly Version _currentVersion;

        public UpdateService(
            ILogger<UpdateService> logger,
            HttpClient httpClient,
            SettingsService settingsService)
        {
            _logger = logger;
            _httpClient = httpClient;
            _settingsService = settingsService;
            _currentVersion = new Version(1, 0, 0); // Should match the app version
        }

        public async Task CheckForUpdatesAsync()
        {
            try
            {
                if (!_settingsService.GetSetting<bool>("AppSettings:CheckForUpdatesOnStartup"))
                {
                    return;
                }

                _logger.LogInformation("Checking for updates");
                var response = await _httpClient.GetStringAsync("windows-update");
                var updateInfo = JsonConvert.DeserializeObject<UpdateInfo>(response);

                if (updateInfo != null && new Version(updateInfo.Version) > _currentVersion)
                {
                    _logger.LogInformation($"Update available: {updateInfo.Version}");
                    var result = MessageBox.Show(
                        $"A new version ({updateInfo.Version}) is available. Would you like to download it now?\n\nRelease Notes:\n{updateInfo.ReleaseNotes}",
                        "Update Available",
                        MessageBoxButton.YesNo,
                        MessageBoxImage.Information);

                    if (result == MessageBoxResult.Yes)
                    {
                        await DownloadAndInstallUpdateAsync(updateInfo.DownloadUrl);
                    }
                }
                else
                {
                    _logger.LogInformation("No updates available");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking for updates");
            }
        }

        private async Task DownloadAndInstallUpdateAsync(string downloadUrl)
        {
            try
            {
                _logger.LogInformation($"Downloading update from {downloadUrl}");
                
                // Show progress window
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
                _logger.LogInformation("Update downloaded successfully");

                // Run the installer
                var startInfo = new ProcessStartInfo
                {
                    FileName = tempFile,
                    UseShellExecute = true,
                    Verb = "runas" // Request admin privileges
                };

                Process.Start(startInfo);
                _logger.LogInformation("Installer started");

                // Close the application to allow the installer to run
                Application.Current.Shutdown();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading or installing update");
                MessageBox.Show(
                    $"Failed to download or install the update: {ex.Message}",
                    "Update Failed",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }
    }
}
