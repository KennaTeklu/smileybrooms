CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_info JSONB NOT NULL,
  address_info JSONB NOT NULL,
  payment_preferences JSONB NOT NULL,
  cart_items JSONB NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE bookings IS 'Stores details of customer bookings, including contact, address, payment preferences, and cart items.';
COMMENT ON COLUMN bookings.customer_info IS 'JSONB containing customer contact details (firstName, lastName, email, phone).';
COMMENT ON COLUMN bookings.address_info IS 'JSONB containing customer address details (fullName, address, city, state, zipCode, specialInstructions, addressType).';
COMMENT ON COLUMN bookings.payment_preferences IS 'JSONB containing customer payment preferences (paymentMethod, allowVideoRecording, videoConsentDetails, agreeToTerms).';
COMMENT ON COLUMN bookings.cart_items IS 'JSONB array of items in the cart at the time of booking.';
COMMENT ON COLUMN bookings.total_amount IS 'The total amount of the booking, calculated on the server.';
COMMENT ON COLUMN bookings.status IS 'Current status of the booking (e.g., pending, completed, canceled).';
