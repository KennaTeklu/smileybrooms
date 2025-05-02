import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:smiley_brooms/widgets/layout/app_drawer.dart';
import 'package:smiley_brooms/widgets/common/cart_button.dart';

class MainLayout extends StatefulWidget {
  final Widget child;
  
  const MainLayout({
    Key? key,
    required this.child,
  }) : super(key: key);

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _calculateSelectedIndex(BuildContext context) {
    final String location = GoRouterState.of(context).location;
    
    if (location.startsWith('/')) {
      if (location == '/') return 0;
      if (location.startsWith('/calculator')) return 1;
      if (location.startsWith('/downloads')) return 2;
      if (location.startsWith('/contact')) return 3;
      if (location.startsWith('/profile')) return 4;
    }
    
    return 0;
  }

  void _onItemTapped(int index, BuildContext context) {
    switch (index) {
      case 0:
        context.go('/');
        break;
      case 1:
        context.go('/calculator');
        break;
      case 2:
        context.go('/downloads');
        break;
      case 3:
        context.go('/contact');
        break;
      case 4:
        context.go('/profile');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Image.asset(
          'assets/images/logo.png',
          height: 40,
        ),
        actions: [
          CartButton(),
          IconButton(
            icon: const Icon(Icons.phone),
            onPressed: () {
              // Launch phone call
            },
          ),
        ],
      ),
      drawer: const AppDrawer(),
      body: widget.child,
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _calculateSelectedIndex(context),
        onTap: (index) => _onItemTapped(index, context),
        selectedItemColor: Theme.of(context).primaryColor,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calculate),
            label: 'Calculator',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.download),
            label: 'Downloads',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.contact_support),
            label: 'Contact',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
