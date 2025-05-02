import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:smiley_brooms/providers/cart_provider.dart';
import 'package:badges/badges.dart' as badges;

class CartButton extends StatelessWidget {
  const CartButton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<CartProvider>(
      builder: (context, cartProvider, child) {
        return badges.Badge(
          position: badges.BadgePosition.topEnd(top: 0, end: 3),
          showBadge: cartProvider.itemCount > 0,
          badgeContent: Text(
            cartProvider.itemCount.toString(),
            style: const TextStyle(color: Colors.white, fontSize: 10),
          ),
          badgeStyle: const badges.BadgeStyle(
            badgeColor: Colors.red,
            padding: EdgeInsets.all(5),
          ),
          child: IconButton(
            icon: const Icon(Icons.shopping_cart),
            onPressed: () {
              context.push('/cart');
            },
          ),
        );
      },
    );
  }
}
