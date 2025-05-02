using System.Windows.Controls;

namespace SmileyBroomsWindows.Services
{
    public class NavigationService
    {
        private Frame _frame;

        public void Initialize(Frame frame)
        {
            _frame = frame;
        }

        public void Navigate(UserControl view)
        {
            _frame.Content = view;
        }

        public void GoBack()
        {
            if (_frame.CanGoBack)
            {
                _frame.GoBack();
            }
        }
    }
}
