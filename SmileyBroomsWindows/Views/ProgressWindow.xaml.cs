using System.Windows;

namespace SmileyBroomsWindows.Views
{
    public partial class ProgressWindow : Window
    {
        public ProgressWindow(string title)
        {
            InitializeComponent();
            Title = title;
            StatusText.Text = "Processing...";
        }

        public void UpdateProgress(double progress)
        {
            Dispatcher.Invoke(() => 
            {
                ProgressBar.Value = progress * 100;
                StatusText.Text = $"Processing... {progress * 100:F0}%";
            });
        }

        public void UpdateStatus(string status)
        {
            Dispatcher.Invoke(() => 
            {
                StatusText.Text = status;
            });
        }
    }
}
