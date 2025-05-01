/// Constants used throughout the app
class AppConstants {
  // App info
  static const String appName = 'Smiley Brooms';
  static const String appVersion = '2.0.0';
  static const String appBuildNumber = '21';
  
  // API URLs
  static const String baseApiUrl = 'https://api.smileybrooms.com';
  static const String termsUrl = 'https://smileybrooms.com/terms';
  static const String privacyPolicyUrl = 'https://smileybrooms.com/privacy';
  static const String supportUrl = 'https://smileybrooms.com/support';
  
  // Features flags
  static const bool enableDynamicTheme = true;
  static const bool enablePushNotifications = true;
  static const bool enableCrashReporting = true;
  static const bool enableAnalytics = true;
  
  // Hive box names
  static const String settingsBox = 'settings';
  static const String userBox = 'user';
  static const String cartBox = 'cart';
  
  // Cache durations
  static const Duration cacheDuration = Duration(days: 7);
  static const Duration sessionTimeout = Duration(minutes: 30);
  
  // Pagination
  static const int paginationLimit = 10;
  
  // Animation durations
  static const Duration shortAnimationDuration = Duration(milliseconds: 200);
  static const Duration mediumAnimationDuration = Duration(milliseconds: 400);
  static const Duration longAnimationDuration = Duration(milliseconds: 800);
  
  // Network timeouts
  static const Duration connectionTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  
  // Validation regex patterns
  static const String emailPattern = 
      r'^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]+';
  static const String passwordPattern = 
      r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$';
  static const String phonePattern = 
      r'^\+?[0-9]{10,15}$';
  
  // Minimum values
  static const double minimumOrderAmount = 50.0;
}
