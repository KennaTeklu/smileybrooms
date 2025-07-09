-- Seed initial services, ignoring duplicates if they already exist
INSERT INTO services (name, description, base_price, duration_minutes) VALUES
('Standard Cleaning', 'Regular cleaning for homes and apartments.', 80.00, 120),
('Deep Cleaning', 'Thorough cleaning for a spotless home.', 150.00, 240),
('Move-in/Move-out Cleaning', 'Comprehensive cleaning for empty properties.', 200.00, 300),
('Post-Construction Cleaning', 'Detailed cleaning after construction or renovation.', 250.00, 360),
('Office Cleaning', 'Professional cleaning services for commercial spaces.', 120.00, 180)
ON CONFLICT (name) DO NOTHING;
