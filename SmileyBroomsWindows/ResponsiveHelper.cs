using System;
using System.Windows;

namespace SmileyBroomsWindows
{
    public static class ResponsiveHelper
    {
        public static void AdjustForScreenSize(Window window)
        {
            // Get the screen dimensions
            double screenWidth = SystemParameters.PrimaryScreenWidth;
            double screenHeight = SystemParameters.PrimaryScreenHeight;
            
            // Adjust window size based on screen size
            if (screenWidth < 1200)
            {
                window.Width = Math.Max(800, screenWidth * 0.9);
                window.Height = Math.Max(600, screenHeight * 0.9);
            }
            
            // Adjust font sizes and layouts for smaller screens
            if (screenWidth < 1024)
            {
                Application.Current.Resources["SmallScreenFontSize"] = 14.0;
                Application.Current.Resources["MediumScreenFontSize"] = 18.0;
                Application.Current.Resources["LargeScreenFontSize"] = 24.0;
            }
            else
            {
                Application.Current.Resources["SmallScreenFontSize"] = 16.0;
                Application.Current.Resources["MediumScreenFontSize"] = 20.0;
                Application.Current.Resources["LargeScreenFontSize"] = 28.0;
            }
        }
    }
}
