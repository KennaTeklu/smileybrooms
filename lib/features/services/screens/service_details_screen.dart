import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';
import 'package:share_plus/share_plus.dart';

import '../../../core/services/analytics_service.dart';
import '../../../core/services/content_service.dart';
import '../../../core/widgets/rich_content_viewer.dart';
import '../../../features/cart/models/cart_item.dart';
import '../../../features/cart/providers/cart_provider.dart';
import '../../cart/widgets/add_to_cart_button.dart';
import '../models/service.dart';
import '../widgets/service_gallery.dart';
import '../widgets/service_price_card.dart';
import '../widgets/service_benefits_list.dart';

class ServiceDetailsScreen extends StatefulWidget {
  final String serviceId;

  const ServiceDetailsScreen({
    Key? key,
    required this.serviceId,
  }) : super(key: key);

  @override
  State<ServiceDetailsScreen> createState() => _ServiceDetailsScreenState();
}

class _ServiceDetailsScreenState extends State<ServiceDetailsScreen> {
  late Future<Map<String, dynamic>> _serviceFuture;
  final ContentService _contentService = ContentService();
  final ScrollController _scrollController = ScrollController();
  bool _showTitle = false;

  @override
  void initState() {
    super.initState();
    _serviceFuture = _contentService.getEnhancedServiceDetails(widget.serviceId);
    
    // Track screen view
    AnalyticsService.instance.trackScreenView('service_details', {
      'service_id': widget.serviceId,
    });
    
    // Add scroll listener for collapsing app bar effect
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    final showTitle = _scrollController.offset > 150;
    if (showTitle != _showTitle) {
      setState(() {
        _showTitle = showTitle;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<Map<String, dynamic>>(
        future: _serviceFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 48, color: Colors.red),
                  const SizedBox(height: 16),
                  Text('Error loading service: ${snapshot.error}'),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _serviceFuture = _contentService.getEnhancedServiceDetails(widget.serviceId);
                      });
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          } else if (!snapshot.hasData) {
            return const Center(child: Text('Service not found'));
          }

          final serviceData = snapshot.data!;
          final service = Service(
            id: serviceData['id'],
            name: serviceData['name'],
            description: serviceData['description'],
            price: (serviceData['price'] as num).toDouble(),
            priceId: serviceData['priceId'] ?? '',
            image: serviceData['image'],
            metadata: serviceData['metadata'],
          );

          final List<String> galleryImages = [
            if (service.image != null) service.image!,
            ...(serviceData['galleryImages'] as List<dynamic>? ?? []).cast<String>(),
          ];

          final List<String> benefits = 
              (serviceData['benefits'] as List<dynamic>? ?? []).cast<String>();

          return NestedScrollView(
            controller: _scrollController,
            headerSliverBuilder: (context, innerBoxIsScrolled) {
              return [
                SliverAppBar(
                  expandedHeight: 250.0,
                  floating: false,
                  pinned: true,
                  title: AnimatedOpacity(
                    opacity: _showTitle ? 1.0 : 0.0,
                    duration: const Duration(milliseconds: 200),
                    child: Text(service.name),
                  ),
                  flexibleSpace: FlexibleSpaceBar(
                    background: service.image != null
                        ? Image.network(
                            service.image!,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(
                              color: Theme.of(context).primaryColor.withOpacity(0.2),
                              child: const Center(
                                child: Icon(Icons.cleaning_services, size: 64),
                              ),
                            ),
                          )
                        : Container(
                            color: Theme.of(context).primaryColor.withOpacity(0.2),
                            child: const Center(
                              child: Icon(Icons.cleaning_services, size: 64),
                            ),
                          ),
                  ),
                  actions: [
                    IconButton(
                      icon: const Icon(Icons.share),
                      onPressed: () {
                        Share.share(
                          'Check out ${service.name} on Smiley Brooms: https://smileybrooms.com/services/${service.id}',
                        );
                      },
                    ),
                  ],
                ),
              ];
            },
            body: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: EdgeInsets.all(16.r),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          service.name,
                          style: Theme.of(context).textTheme.headlineMedium,
                        ).animate().fadeIn(delay: 200.ms).slideX(),
                        SizedBox(height: 8.h),
                        Text(
                          'Starting at \$${service.price.toStringAsFixed(2)}',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                color: Theme.of(context).colorScheme.primary,
                                fontWeight: FontWeight.bold,
                              ),
                        ).animate().fadeIn(delay: 300.ms).slideX(),
                        SizedBox(height: 16.h),
                      ],
                    ),
                  ),

                  // Gallery (if available)
                  if (galleryImages.length > 1)
                    ServiceGallery(images: galleryImages)
                        .animate().fadeIn(delay: 400.ms),

                  // Rich description (if available)
                  if (serviceData.containsKey('richDescription'))
                    Padding(
                      padding: EdgeInsets.all(16.r),
                      child: RichContentViewer(
                        htmlContent: serviceData['richDescription'],
                        useAdvancedRenderer: true,
                      ),
                    ).animate().fadeIn(delay: 500.ms)
                  else
                    Padding(
                      padding: EdgeInsets.all(16.r),
                      child: Text(
                        service.description,
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                    ).animate().fadeIn(delay: 500.ms),

                  // Benefits list (if available)
                  if (benefits.isNotEmpty)
                    Padding(
                      padding: EdgeInsets.all(16.r),
                      child: ServiceBenefitsList(benefits: benefits),
                    ).animate().fadeIn(delay: 600.ms),

                  // Price card with add to cart button
                  Padding(
                    padding: EdgeInsets.all(16.r),
                    child: ServicePriceCard(
                      price: service.price,
                      onAddToCart: () => _addToCart(service),
                    ),
                  ).animate().fadeIn(delay: 700.ms),

                  SizedBox(height: 32.h),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  void _addToCart(Service service) {
    final cartProvider = Provider.of<CartProvider>(context, listen: false);
    
    cartProvider.addItem(CartItem(
      id: service.id,
      name: service.name,
      price: service.price,
      priceId: service.priceId,
      quantity: 1,
      image: service.image,
      metadata: service.metadata,
    ));
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${service.name} added to cart'),
        action: SnackBarAction(
          label: 'View Cart',
          onPressed: () {
            Navigator.pushNamed(context, '/cart');
          },
        ),
      ),
    );
    
    // Track event
    AnalyticsService.instance.trackEvent('add_to_cart', {
      'service_id': service.id,
      'service_name': service.name,
      'price': service.price,
    });
  }
}
