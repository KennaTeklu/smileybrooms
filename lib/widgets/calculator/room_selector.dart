import 'package:flutter/material.dart';

class RoomSelector extends StatelessWidget {
  final Map<String, int> rooms;
  final Function(String, int) onRoomCountChanged;

  const RoomSelector({
    Key? key,
    required this.rooms,
    required this.onRoomCountChanged,
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
              'Rooms',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(
              'Select the rooms you need cleaned',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.grey,
                  ),
            ),
            const SizedBox(height: 16),
            ...rooms.entries.map((entry) => _buildRoomCounter(
                  context,
                  _formatRoomName(entry.key),
                  entry.key,
                  entry.value,
                )),
          ],
        ),
      ),
    );
  }

  Widget _buildRoomCounter(
    BuildContext context,
    String label,
    String roomKey,
    int count,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: Theme.of(context).textTheme.titleMedium,
          ),
          Row(
            children: [
              IconButton(
                onPressed: count > 0
                    ? () => onRoomCountChanged(roomKey, count - 1)
                    : null,
                icon: const Icon(Icons.remove_circle_outline),
                color: Theme.of(context).primaryColor,
              ),
              SizedBox(
                width: 40,
                child: Text(
                  count.toString(),
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ),
              IconButton(
                onPressed: () => onRoomCountChanged(roomKey, count + 1),
                icon: const Icon(Icons.add_circle_outline),
                color: Theme.of(context).primaryColor,
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _formatRoomName(String name) {
    return name.replaceAll('_', ' ').split(' ').map((word) => word[0].toUpperCase() + word.substring(1)).join(' ');
  }
}
