import 'dart:async';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:provider/provider.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:talker/talker.dart';
import 'package:easy_localization/easy_localization.dart';

import 'app/app.dart';
import 'core/config/firebase_options.dart';
import 'core/services/analytics_service.dart';
import 'core/services/notification_service.dart';
import 'core/utils/app_constants.dart';
import 'features/auth/providers/auth_provider.dart';
import 'features/cart/providers/cart_provider.dart';
import 'features/settings/providers/theme_provider.dart';

/// Global logger instance
final talker = Talker();

/// Handle Firebase background messages
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // Initialize Firebase if not already done
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  
  // Log the background message event
  debugPrint('Handling a background message: ${message.messageId}');
}

/// Main entry point for the application
Future<void> main() async {
  // Keep splash screen visible during initialization
  final widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);
  
  // Initialize localization
  await EasyLocalization.ensureInitialized();
  
  // Error handling for the entire app
  await runZonedGuarded(() async {
    // Lock orientation to portrait
    await SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
    
    // Load environment variables
    await dotenv.load();
    
    // Initialize Hive local storage
    await Hive.initFlutter();
    await _initializeHiveBoxes();
    
    // Initialize Firebase services
    await _initializeFirebase();
    
    // Initialize local notifications service
    await NotificationService().init();
    
    // Initialize Sentry for error reporting
    await SentryFlutter.init(
      (options) {
        options.dsn = dotenv.env['SENTRY_DSN'] ?? '';
        options.tracesSampleRate = 1.0;
        options.enableAutoPerformanceTracing = true;
      },
      appRunner: () => runApp(
        EasyLocalization(
          supportedLocales: const [Locale('en'), Locale('es'), Locale('fr')],
          path: 'assets/translations',
          fallbackLocale: const Locale('en'),
          child: ScreenUtilInit(
            designSize: const Size(375, 812),
            minTextAdapt: true,
            splitScreenMode: true,
            builder: (context, child) => _provideServices(),
          ),
        ),
      ),
    );
    
    // Remove splash screen
    FlutterNativeSplash.remove();
  }, (error, stack) {
    // Log errors to Crashlytics, Sentry, and Talker
    FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
    Sentry.captureException(error, stackTrace: stack);
    talker.error('FATAL ERROR', error, stack);
    
    // Also print to console in debug mode
    if (kDebugMode) {
      print('FATAL ERROR: $error');
      print(stack);
    }
  });
}

/// Initialize Hive storage boxes
Future<void> _initializeHiveBoxes() async {
  await Hive.openBox<dynamic>(AppConstants.settingsBox);
  await Hive.openBox<dynamic>(AppConstants.userBox);
  await Hive.openBox<dynamic>(AppConstants.cartBox);
}

/// Initialize Firebase services
Future<void> _initializeFirebase() async {
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  
  // Set up Crashlytics
  FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterError;
  
  // Configure Firebase Messaging
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  
  // Request notification permissions
  await FirebaseMessaging.instance.requestPermission(
    alert: true,
    announcement: false,
    badge: true,
    carPlay: false,
    criticalAlert: false,
    provisional: true,
    sound: true,
  );
  
  // Initialize analytics service
  await AnalyticsService.instance.init();
}

/// Provide all services to the app
Widget _provideServices() {
  return MultiProvider(
    providers: [
      ChangeNotifierProvider(create: (_) => AuthProvider()),
      ChangeNotifierProvider(create: (_) => CartProvider()),
      ChangeNotifierProvider(create: (_) => ThemeProvider()),
    ],
    child: const SmileyBroomsApp(),
  );
}
