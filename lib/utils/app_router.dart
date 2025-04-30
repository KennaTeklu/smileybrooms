import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../screens/home_screen.dart';
import '../screens/calculator_screen.dart';
import '../screens/cart_screen.dart';
import '../screens/checkout_screen.dart';
import '../screens/login_screen.dart';
import '../screens/register_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/service_details_screen.dart';
import '../screens/downloads_screen.dart';
import '../screens/about_screen.dart';
import '../screens/contact_screen.dart';
import '../screens/success_screen.dart';
import '../screens/canceled_screen.dart';
import '../widgets/layout/main_layout.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'root');
final GlobalKey<NavigatorState> _shellNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'shell');

final appRouter = GoRouter(
  navigatorKey: _rootNavigatorKey,
  initialLocation: '/',
  debugLogDiagnostics: true,
  redirect: (context, state) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final isLoggedIn = authProvider.isLoggedIn;
    
    // List of paths that require authentication
    final authRequiredPaths = ['/profile', '/checkout'];
    
    // Check if the current path requires authentication
    final requiresAuth = authRequiredPaths.any(
      (path) => state.matchedLocation.startsWith(path),
    );
    
    // If the path requires auth and the user is not logged in, redirect to login
    if (requiresAuth && !isLoggedIn) {
      return '/login?redirect=${state.matchedLocation}';
    }
    
    // If the user is logged in and trying to access login/register, redirect to home
    if (isLoggedIn && 
        (state.matchedLocation == '/login' || state.matchedLocation == '/register')) {
      return '/';
    }
    
    // No redirect needed
    return null;
  },
  routes: [
    ShellRoute(
      navigatorKey: _shellNavigatorKey,
      builder: (context, state, child) => MainLayout(child: child),
      routes: [
        GoRoute(
          path: '/',
          pageBuilder: (context, state) => NoTransitionPage(
            key: state.pageKey,
            child: const HomeScreen(),
          ),
        ),
        GoRoute(
          path: '/calculator',
          pageBuilder: (context, state) => NoTransitionPage(
            key: state.pageKey,
            child: const CalculatorScreen(),
          ),
        ),
        GoRoute(
          path: '/cart',
          pageBuilder: (context, state) => NoTransitionPage(
            key: state.pageKey,
            child: const CartScreen(),
          ),
        ),
        GoRoute(
          path: '/service/:id',
          pageBuilder: (context, state) {
            final id = state.pathParameters['id']!;
            return NoTransitionPage(
              key: state.pageKey,
              child: ServiceDetailsScreen(serviceId: id),
            );
          },
        ),
        GoRoute(
          path: '/downloads',
          pageBuilder: (context, state) => NoTransitionPage(
            key: state.pageKey,
            child: const DownloadsScreen(),
          ),
        ),
        GoRoute(
          path: '/about',
          pageBuilder: (context, state) => NoTransitionPage(
            key: state.pageKey,
            child: const AboutScreen(),
          ),
        ),
        GoRoute(
          path: '/contact',
          pageBuilder: (context, state) => NoTransitionPage(
            key: state.pageKey,
            child: const ContactScreen(),
          ),
        ),
        GoRoute(
          path: '/profile',
          pageBuilder: (context, state) => NoTransitionPage(
            key: state.pageKey,
            child: const ProfileScreen(),
          ),
        ),
      ],
    ),
    // Routes that don't use the shell (full screen routes)
    GoRoute(
      path: '/login',
      pageBuilder: (context, state) {
        final redirect = state.uri.queryParameters['redirect'] ?? '/';
        return MaterialPage(
          key: state.pageKey,
          child: LoginScreen(redirectPath: redirect),
        );
      },
    ),
    GoRoute(
      path: '/register',
      pageBuilder: (context, state) => MaterialPage(
        key: state.pageKey,
        child: const RegisterScreen(),
      ),
    ),
    GoRoute(
      path: '/checkout',
      pageBuilder: (context, state) => MaterialPage(
        key: state.pageKey,
        child: const CheckoutScreen(),
      ),
    ),
    GoRoute(
      path: '/success',
      pageBuilder: (context, state) => MaterialPage(
        key: state.pageKey,
        child: const SuccessScreen(),
      ),
    ),
    GoRoute(
      path: '/canceled',
      pageBuilder: (context, state) => MaterialPage(
        key: state.pageKey,
        child: const CanceledScreen(),
      ),
    ),
  ],
);
