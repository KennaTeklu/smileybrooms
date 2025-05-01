import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ServiceBenefitsList extends StatelessWidget {
  final List<String> benefits;

  const ServiceBenefitsList({
    Key? key,
    required this.benefits,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Benefits',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        SizedBox(height: 12.h),
        ...benefits.map((benefit) => Padding(
              padding: EdgeInsets.only(bottom: 8.h),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    Icons.check_circle,
                    color: Theme.of(context).colorScheme.primary,
                    size: 20.r,
                  ),
                  SizedBox(width: 8.w),
                  Expanded(
                    child: Text(
                      benefit,
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ),
                ],
              ),
            )),
      ],
    );
  }
}
