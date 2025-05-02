import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:smiley_brooms/models/service.dart';
import 'package:smiley_brooms/services/api_service.dart';
import 'package:smiley_brooms/widgets/home/hero_section.dart';
import 'package:smiley_brooms/widgets/home/features_section.dart';
import 'package:smiley_brooms/widgets/home/testimonials_section.dart';
import 'package:smiley_brooms/widgets/home/how_it_works_section.dart';
import 'package:smiley_brooms/widgets/home/faq_section.dart';
import 'package:smiley_brooms/widgets/home/call_to_action_section.dart';
import 'package:smiley_brooms/widgets/common/loading_indicator.dart';
import 'package:smiley_brooms/widgets/common/error_view.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Future<List<Service>> _servicesFuture;
  
  @override
  void initState() {
    super.initState();
    _servicesFuture = ApiService().getServices();
    
    // Track screen view
    ApiService().trackAppUsage('view_home_screen', null);
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: RefreshIndicator(
        onRefresh: () async {
          setState(() {
            _servicesFuture = ApiService().getServices();
          });
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Hero Section
              const HeroSection(
                title: 'You rest, we take care of the rest!',
                subtitle: 'Professional cleaning services for your home and office',
                ctaText: 'Book Now',
              ),
              
              // Features Section
              const FeaturesSection(),
              
              // Services Section
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Our Services',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    FutureBuilder<List<Service>>(
                      future: _servicesFuture,
                      builder: (context, snapshot) {
                        if (snapshot.connectionState == ConnectionState.waiting) {
                          return const LoadingIndicator();
                        } else if (snapshot.hasError) {
                          return ErrorView(
                            error: snapshot.error.toString(),
                            onRetry: () {
                              setState(() {
                                _servicesFuture = ApiService().getServices();
                              });
                            },
                          );
                        } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                          return const Center(
                            child: Text('No services available'),
                          );
                        }
                        
                        final services = snapshot.data!;
                        return ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: services.length,
                          itemBuilder: (context, index) {
                            final service = services[index];
                            return Card(
                              margin: const EdgeInsets.only(bottom: 16),
                              child: ListTile(
                                leading: service.image != null
                                    ? Image.network(
                                        service.image!,
                                        width: 60,
                                        height: 60,
                                        fit: BoxFit.cover,
                                        errorBuilder: (_, __, ___) => const Icon(Icons.cleaning_services),
                                      )
                                    : const Icon(Icons.cleaning_services),
                                title: Text(service.name),
                                subtitle: Text(
                                  service.description,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                trailing: Text(
                                  '\$${service.price.toStringAsFixed(2)}',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                                onTap: () {
                                  context.push('/service/${service.id}');
                                },
                              ),
                            );
                          },
                        );
                      },
                    ),
                  ],
                ),
              ),
              
              // How It Works Section
              const HowItWorksSection(),
              
              // Testimonials Section
              const TestimonialsSection(),
              
              // FAQ Section
              const FaqSection(),
              
              // Call to Action Section
              CallToActionSection(
                title: 'Ready to experience our cleaning services?',
                buttonText: 'Calculate Price',
                onPressed: () {
                  context.push('/calculator');
                },
              ),
              
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}
