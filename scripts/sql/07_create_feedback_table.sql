-- Schema for collecting customer feedback and ratings
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add an index for faster lookup by customer and booking
CREATE INDEX IF NOT EXISTS idx_feedback_customer_id ON feedback (customer_id);
CREATE INDEX IF NOT EXISTS idx_feedback_booking_id ON feedback (booking_id);
