import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:smiley_b  as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:smiley_brooms/models/cart_item.dart';
import 'package:smiley_brooms/models/service.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  
  factory ApiService() => _instance;
  
  ApiService._internal();
  
  final String _baseUrl = dotenv.env['API_BASE_URL'] ?? 'https://api.smileybrooms.com';
  
  Future<Map<String, String>> _getHeaders({bool requiresAuth = false}) async {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (requiresAuth) {
      // TODO: Add authentication token
      // final authProvider = Provider.of<AuthProvider>(navigatorKey.currentContext!, listen: false);
      // final token = await authProvider.getToken();
      // headers['Authorization'] = 'Bearer $token';
    }
    
    return headers;
  }
  
  Future<dynamic> _handleResponse(http.Response response) async {
    if (response.statusCode >= 200 && response.statusCode &lt; 300) {
      return jsonDecode(response.body);
    } else {
      throw Exception('API Error: ${response.statusCode} - ${response.body}');
    }
  }
  
  // Get services
  Future<List<Service>> getServices() async {
    final response = await http.get(
      Uri.parse('$_baseUrl/services'),
      headers: await _getHeaders(),
    );
    
    final data = await _handleResponse(response);
    return (data as List).map((item) => Service.fromJson(item)).toList();
  }
  
  // Get service details
  Future<Service> getServiceDetails(String id) async {
    final response = await http.get(
      Uri.parse('$_baseUrl/services/$id'),
      headers: await _getHeaders(),
    );
    
    final data = await _handleResponse(response);
    return Service.fromJson(data);
  }
  
  // Calculate service price
  Future<Map<String, dynamic>> calculatePrice(Map<String, dynamic> calculatorData) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/calculate-price'),
      headers: await _getHeaders(),
      body: jsonEncode(calculatorData),
    );
    
    return await _handleResponse(response);
  }
  
  // Submit contact form
  Future<Map<String, dynamic>> submitContactForm(Map<String, dynamic> formData) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/contact'),
      headers: await _getHeaders(),
      body: jsonEncode(formData),
    );
    
    return await _handleResponse(response);
  }
  
  // Create checkout session
  Future<String> createCheckoutSession(
    List<CartItem> items,
    String successUrl,
    String cancelUrl,
    Map<String, dynamic>? customerData,
  ) async {
    final lineItems = items.map((item) {
      if (item.priceId.startsWith('price_')) {
        return {
          'price': item.priceId,
          'quantity': item.quantity,
        };
      } else {
        return {
          'name': item.name,
          'amount': item.price * 100, // Convert to cents
          'quantity': item.quantity,
          'metadata': item.metadata,
        };
      }
    }).toList();
    
    final payload = {
      'lineItems': lineItems,
      'successUrl': successUrl,
      'cancelUrl': cancelUrl,
      'customerData': customerData,
    };
    
    final response = await http.post(
      Uri.parse('$_baseUrl/create-checkout-session'),
      headers: await _getHeaders(requiresAuth: true),
      body: jsonEncode(payload),
    );
    
    final data = await _handleResponse(response);
    return data['checkoutUrl'];
  }
  
  // Track app usage
  Future<void> trackAppUsage(String action, String? userId) async {
    try {
      await http.post(
        Uri.parse('$_baseUrl/app-usage'),
        headers: await _getHeaders(),
        body: jsonEncode({
          'platform': 'android',
          'action': action,
          'userId': userId ?? 'anonymous',
        }),
      );
    } catch (e) {
      print('Error tracking app usage: $e');
    }
  }
}
