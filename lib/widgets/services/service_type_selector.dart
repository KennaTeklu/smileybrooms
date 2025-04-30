import 'package:flutter/material.dart';

enum ServiceType {
  standard,
  deep,
  movingIn,
  movingOut,
}

class ServiceTypeSelector extends StatelessWidget {
  final ServiceType selectedType;
  final Function(ServiceType) onTypeSelected;

  const ServiceTypeSelector({
    Key? key,
    required this.selectedType,
    required this.onTypeSelected,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Service Type',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8.0,
              runSpacing: 8.0,
              children: [
                _buildServiceTypeChip(
                  context,
                  ServiceType.standard,
                  'Standard Cleaning',
                  'Regular cleaning for maintained homes',
                ),
                _buildServiceTypeChip(
                  context,
                  ServiceType.deep,
                  'Deep Cleaning',
                  'Thorough cleaning for neglected areas',
                ),
                _buildServiceTypeChip(
                  context,
                  ServiceType.movingIn,
                  'Moving In',
                  'Fresh start for your new home',
                ),
                _buildServiceTypeChip(
                  context,
                  ServiceType.movingOut,
                  'Moving Out',
                  'Leave your old place spotless',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildServiceTypeChip(
    BuildContext context,
    ServiceType type,
    String label,
    String description,
  ) {
    final isSelected = selectedType == type;

    return GestureDetector(
      onTap: () => onTypeSelected(type),
      child: Container

Let's implement the cleanliness slider widget:

```dart file="lib/widgets/services/cleanliness_slider.dart"
... This file was left out for brevity. Assume it is correct and does not need any modifications. ...
