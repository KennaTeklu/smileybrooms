import 'package:flutter/material.dart';

import '../services/analytics_service.dart';

class AppRouteObserver extends NavigatorObserver {
  @override
  void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {
    _sendScreenView(route);
    super.didPush(route, previousRoute);
  }

  @override
  void didReplace({Route<dynamic>? newRoute, Route<dynamic>? oldRoute}) {
    if (newRoute != null) {
      _sendScreenView(newRoute);
    }
    super.didReplace(newRoute: newRoute, oldRoute: oldRoute);
  }

  @override
  void didPop(Route<dynamic> route, Route<dynamic>? previousRoute) {
    if (previousRoute != null) {
      _sendScreenView(previousRoute);
    }
    super.didPop(route, previousRoute);
  }

  void _sendScreenView(Route<dynamic> route) {
    final screenName = _getScreenNameFromRoute(route);
    if (screenName != null) {
      AnalyticsService.instance.logScreenView(screenName);
    }
  }

  String? _getScreenNameFromRoute(Route<dynamic> route) {
    final settings = route.settings;
    final name = settings.name;
    
    if (name != null && name.isNotEmpty) {
      return name;
    }
    
    // For routes without a name, try to determine from the route data
    if (settings.arguments is Map<String, dynamic>) {
      final args = settings.arguments as Map<String, dynamic>;
      return args['screen_name'] as String?;
    }
    
    // Extract from the route pattern
    final pattern = route.toString();
    if (pattern.contains('HomeScreen')) return 'home_screen';
    if (pattern.contains('CalculatorScreen')) return 'calculator_screen';
    if (pattern.contains('ServicesScreen')) return 'services_screen';
    if (pattern.contains('ServiceDetailsScreen')) return 'service_details_screen';
    if (pattern.contains('ProfileScreen')) return 'profile_screen';
    if (pattern.contains('BookingScreen')) return 'booking_screen';
    if (pattern.contains('LoginScreen')) return 'login_screen';
    if (pattern.contains('RegisterScreen')) return 'register_screen';
    if (pattern.contains('CheckoutScreen')) return 'checkout_screen';
    if (pattern.contains('SuccessScreen')) return 'success_screen';
    
    return null;
  }
}
