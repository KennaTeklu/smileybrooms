class Service {
  final String id;
  final String name;
  final String description;
  final double price;
  final String priceId;
  final String? image;
  final Map<String, dynamic>? metadata;
  
  Service({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.priceId,
    this.image,
    this.metadata,
  });
  
  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      price: json['price'].toDouble(),
      priceId: json['priceId'],
      image: json['image'],
      metadata: json['metadata'],
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'price': price,
      'priceId': priceId,
      'image': image,
      'metadata': metadata,
    };
  }
}
