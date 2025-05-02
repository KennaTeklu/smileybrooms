using System.Windows;
using System.Windows.Input;

namespace SmileyBroomsWindows.ViewModels
{
    public class NotifyIconViewModel : ViewModelBase
    {
        public NotifyIconViewModel()
        {
            ShowWindowCommand = new RelayCommand(ShowWindow);
            ExitApplicationCommand = new RelayCommand(ExitApplication);
        }

        public ICommand ShowWindowCommand { get; }
        public ICommand ExitApplicationCommand { get; }

        private void ShowWindow()
        {
            Application.Current.MainWindow.Show();
            Application.Current.MainWindow.WindowState = WindowState.Normal;
            Application.Current.MainWindow.Activate();
        }

        private void ExitApplication()
        {
            Application.Current.Shutdown();
        }
    }
}
