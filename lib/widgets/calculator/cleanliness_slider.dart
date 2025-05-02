import 'package:flutter/material.dart';

class CleanlinessSlider extends StatelessWidget {
  final int value;
  final Function(int) onChanged;

  const CleanlinessSlider({
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
              'Cleanliness Level',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(
              'How clean or dirty is your space?',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.grey,
                  ),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                const Icon(Icons.cleaning_services, color: Colors.red),
                Expanded(
                  child: SliderTheme(
                    data: SliderTheme.of(context).copyWith(
                      activeTrackColor: Theme.of(context).primaryColor,
                      inactiveTrackColor: Colors.grey.shade300,
                      thumbColor: Theme.of(context).primaryColor,
                      overlayColor: Theme.of(context).primaryColor.withOpacity(0.2),
                      trackHeight: 8.0,
                    ),
                    child: Slider(
                      value: value.toDouble(),
                      min: 1,
                      max: 10,
                      divisions: 9,
                      onChanged: (newValue) => onChanged(newValue.round()),
                    ),
                  ),
                ),
                const Icon(Icons.cleaning_services, color: Colors.green),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Very Dirty',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Colors.red,
                      ),
                ),
                Text(
                  'Moderately Clean',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Colors.amber,
                      ),
                ),
                Text(
                  'Very Clean',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Colors.green,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: _getCleanlinessLevelColor(value).withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: _getCleanlinessLevelColor(value).withOpacity(0.3),
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    _getCleanlinessLevelIcon(value),
                    color: _getCleanlinessLevelColor(value),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _getCleanlinessLevelDescription(value),
                      style: TextStyle(
                        color: _getCleanlinessLevelColor(value),
                      ),
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

  Color _getCleanlinessLevelColor(int level) {
    if (level <= 3) {
      return Colors.red;
    } else if (level <= 6) {
      return Colors.amber;
    } else {
      return Colors.green;
    }
  }

  IconData _getCleanlinessLevelIcon(int level) {
    if (level <= 3) {
      return Icons.warning_amber_rounded;
    } else if (level <= 6) {
      return Icons.info_outline;
    } else {
      return Icons.check_circle_outline;
    }
  }

  String _getCleanlinessLevelDescription(int level) {
    if (level <= 3) {
      return 'Extremely dirty - may require special equipment and extra time';
    } else if (level <= 6) {
      return 'Moderately dirty - standard cleaning with some extra attention needed';
    } else {
      return 'Relatively clean - standard cleaning will be sufficient';
    }
  }
}
