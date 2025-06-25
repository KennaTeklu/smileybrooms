-- Schema for defining available cleaning services
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Example: Insert some initial services
INSERT INTO services (name, description, base_price, duration_minutes) VALUES
('Standard Cleaning', 'Regular cleaning for homes and apartments.', 80.00, 120),
('Deep Cleaning', 'Thorough cleaning for a spotless home.', 150.00, 240),
('Move-in/Move-out Cleaning', 'Comprehensive cleaning for empty properties.', 200.00, 300);
