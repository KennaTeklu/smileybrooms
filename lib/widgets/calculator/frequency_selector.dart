import 'package:flutter/material.dart';

class FrequencySelector extends StatelessWidget {
  final String value;
  final Function(String) onChanged;

  const FrequencySelector({
    Key? key,
    required this.value,
    required this.onChanged,
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
              'Service Frequency',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(
              'How often do you need cleaning service?',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.grey,
                  ),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8.0,
              runSpacing: 8.0,
              children: [
                _buildFrequencyChip(context, 'one_time', 'One-Time'),
                _buildFrequencyChip(context, 'weekly', 'Weekly'),
                _buildFrequencyChip(context, 'biweekly', 'Biweekly'),
                _buildFrequencyChip(context, 'monthly', 'Monthly'),
                _buildFrequencyChip(context, 'semi_annual', 'Semi-Annual'),
                _buildFrequencyChip(context, 'annually', 'Annual'),
                _buildFrequencyChip(context, 'vip_daily', 'VIP Daily'),
              ],
            ),
            const SizedBox(height: 16),
            if (value != 'one_time')
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.green.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.green.shade200),
                ),
                child: Row(
                  children: [
                    Icon(Icons.savings, color: Colors.green.shade700),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _getDiscountMessage(value),
                        style: TextStyle(color: Colors.green.shade700),
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildFrequencyChip(BuildContext context, String frequency, String label) {
    final isSelected = value == frequency;

    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        if (selected) {
          onChanged(frequency);
        }
      },
      backgroundColor: Colors.grey.shade100,
      selectedColor: Theme.of(context).primaryColor.withOpacity(0.2),
      labelStyle: TextStyle(
        color: isSelected ? Theme.of(context).primaryColor : Colors.black,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
      ),
    );
  }

  String _getDiscountMessage(String frequency) {
    switch (frequency) {
      case 'weekly':
        return 'Save 20% with weekly service';
      case 'biweekly':
        return 'Save 10% with biweekly service';
      case 'monthly':
        return 'Standard pricing for monthly service';
      case 'semi_annual':
        return 'Premium pricing for semi-annual service';
      case 'annually':
        return 'Premium pricing for annual service';
      case 'vip_daily':
        return 'Save 30% with VIP daily service';
      default:
        return '';
    }
  }
}
