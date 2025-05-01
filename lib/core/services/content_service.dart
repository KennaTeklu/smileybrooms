import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:flutter_cache_manager/flutter_cache_manager.dart';
import 'package:http/http.dart' as http;
import 'package:html/parser.dart' as html_parser;
import 'package:html/dom.dart' as dom;

/// Service responsible for fetching and processing content from various sources
/// to ensure the app's content matches the website's quality
class ContentService {
  static final ContentService _instance = ContentService._internal();
  
  factory ContentService() => _instance;
  
  ContentService._internal();
  
  final DefaultCacheManager _cacheManager = DefaultCacheManager();
  
  /// Base URL for the website content
  final String _baseUrl = 'https://smileybrooms.com';
  
  /// Fetches HTML content from the website and processes it for the app
  Future<String> fetchWebContent(String path) async {
    try {
      // Try to get from cache first
      final fileInfo = await _cacheManager.getFileFromCache('web_content_$path');
      
      if (fileInfo != null && fileInfo.validTill.isAfter(DateTime.now())) {
        final content = await fileInfo.file.readAsString();
        return content;
      }
      
      // If not in cache or expired, fetch from network
      final response = await http.get(Uri.parse('$_baseUrl/$path'));
      
      if (response.statusCode == 200) {
        // Cache the content for 1 hour
        await _cacheManager.putFile(
          'web_content_$path',
          utf8.encode(response.body),
          maxAge: const Duration(hours: 1),
          fileExtension: 'html',
        );
        
        return response.body;
      } else {
        throw Exception('Failed to load content: ${response.statusCode}');
      }
    } catch (e) {
      // Fallback to local content if available
      try {
        return await rootBundle.loadString('assets/html/$path.html');
      } catch (_) {
        return '<p>Content temporarily unavailable. Please check back later.</p>';
      }
    }
  }
  
  /// Extracts specific content sections from HTML
  Future<Map<String, String>> extractContentSections(String htmlContent) {
    final document = html_parser.parse(htmlContent);
    final Map<String, String> sections = {};
    
    // Extract main content
    final mainContent = document.querySelector('main');
    if (mainContent != null) {
      sections['main'] = mainContent.outerHtml;
    }
    
    // Extract hero section
    final heroSection = document.querySelector('.hero-section');
    if (heroSection != null) {
      sections['hero'] = heroSection.outerHtml;
    }
    
    // Extract features section
    final featuresSection = document.querySelector('.features-section');
    if (featuresSection != null) {
      sections['features'] = featuresSection.outerHtml;
    }
    
    // Extract testimonials
    final testimonialsSection = document.querySelector('.testimonials-section');
    if (testimonialsSection != null) {
      sections['testimonials'] = testimonialsSection.outerHtml;
    }
    
    return Future.value(sections);
  }
  
  /// Fetches and processes service details to match website presentation
  Future<Map<String, dynamic>> getEnhancedServiceDetails(String serviceId) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/api/services/$serviceId'),
      );
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        
        // Enhance with additional content from the website if available
        try {
          final webContent = await fetchWebContent('services/$serviceId');
          final document = html_parser.parse(webContent);
          
          // Extract rich description if available
          final richDescription = document.querySelector('.service-description');
          if (richDescription != null) {
            data['richDescription'] = richDescription.outerHtml;
          }
          
          // Extract service benefits
          final benefitsList = document.querySelectorAll('.service-benefits li');
          if (benefitsList.isNotEmpty) {
            data['benefits'] = benefitsList.map((element) => element.text).toList();
          }
          
          // Extract service images
          final imageGallery = document.querySelectorAll('.service-gallery img');
          if (imageGallery.isNotEmpty) {
            data['galleryImages'] = imageGallery
                .map((img) => img.attributes['src'])
                .where((src) => src != null)
                .toList();
          }
        } catch (_) {
          // Continue with basic data if enhanced content isn't available
        }
        
        return data;
      } else {
        throw Exception('Failed to load service details');
      }
    } catch (e) {
      // Fallback to local data
      final String rawData = await rootBundle.loadString('assets/json/services.json');
      final List<dynamic> services = json.decode(rawData);
      final service = services.firstWhere(
        (s) => s['id'] == serviceId,
        orElse: () => {'id': serviceId, 'name': 'Service not found', 'description': 'Details unavailable'},
      );
      return service;
    }
  }
  
  /// Clears the content cache
  Future<void> clearCache() async {
    await _cacheManager.emptyCache();
  }
}
