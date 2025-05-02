using System;
using System.Windows;

namespace SmileyBroomsWindows.Views
{
    public partial class ProgressWindow : Window
    {
        public event EventHandler CancelRequested;
        
        public ProgressWindow()
        {
            InitializeComponent();
        }
        
        public ProgressWindow(string title, string message, bool canCancel = true) : this()
        {
            TitleTextBlock.Text = title;
            MessageTextBlock.Text = message;
            CancelButton.Visibility = canCancel ? Visibility.Visible : Visibility.Collapsed;
        }
        
        public void UpdateProgress(double value, double maximum)
        {
            if (Dispatcher.CheckAccess())
            {
                ProgressBar.IsIndeterminate = false;
                ProgressBar.Minimum = 0;
                ProgressBar.Maximum = maximum;
                ProgressBar.Value = value;
            }
            else
            {
                Dispatcher.Invoke(() => UpdateProgress(value, maximum));
            }
        }
        
        public void UpdateMessage(string message)
        {
            if (Dispatcher.CheckAccess())
            {
                MessageTextBlock.Text = message;
            }
            else
            {
                Dispatcher.Invoke(() => MessageTextBlock.Text = message);
            }
        }
        
        private void CancelButton_Click(object sender, RoutedEventArgs e)
        {
            CancelRequested?.Invoke(this, EventArgs.Empty);
            Close();
        }
    }
}
