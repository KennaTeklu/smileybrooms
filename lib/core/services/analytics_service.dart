import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/foundation.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

/// Service for tracking analytics events across the app
class AnalyticsService {
  AnalyticsService._();
  static final AnalyticsService instance = AnalyticsService._();

  late final FirebaseAnalytics _analytics;
  bool _isInitialized = false;

  /// Initialize the analytics service
  Future<void> init() async {
    if (_isInitialized) return;
    
    _analytics = FirebaseAnalytics.instance;
    
    // Enable analytics collection based on build type
    await _analytics.setAnalyticsCollectionEnabled(!kDebugMode);
    
    _isInitialized = true;
  }

  /// Log a custom event
  Future<void> logEvent({
    required String name,
    Map<String, dynamic>? parameters,
  }) async {
    if (!_isInitialized) return;
    
    try {
      await _analytics.logEvent(
        name: name,
        parameters: parameters,
      );
      
      // Also log to Sentry for better error correlation
      await Sentry.addBreadcrumb(
        Breadcrumb(
          message: 'Analytics Event: $name',
          data: parameters,
          type: 'analytics',
          level: SentryLevel.info,
        ),
      );
    } catch (e, stackTrace) {
      debugPrint('Failed to log event $name: $e');
      await Sentry.captureException(e, stackTrace: stackTrace);
    }
  }

  /// Log screen view event
  Future<void> logScreenView(String screenName) async {
    if (!_isInitialized) return;
    
    try {
      await _analytics.logScreenView(
        screenName: screenName,
        screenClass: screenName,
      );
      
      await Sentry.addBreadcrumb(
        Breadcrumb(
          message: 'Screen View: $screenName',
          type: 'navigation',
          level: SentryLevel.info,
        ),
      );
    } catch (e, stackTrace) {
      debugPrint('Failed to log screen view $screenName: $e');
      await Sentry.captureException(e, stackTrace: stackTrace);
    }
  }

  /// Log user login event
  Future<void> logLogin({String? method}) async {
    if (!_isInitialized) return;
    
    try {
      await _analytics.logLogin(
        loginMethod: method ?? 'unknown',
      );
    } catch (e, stackTrace) {
      debugPrint('Failed to log login: $e');
      await Sentry.captureException(e, stackTrace: stackTrace);
    }
  }

  /// Log add to cart event
  Future<void> logAddToCart({
    required String itemId,
    required String itemName,
    required double price,
    required int quantity,
  }) async {
    if (!_isInitialized) return;
    
    try {
      await _analytics.logAddToCart(
        items: [
          AnalyticsEventItem(
            itemId: itemId,
            itemName: itemName,
            price: price,
            quantity: quantity,
          ),
        ],
      );
    } catch (e, stackTrace) {
      debugPrint('Failed to log add to cart: $e');
      await Sentry.captureException(e, stackTrace: stackTrace);
    }
  }

  /// Log begin checkout event
  Future<void> logBeginCheckout({
    required List<AnalyticsEventItem> items,
    required double total,
  }) async {
    if (!_isInitialized) return;
    
    try {
      await _analytics.logBeginCheckout(
        items: items,
        value: total,
        currency: 'USD',
      );
    } catch (e, stackTrace) {
      debugPrint('Failed to log begin checkout: $e');
      await Sentry.captureException(e, stackTrace: stackTrace);
    }
  }

  /// Set user ID for better tracking
  Future<void> setUserId(String userId) async {
    if (!_isInitialized) return;
    
    try {
      await _analytics.setUserId(id: userId);
      await Sentry.  return;
    
    try {
      await _analytics.setUserId(id: userId);
      await Sentry.configureScope((scope) {
        scope.setUser(SentryUser(id: userId));
      });
    } catch (e, stackTrace) {
      debugPrint('Failed to set user id: $e');
      await Sentry.captureException(e, stackTrace: stackTrace);
    }
  }

  /// Set user properties for segmentation
  Future<void> setUserProperty({
    required String name,
    required String value,
  }) async {
    if (!_isInitialized) return;
    
    try {
      await _analytics.setUserProperty(name: name, value: value);
    } catch (e, stackTrace) {
      debugPrint('Failed to set user property $name: $e');
      await Sentry.captureException(e, stackTrace: stackTrace);
    }
  }
}
