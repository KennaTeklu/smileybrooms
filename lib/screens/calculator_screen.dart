import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:smiley_brooms/providers/cart_provider.dart';
import 'package:smiley_brooms/models/cart_item.dart';
import 'package:smiley_brooms/widgets/calculator/room_selector.dart';
import 'package:smiley_brooms/widgets/calculator/service_type_selector.dart';
import 'package:smiley_brooms/widgets/calculator/cleanliness_slider.dart';
import 'package:smiley_brooms/widgets/calculator/frequency_selector.dart';
import 'package:smiley_brooms/widgets/calculator/payment_frequency_selector.dart';
import 'package:smiley_brooms/widgets/calculator/price_summary.dart';
import 'package:smiley_brooms/widgets/calculator/address_collection_modal.dart';
import 'package:smiley_brooms/services/api_service.dart';

class CalculatorScreen extends StatefulWidget {
  const CalculatorScreen({Key? key}) : super(key: key);

  @override
  State<CalculatorScreen> createState() => _CalculatorScreenState();
}

class _CalculatorScreenState extends State<CalculatorScreen> {
  final Map<String, int> _rooms = {
    'master_bedroom': 0,
    'bedroom': 0,
    'bathroom': 0,
    'kitchen': 0,
    'living_room': 0,
    'dining_room': 0,
    'office': 0,
    'playroom': 0,
    'mudroom': 0,
    'laundry_room': 0,
    'sunroom': 0,
    'guest_room': 0,
    'garage': 0,
  };
  
  String _frequency = 'one_time';
  String _serviceType = 'standard';
  int _cleanlinessLevel = 7;
  String _paymentFrequency = 'per_service';
  double _totalPrice = 0;
  bool _isCalculating = false;
  bool _hasSelections = false;
  
  @override
  void initState() {
    super.initState();
    
    // Track screen view
    ApiService().trackAppUsage('view_calculator_screen', null);
  }
  
  void _updateRooms(String roomType, int count) {
    setState(() {
      _rooms[roomType] = count;
      _calculatePrice();
    });
  }
  
  void _updateFrequency(String frequency) {
    setState(() {
      _frequency = frequency;
      _calculatePrice();
    });
  }
  
  void _updateServiceType(String serviceType) {
    setState(() {
      _serviceType = serviceType;
      _calculatePrice();
    });
  }
  
  void _updateCleanlinessLevel(int level) {
    setState(() {
      _cleanlinessLevel = level;
      _calculatePrice();
    });
  }
  
  void _updatePaymentFrequency(String frequency) {
    setState(() {
      _paymentFrequency = frequency;
      _calculatePrice();
    });
  }
  
  Future<void> _calculatePrice() async {
    // Check if any rooms are selected
    final hasRoomSelections = _rooms.values.any((count) => count > 0);
    setState(() {
      _hasSelections = hasRoomSelections;
    });
    
    if (!hasRoomSelections) {
      setState(() {
        _totalPrice = 0;
      });
      return;
    }
    
    setState(() {
      _isCalculating = true;
    });
    
    try {
      // In a real app, this would call the API
      // For now, we'll simulate the calculation
      
      // Base price calculation
      double basePrice = 0;
      _rooms.forEach((roomType, count) {
        double roomPrice = 0;
        switch (roomType) {
          case 'master_bedroom':
            roomPrice = 30.0;
            break;
          case 'bedroom':
            roomPrice = 25.0;
            break;
          case 'bathroom':
            roomPrice = 35.0;
            break;
          case 'kitchen':
            roomPrice = 45.0;
            break;
          case 'living_room':
            roomPrice = 40.0;
            break;
          case 'dining_room':
            roomPrice = 30.0;
            break;
          default:
            roomPrice = 20.0;
        }
        basePrice += roomPrice * count;
      });
      
      // Apply frequency multiplier
      double frequencyMultiplier = 1.0;
      switch (_frequency) {
        case 'weekly':
          frequencyMultiplier = 0.8;
          break;
        case 'biweekly':
          frequencyMultiplier = 0.9;
          break;
        case 'monthly':
          frequencyMultiplier = 1.0;
          break;
        case 'semi_annual':
          frequencyMultiplier = 1.1;
          break;
        case 'annually':
          frequencyMultiplier = 1.2;
          break;
        case 'vip_daily':
          frequencyMultiplier = 0.7;
          break;
        case 'one_time':
        default:
          frequencyMultiplier = 1.3;
      }
      
      // Apply service type multiplier
      double serviceTypeMultiplier = _serviceType == 'standard' ? 1.0 : 3.5;
      
      // Apply cleanliness level multiplier
      double cleanlinessMultiplier = 1.0;
      if (_cleanlinessLevel >= 4 && _cleanlinessLevel < 7) {
        cleanlinessMultiplier = 3.5;
      }
      
      // Calculate price per service
      double pricePerService = basePrice * frequencyMultiplier * serviceTypeMultiplier * cleanlinessMultiplier + 25.0; // Service fee
      
      // Apply payment frequency discount
      double paymentMultiplier = 1.0;
      if (_frequency != 'one_time') {
        int servicesPerYear = 0;
        switch (_frequency) {
          case 'weekly':
            servicesPerYear = 52;
            break;
          case 'biweekly':
            servicesPerYear = 26;
            break;
          case 'monthly':
            servicesPerYear = 12;
            break;
          case 'semi_annual':
            servicesPerYear = 2;
            break;
          case 'annually':
            servicesPerYear = 1;
            break;
          case 'vip_daily':
            servicesPerYear = 365;
            break;
        }
        
        if (_paymentFrequency == 'monthly' && servicesPerYear > 12) {
          paymentMultiplier = 0.98; // 2% discount
        } else if (_paymentFrequency == 'yearly' && servicesPerYear > 1) {
          paymentMultiplier = 0.92; // 8% discount
        }
        
        // Calculate total upfront payment
        int paymentsPerYear = _paymentFrequency == 'monthly' ? 12 : _paymentFrequency == 'yearly' ? 1 : servicesPerYear;
        double servicesPerPayment = servicesPerYear / paymentsPerYear;
        pricePerService = pricePerService * paymentMultiplier * servicesPerPayment;
      }
      
      setState(() {
        _totalPrice = pricePerService;
        _isCalculating = false;
      });
    } catch (e) {
      setState(() {
        _isCalculating = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error calculating price: $e')),
      );
    }
  }
  
  void _showAddressModal() {
    if (!_hasSelections) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select at least one room')),
      );
      return;
    }
    
    if (_cleanlinessLevel < 4) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Service unavailable for extremely dirty conditions. Please contact us.')),
      );
      return;
    }
    
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => AddressCollectionModal(
        calculatedPrice: _totalPrice,
        onSubmit: _addToCart,
      ),
    );
  }
  
  void _addToCart(Map<String, dynamic> addressData) {
    final cartProvider = Provider.of<CartProvider>(context, listen: false);
    
    // Count total rooms
    final totalRooms = _rooms.values.reduce((sum, count) => sum + count);
    
    // Create a descriptive name for the service
    final serviceTypeLabel = _serviceType == 'standard' ? 'Standard' : 'Premium Detailing';
    final frequencyLabel = _getFrequencyLabel(_frequency);
    final serviceName = '$serviceTypeLabel $frequencyLabel ($totalRooms rooms)';
    
    // Get the room types that were selected
    final selectedRoomsList = _rooms.entries
        .where((entry) => entry.value > 0)
        .map((entry) => '${_formatRoomName(entry.key)} x${entry.value}')
        .join(', ');
    
    // Apply discount if video recording is allowed
    final allowVideoRecording = addressData['allowVideoRecording'] ?? false;
    final videoRecordingDiscount = allowVideoRecording ? (_totalPrice * 0.1).clamp(50, double.infinity) : 0.0;
    final finalPrice = _totalPrice - videoRecordingDiscount;
    
    // Generate a unique ID
    final itemId = 'custom-cleaning-${DateTime.now().millisecondsSinceEpoch}';
    
    // Add to cart
    cartProvider.addItem(CartItem(
      id: itemId,
      name: serviceName,
      price: finalPrice,
      priceId: 'price_custom_cleaning',
      quantity: 1,
      image: 'assets/images/cleaning_service.png',
      paymentFrequency: _paymentFrequency,
      metadata: {
        'serviceType': _serviceType,
        'frequency': _frequency,
        'cleanlinessLevel': _cleanlinessLevel,
        'rooms': selectedRoomsList,
        'customer': addressData,
      },
    ));
    
    // Show success message
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('$serviceName added to cart')),
    );
    
    // Track event
    ApiService().trackAppUsage('add_to_cart_from_calculator', null);
    
    // Reset calculator
    _resetCalculator();
  }
  
  void _resetCalculator() {
    setState(() {
      _rooms.forEach((key, value) {
        _rooms[key] = 0;
      });
      _frequency = 'one_time';
      _serviceType = 'standard';
      _cleanlinessLevel = 7;
      _paymentFrequency = 'per_service';
      _totalPrice = 0;
      _hasSelections = false;
    });
  }
  
  String _getFrequencyLabel(String frequency) {
    switch (frequency) {
      case 'one_time':
        return 'One-Time Cleaning';
      case 'weekly':
        return 'Weekly Cleaning';
      case 'biweekly':
        return 'Biweekly Cleaning';
      case 'monthly':
        return 'Monthly Cleaning';
      case 'semi_annual':
        return 'Semi-Annual Cleaning';
      case 'annually':
        return 'Annual Cleaning';
      case 'vip_daily':
        return 'VIP Daily Cleaning';
      default:
        return 'Cleaning';
    }
  }
  
  String _formatRoomName(String name) {
    return name.replaceAll('_', ' ').split(' ').map((word) => word[0].toUpperCase() + word.substring(1)).join(' ');
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Cleaning Price Calculator',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Configure the cleaning details for your location',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 24),
              
              // Service Type Selector
              ServiceTypeSelector(
                value: _serviceType,
                onChanged: _updateServiceType,
              ),
              const SizedBox(height: 24),
              
              // Cleanliness Slider
              CleanlinessSlider(
                value: _cleanlinessLevel,
                onChanged: _updateCleanlinessLevel,
              ),
              const SizedBox(height: 24),
              
              if (_cleanlinessLevel < 4)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.red.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.red.shade200),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.warning_amber_rounded, color: Colors.red.shade700),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Service currently unavailable for extremely dirty conditions. Please contact us for a custom quote and assessment.',
                          style: TextStyle(color: Colors.red.shade700),
                        ),
                      ),
                    ],
                  ),
                ),
              const SizedBox(height: 24),
              
              // Room Selector
              RoomSelector(
                rooms: _rooms,
                onRoomCountChanged: _updateRooms,
              ),
              const SizedBox(height: 24),
              
              // Frequency Selector
              FrequencySelector(
                value: _frequency,
                onChanged: _updateFrequency,
              ),
              const SizedBox(height: 24),
              
              // Payment Frequency Selector (only show if recurring service)
              if (_frequency != 'one_time')
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    PaymentFrequencySelector(
                      value: _paymentFrequency,
                      onChanged: _updatePaymentFrequency,
                      frequency: _frequency,
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              
              // Price Summary
              PriceSummary(
                price: _totalPrice,
                isCalculating: _isCalculating,
                hasSelections: _hasSelections,
                onAddToCart: _showAddressModal,
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}
