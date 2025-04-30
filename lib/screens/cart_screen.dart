import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:smiley_brooms/providers/cart_provider.dart';
import 'package:smiley_brooms/widgets/cart/cart_item_card.dart';
import 'package:smiley_brooms/widgets/cart/video_recording_discount.dart';
import 'package:smiley_brooms/widgets/cart/payment_method_selector.dart';
import 'package:smiley_brooms/services/api_service.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({Key? key}) : super(key: key);

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  String _paymentMethod = 'card';
  bool _isCheckingOut = false;
  
  @override
  void initState() {
    super.initState();
    
    // Track screen view
    ApiService().trackAppUsage('view_cart_screen', null);
  }
  
  void _handleCheckout() async {
    final cartProvider = Provider.of<CartProvider>(context, listen: false);
    
    if (cartProvider.items.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Your cart is empty')),
      );
      return;
    }
    
    setState(() {
      _isCheckingOut = true;
    });
    
    try {
      // Get customer data from the first item with customer metadata
      final customerItem = cartProvider.items.firstWhere(
        (item) => item.metadata != null && item.metadata!['customer'] != null,
        orElse: () => cartProvider.items.first,
      );
      
      final customerData = customerItem.metadata?['customer'];
      
      // In a real app, this would call the API to create a checkout session
      // For now, we'll simulate the checkout process
      await Future.delayed(const Duration(seconds: 2));
      
      // Clear cart and navigate to success screen
      cartProvider.clearCart();
      
      if (!mounted) return;
      context.go('/success');
      
      // Track checkout event
      ApiService().trackAppUsage('checkout_completed', null);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Checkout failed: $e')),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isCheckingOut = false;
        });
      }
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Cart'),
      ),
      body: Consumer<CartProvider>(
        builder: (context, cartProvider, child) {
          if (cartProvider.items.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.shopping_cart_outlined,
                    size: 64,
                    color: Colors.grey,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Your cart is empty',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Add items to your cart to see them here',
                    style: TextStyle(
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      context.go('/calculator');
                    },
                    child: const Text('Calculate Price'),
                  ),
                ],
              ),
            );
          }
          
          return Column(
            children: [
              // Cart items
              Expanded(
                child: ListView

Let's implement the checkout screen:

```dart file="lib/screens/checkout_screen.dart"
... This file was left out for brevity. Assume it is correct and does not need any modifications. ...
