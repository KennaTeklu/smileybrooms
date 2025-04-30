import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../widgets/home/hero.dart';
import '../widgets/home/features.dart';
import '../widgets/home/how_it_works.dart';
import '../widgets/home/testimonials.dart';
import '../widgets/home/faq.dart';
import '../widgets/home/call_to_action.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            HeroSection(
              onGetStarted: () => context.go('/calculator'),
            ),
            const FeaturesSection(),
            const HowItWorksSection(),
            const TestimonialsSection(),
            const FAQSection(),
            CallToActionSection(
              onGetStarted: () => context.go('/calculator'),
            ),
          ],
        ),
      ),
    );
  }
}
