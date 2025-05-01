import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:smiley_brooms/providers/auth_provider.dart';
import 'package:smiley_brooms/providers/theme_provider.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);
    
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              color: Theme.of(context).primaryColor,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Image.asset(
                  'assets/images/logo_white.png',
                  height: 60,
                ),
                const SizedBox(height: 10),
                Text(
                  authProvider.isAuthenticated 
                      ? 'Hello, ${authProvider.user?.displayName ?? 'User'}'
                      : 'Welcome to Smiley Brooms',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                  ),
                ),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.home),
            title: const Text('Home'),
            onTap: () {
              context.go('/');
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.calculate),
            title: const Text('Price Calculator'),
            onTap: () {
              context.go('/calculator');
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.info),
            title: const Text('About Us'),
            onTap: () {
              context.go('/about');
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.contact_support),
            title: const Text('Contact'),
            onTap: () {
              context.go('/contact');
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.work),
            title: const Text('Careers'),
            onTap: () {
              context.go('/careers');
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.download),
            title: const Text('Downloads'),
            onTap: () {
              context.go('/downloads');
              Navigator.pop(context);
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.shopping_cart),
            title: const Text('Cart'),
            onTap: () {
              context.go('/cart');
              Navigator.pop(context);
            },
          ),
          if (authProvider.isAuthenticated)
            ListTile(
              leading: const Icon(Icons.person),
              title: const Text('Profile'),
              onTap: () {
                context.go('/profile');
                Navigator.pop(context);
              },
            ),
          ListTile(
            leading: Icon(themeProvider.isDarkMode ? Icons.light_mode : Icons.dark_mode),
            title: Text(themeProvider.isDarkMode ? 'Light Mode' : 'Dark Mode'),
            onTap: () {
              themeProvider.toggleTheme();
              Navigator.pop(context);
            },
          ),
          const Divider(),
          if (authProvider.isAuthenticated)
            ListTile(
              leading: const Icon(Icons.logout),
              title: const Text('Logout'),
              onTap: () async {
                await authProvider.signOut();
                Navigator.pop(context);
                context.go('/');
              },
            )
          else
            ListTile(
              leading: const Icon(Icons.login),
              title: const Text('Login'),
              onTap: () {
                context.go('/login');
                Navigator.pop(context);
              },
            ),
        ],
      ),
    );
  }
}
