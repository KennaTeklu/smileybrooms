import 'package:flutter/material.dart';

class PaymentFrequencySelector extends StatelessWidget {
  final String value;
  final String frequency;
  final Function(String) onChanged;

  const PaymentFrequencySelector({
    Key? key,
    required this.value,
    required this.frequency,
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
              'Payment Frequency',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(
              'How would you like to pay for recurring service?',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.grey,
                  ),
            ),
            const SizedBox(height: 16),
            _buildPaymentOptions(context),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.blue.shade200),
              ),
              child: Row(
                children: [
                  Icon(Icons.info_outline, color: Colors.blue.shade700),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _getPaymentMessage(),
                      style: TextStyle(color: Colors.blue.shade700),
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

  Widget _buildPaymentOptions(BuildContext context) {
    // Only show relevant payment options based on frequency
    List<Widget> options = [];
    
    // Per service is always an option
    options.add(_buildPaymentOption(
      context,
      'per_service',
      'Pay per service',
      'Pay individually for each cleaning service',
    ));
    
    // Monthly option for frequent services
    if (['weekly', 'biweekly', 'monthly'].contains(frequency)) {
      options.add(_buildPaymentOption(
        context,
        'monthly',
        'Pay monthly',
        'Save 2% with monthly billing',
      ));
    }
    
    // Yearly option for all recurring services
    if (frequency != 'one_time') {
      options.add(_buildPaymentOption(
        context,
        'yearly',
        'Pay yearly',
        'Save 8% with annual billing',
      ));
    }
    
    return Column(
      children: options,
    );
  }

  Widget _buildPaymentOption(
    BuildContext context,
    String paymentFrequency,
    String title,
    String description,
  ) {
    final isSelected = value == paymentFrequency;
    
    return GestureDetector(
      onTap: () => onChanged(paymentFrequency),
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? Theme.of(context).primaryColor.withOpacity(0.1) : Colors.grey.shade100,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected ? Theme.of(context).primaryColor : Colors.grey.shade300,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Radio<String>(
              value: paymentFrequency,
              groupValue: value,
              onChanged: (newValue) {
                if (newValue != null) {
                  onChanged(newValue);
                }
              },
              activeColor: Theme.of(context).primaryColor,
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: isSelected ? Theme.of(context).primaryColor : Colors.black,
                    ),
                  ),
                  Text(
                    description,
                    style: TextStyle(
                      fontSize: 12,
                      color: isSelected ? Theme.of(context).primaryColor.withOpacity(0.8) : Colors.grey,
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

  String _getPaymentMessage() {
    switch (value) {
      case 'monthly':
        return 'Monthly billing offers convenience with a small discount. You\'ll be billed once per month for all services.';
      case 'yearly':
        return 'Annual billing offers the best savings. You\'ll be charged once per year for all services.';
      case 'per_service':
      default:
        return 'Pay individually for each service with no long-term commitment.';
    }
  }
}
