import 'dart:io';

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// Service for handling app notifications
class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _flutterLocalNotificationsPlugin = 
      FlutterLocalNotificationsPlugin();
      
  bool _isInitialized = false;

  /// Initialize the notification service
  Future<void> init() async {
    if (_isInitialized) return;
    
    // Initialize local notifications
    const AndroidInitializationSettings androidInitializationSettings = 
        AndroidInitializationSettings('@mipmap/ic_launcher');
        
    final DarwinInitializationSettings iosInitializationSettings = 
        DarwinInitializationSettings(
          requestAlertPermission: false,
          requestBadgePermission: false,
          requestSoundPermission: false,
          onDidReceiveLocalNotification: _onDidReceiveLocalNotification,
        );
        
    final InitializationSettings initializationSettings = InitializationSettings(
      android: androidInitializationSettings,
      iOS: iosInitializationSettings,
    );
    
    await _flutterLocalNotificationsPlugin.initialize(
      initializationSettings,
      onDidReceiveNotificationResponse: _onDidReceiveNotificationResponse,
    );
    
    // Configure notification channels for Android
    if (Platform.isAndroid) {
      await _configureAndroidNotificationChannels();
    }
    
    // Configure Firebase Messaging handlers
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
    
    _isInitialized = true;
  }

  /// Request notification permissions
  Future<bool> requestPermissions() async {
    if (Platform.isIOS) {
      final settings = await FirebaseMessaging.instance.requestPermission(
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: true,
        sound: true,
      );
      
      return settings.authorizationStatus == AuthorizationStatus.authorized ||
          settings.authorizationStatus == AuthorizationStatus.provisional;
    } else if (Platform.isAndroid) {
      final AndroidFlutterLocalNotificationsPlugin? androidPlugin = 
          _flutterLocalNotificationsPlugin.resolvePlatformSpecificImplementation<
              AndroidFlutterLocalNotificationsPlugin>();
              
      final result = await androidPlugin?.requestPermission();
      return result ?? false;
    }
    
    return false;
  }

  /// Show a local notification
  Future<void> showNotification({
    required String title,
    required String body,
    String? payload,
    int id = 0,
  }) async {
    const AndroidNotificationDetails androidNotificationDetails =
        AndroidNotificationDetails(
      'default_channel',
      'Default Channel',
      channelDescription: 'Default notification channel',
      importance: Importance.max,
      priority: Priority.high,
      showWhen: true,
    );
    
    const DarwinNotificationDetails iosNotificationDetails =
        DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );
    
    const NotificationDetails notificationDetails = NotificationDetails(
      android: androidNotificationDetails,
      iOS: iosNotificationDetails,
    );
    
    await _flutterLocalNotificationsPlugin.show(
      id,
      title,
      body,
      notificationDetails,
      payload: payload,
    );
  }

  /// Configure notification channels for Android
  Future<void> _configureAndroidNotificationChannels() async {
    const AndroidNotificationChannel defaultChannel = AndroidNotificationChannel(
      'default_channel',
      'Default Channel',
      description: 'Default notification channel',
      importance: Importance.high,
    );
    
    const AndroidNotificationChannel bookingChannel = AndroidNotificationChannel(
      'booking_channel',
      'Booking Updates',
      description: 'Notification channel for booking updates',
      importance: Importance.high,
    );
    
    const AndroidNotificationChannel promotionalChannel = AndroidNotificationChannel(
      'promotional_channel',
      'Promotions',
      description: 'Notification channel for promotions and offers',
      importance: Importance.defaultImportance,
    );
    
    final AndroidFlutterLocalNotificationsPlugin? androidNotificationsPlugin =
        _flutterLocalNotificationsPlugin.resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>();
            
    await androidNotificationsPlugin?.createNotificationChannel(defaultChannel);
    await androidNotificationsPlugin?.createNotificationChannel(bookingChannel);
    await androidNotificationsPlugin?.createNotificationChannel(promotionalChannel);
  }

  /// Handle incoming foreground Firebase messages
  void _handleForegroundMessage(RemoteMessage message) {
    debugPrint('Got a message in the foreground!');
    debugPrint('Message data: ${message.data}');
    
    if (message.notification != null) {
      debugPrint('Message notification: ${message.notification!.title}');
      debugPrint('Message notification: ${message.notification!.body}');
      
      // Show local notification for foreground messages
      showNotification(
        title: message.notification!.title ?? 'New Message',
        body: message.notification!.body ?? '',
        payload: message.data.toString(),
      );
    }
  }

  /// Handle local notification taps
  void _onDidReceiveNotificationResponse(NotificationResponse response) {
    debugPrint('Notification response received: ${response.payload}');
    // Handle notification tap
    // You can navigate to specific screens based on the payload
  }

  /// iOS foreground notification handler
  void _onDidReceiveLocalNotification(
      int id, String? title, String? body, String? payload) {
    debugPrint('Local notification received: $title');
    // Handle iOS foreground notification
  }
}
