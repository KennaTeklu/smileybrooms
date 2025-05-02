import 'package:flutter/material.dart';

enum ServiceType {
  standard,
  deep,
  movingIn,
  movingOut,
}

class ServiceTypeSelector extends StatelessWidget {
  final ServiceType selectedType;
  final Function(ServiceType) onTypeSelected;

  const ServiceTypeSelector({
    Key? key,
    required this.selectedType,
    required this.onTypeSelected,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Service Type',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8.0,
              runSpacing: 8.0,
              children: [
                _buildServiceTypeChip(
                  context,
                  ServiceType.standard,
                  'Standard Cleaning',
                  'Regular cleaning for maintained homes',
                ),
                _buildServiceTypeChip(
                  context,
                  ServiceType.deep,
                  'Deep Cleaning',
                  'Thorough cleaning for neglected areas',
                ),
                _buildServiceTypeChip(
                  context,
                  ServiceType.movingIn,
                  'Moving In',
                  'Fresh start for your new home',
                ),
                _buildServiceTypeChip(
                  context,
                  ServiceType.movingOut,
                  'Moving Out',
                  'Leave your old place spotless',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildServiceTypeChip(
    BuildContext context,
    ServiceType type,
    String label,
    String description,
  ) {
    final isSelected = selectedType == type;

    return GestureDetector(
      onTap: () => onTypeSelected(type),
      child: Container### Smiley Brooms Android Application Development

I'll create a comprehensive Flutter-based Android application that mirrors your web application's functionality while optimizing for mobile experiences. Flutter will allow for potential iOS expansion in the future.

First, let's set up the project structure and core files:

```dart file="lib/main.dart"
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:provider/provider.dart';
import 'package:smiley_brooms/firebase_options.dart';
import 'package:smiley_brooms/providers/auth_provider.dart';
import 'package:smiley_brooms/providers/cart_provider.dart';
import 'package:smiley_brooms/providers/theme_provider.dart';
import 'package:smiley_brooms/services/notification_service.dart';
import 'package:smiley_brooms/utils/app_router.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  print("Handling a background message: ${message.messageId}");
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Load environment variables
  await dotenv.load(fileName: ".env");
  
  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  
  // Initialize Stripe
  Stripe.publishableKey = dotenv.env['STRIPE_PUBLISHABLE_KEY'] ?? '';
  await Stripe.instance.applySettings();
  
  // Set up background message handler
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  
  // Initialize notification service
  await NotificationService().init();
  
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, child) {
          return MaterialApp.router(
            title: 'Smiley Brooms',
            theme: ThemeData(
              primarySwatch: Colors.blue,
              brightness: Brightness.light,
              fontFamily: 'Inter',
            ),
            darkTheme: ThemeData(
              primarySwatch: Colors.blue,
              brightness: Brightness.dark,
              fontFamily: 'Inter',
            ),
            themeMode: themeProvider.themeMode,
            routerConfig: AppRouter.router,
            debugShowCheckedModeBanner: false,
          );
        },
      ),
    );
  }
}
