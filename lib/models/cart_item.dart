class CartItem {
  final String id;
  final String name;
  final double price;
  final String priceId;
  final int quantity;
  final String? image;
  final Map<String, dynamic>? metadata;
  final String? paymentFrequency;
  
  CartItem({
    required this.id,
    required this.name,
    required this.price,
    required this.priceId,
    this.quantity = 1,
    this.image,
    this.metadata,
    this.paymentFrequency,
  });
  
  CartItem copyWith({
    String? id,
    String? name,
    double? price,
    String? priceId,
    int? quantity,
    String? image,
    Map<String, dynamic>? metadata,
    String? paymentFrequency,
  }) {
    return CartItem(
      id: id ?? this.id,
      name: name ?? this.name,
      price: price ?? this.price,
      priceId: priceId ?? this.priceId,
      quantity: quantity ?? this.quantity,
      image: image ?? this.image,
      metadata: metadata ?? this.metadata,
      paymentFrequency: paymentFrequency ?? this.paymentFrequency,
    );
  }
  
  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      id: json['id'],
      name: json['name'],
      price: json['price'].toDouble(),
      priceId: json['priceId'],
      quantity: json['quantity'],
      image: json['image'],
      metadata: json['metadata'],
      paymentFrequency: json['paymentFrequency'],
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'price': price,
      'priceId': priceId,
      'quantity': quantity,
      'image': image,
      'metadata': metadata,
      'paymentFrequency': paymentFrequency,
    };
  }
}
