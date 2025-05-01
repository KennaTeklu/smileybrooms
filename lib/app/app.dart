import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_displaymode/flutter_displaymode.dart';
import 'package:flutter_portal/flutter_portal.dart';
import 'package:provider/provider.dart';

import '../core/navigation/app_router.dart';
import '../core/theme/app_theme.dart';
import '../features/settings/providers/theme_provider.dart';

class SmileyBroomsApp extends StatefulWidget {
  const SmileyBroomsApp({super.key});

  @override
  State<SmileyBroomsApp> createState() => _SmileyBroomsAppState();
}

class _SmileyBroomsAppState extends State<SmileyBroomsApp> {
  @override
  void initState() {
    super.initState();
    _setOptimalDisplayMode();
  }

  // Set the highest refresh rate for the device
  Future<void> _setOptimalDisplayMode() async {
    try {
      final List<DisplayMode> supported = await FlutterDisplayMode.supported;
      final DisplayMode active = await FlutterDisplayMode.active;

      final List<DisplayMode> sameResolution = supported
          .where((DisplayMode m) => m.width == active.width && m.height == active.height)
          .toList()
        ..sort((DisplayMode a, DisplayMode b) => b.refreshRate.compareTo(a.refreshRate));

      final DisplayMode mostOptimalMode = sameResolution.isNotEmpty
          ? sameResolution.first
          : active;

      await FlutterDisplayMode.setPreferredMode(mostOptimalMode);
    } catch (e) {
      // If we're on a platform that doesn't support this, just ignore
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, _) {
        return Portal(
          child: MaterialApp.router(
            title: 'Smiley Brooms',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: themeProvider.themeMode,
            routerConfig: AppRouter.router,
            localizationsDelegates: context.localizationDelegates,
            supportedLocales: context.supportedLocales,
            locale: context.locale,
            builder: (context, child) {
              return MediaQuery(
                // Ensure the app never scales with system font size
                data: MediaQuery.of(context).copyWith(textScaler: const TextScaler.linear(1.0)),
                child: child!,
              );
            },
          ),
        );
      },
    );
  }
}
