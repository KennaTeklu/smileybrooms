import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../features/cart/widgets/cart_button.dart';

class MainLayout extends StatefulWidget {
  final Widget child;
  
  const MainLayout({
    super.key,
    required this.child,
  });

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _currentIndex = 0;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _updateIndexFromRoute();
  }

  void _updateIndexFromRoute() {
    final location = GoRouter.of(context).location;
    
    if (location == '/') {
      _currentIndex = 0;
    } else if (location.startsWith('/services')) {
      _currentIndex = 1;
    } else if (location.startsWith('/calculator')) {
      _currentIndex = 2;
    } else if (location.startsWith('/booking')) {
      _currentIndex = 3;
    } else if (location.startsWith('/profile')) {
      _currentIndex = 4;
    }
  }

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
    
    switch (index) {
      case 0:
        GoRouter.of(context).go('/');
        break;
      case 1:
        GoRouter.of(context).go('/services');
        break;
      case 2:
        GoRouter.of(context).go('/calculator');
        break;
      case 3:
        GoRouter.of(context).go('/booking');
        break;
      case 4:
        GoRouter.of(context).go('/profile');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Smiley Brooms'),
        actions: const [
          CartButton(),
          SizedBox(width: 8),
        ],
      ),
      body: widget.child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: _onTabTapped,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.cleaning_services_outlined),
            selectedIcon: Icon(Icons.cleaning_services),
            label: 'Services',
          ),
          NavigationDestination(
            icon: Icon(Icons.calculate_outlined),
            selectedIcon: Icon(Icons.calculate),
            label: 'Calculator',
          ),
          NavigationDestination(
            icon: Icon(Icons.calendar_today_outlined),
            selectedIcon: Icon(Icons.calendar_today),
            label: 'Bookings',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
