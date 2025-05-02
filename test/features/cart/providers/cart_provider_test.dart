import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:smiley_brooms/features/cart/models/cart_item.dart';
import 'package:smiley_brooms/features/cart/providers/cart_provider.dart';

class MockStorage extends Mock {
  void saveCart(List<CartItem> items);
  List<CartItem>? getCart();
}

void main() {
  late CartProvider cartProvider;
  late MockStorage mockStorage;

  setUp(() {
    mockStorage = MockStorage();
    cartProvider = CartProvider();
    // Replace the storage implementation with our mock
    // (This would require exposing the storage as a dependency in real implementation)
  });

  group('CartProvider', () {
    test('should start with an empty cart', () {
      // Arrange
      when(() => mockStorage.getCart()).thenReturn(null);

      // Act
      // In a real implementation, we would initialize the cart here

      // Assert
      expect(cartProvider.items.length, 0);
      expect(cartProvider.itemCount, 0);
      expect(cartProvider.totalPrice, 0);
    });

    test('should add item to cart', () {
      // Arrange
      when(() => mockStorage.saveCart(any())).thenReturn(null);
      final item = CartItem(
        id: '1',
        name: 'Test Service',
        price: 100.0,
        priceId: 'price_1',
        quantity: 1,
      );

      // Act
      cartProvider.addItem(item);

      // Assert
      expect(cartProvider.items.length, 1);
      expect(cartProvider.itemCount, 1);
      expect(cartProvider.totalPrice, 100.0);
    });

    test('should increase quantity of existing item', () {
      // Arrange
      when(() => mockStorage.saveCart(any())).thenReturn(null);
      final item = CartItem(
        id: '1',
        name: 'Test Service',
        price: 100.0,
        priceId: 'price_1',
        quantity: 1,
      );

      // Act
      cartProvider.addItem(item);
      cartProvider.addItem(item);

      // Assert
      expect(cartProvider.items.length, 1);
      expect(cartProvider.items.first.quantity, 2);
      expect(cartProvider.itemCount, 2);
      expect(cartProvider.totalPrice, 200.0);
    });

    test('should remove item from cart', () {
      // Arrange
      when(() => mockStorage.saveCart(any())).thenReturn(null);
      final item = CartItem(
        id: '1',
        name: 'Test Service',
        price: 100.0,
        priceId: 'price_1',
        quantity: 1,
      );

      // Act
      cartProvider.addItem(item);
      cartProvider.removeItem('1');

      // Assert
      expect(cartProvider.items.length, 0);
      expect(cartProvider.itemCount, 0);
      expect(cartProvider.totalPrice, 0);
    });

    test('should clear cart', () {
      // Arrange
      when(() => mockStorage.saveCart(any())).thenReturn(null);
      final item = CartItem(
        id: '1',
        name: 'Test Service',
        price: 100.0,
        priceId: 'price_1',
        quantity: 1,
      );

      // Act
      cartProvider.addItem(item);
      cartProvider.clearCart();

      // Assert
      expect(cartProvider.items.length, 0);
      expect(cartProvider.itemCount, 0);
      expect(cartProvider.totalPrice, 0);
    });
  });
}
