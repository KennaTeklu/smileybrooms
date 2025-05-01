import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:smiley_brooms/screens/home_screen.dart';
import 'package:smiley_brooms/screens/auth/login_screen.dart';
import 'package:smiley_brooms/screens/auth/register_screen.dart';
import 'package:smiley_brooms/screens/calculator_screen.dart';
import 'package:smiley_brooms/screens/cart_screen.dart';
import 'package:smiley_brooms/screens/checkout_screen.dart';
import 'package:smiley_brooms/screens/contact_screen.dart';
import 'package:smiley_brooms/screens/downloads_screen.dart';
import 'package:smiley_brooms/screens/profile_screen.dart';
import 'package:smiley_brooms/screens/service_details_screen.dart';
import 'package:smiley_brooms/screens/success_screen.dart';
import 'package:smiley_brooms/screens/about_screen.dart';
import 'package:smiley_brooms/screens/careers_screen.dart';
import 'package:smiley_brooms/screens/splash_screen.dart';
import 'package:smiley_brooms/widgets/layout/main_layout.dart';

class AppRouter {
  static final _rootNavigatorKey = GlobalKey<NavigatorState>();
  static final _shellNavigatorKey = GlobalKey<NavigatorState>();

  static final GoRouter router = GoRouter(
    initialLocation: '/',
    navigatorKey: _rootNavigatorKey,
    routes: [
      // Splash screen
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      
      // Authentication routes
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      
      // Main app shell with bottom navigation
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) => MainLayout(child: child),
        routes: [
          // Home tab
          GoRoute(
            path: '/',
            builder: (context, state) => const HomeScreen(),
            routes: [
              GoRoute(
                path: 'service/:id',
                builder: (context, state) {
                  final serviceId = state.params['id']!;
                  return ServiceDetailsScreen(serviceId: serviceId);
                },
              ),
            ],
          ),
          
          // Calculator tab
          GoRoute(
            path: '/calculator',
            builder: (context, state) => const CalculatorScreen(),
          ),
          
          // Downloads tab
          GoRoute(
            path: '/downloads',
            builder: (context, state) => const DownloadsScreen(),
          ),
          
          // Contact tab
          GoRoute(
            path: '/contact',
            builder: (context, state) => const ContactScreen(),
          ),
          
          // Profile tab
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),
      
      // Other routes outside the main shell
      GoRoute(
        path: '/cart',
        builder: (context, state) => const CartScreen(),
      ),
      GoRoute(
        path: '/checkout',
        builder: (context, state) => const CheckoutScreen(),
      ),
      GoRoute(
        path: '/success',
        builder: (context, state) => const SuccessScreen(),
      ),
      GoRoute(
        path: '/about',
        builder: (context, state) => const AboutScreen(),
      ),
      GoRoute(
        path: '/careers',
        builder: (context, state) => const CareersScreen(),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Text('Page not found: ${state.location}'),
      ),
    ),
  );
}
