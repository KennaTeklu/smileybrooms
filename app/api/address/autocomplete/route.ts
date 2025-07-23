import { type NextRequest, NextResponse } from "next/server"

// Mock address suggestions for demonstration
// In a real application, you would integrate with a service like Google Places API
const mockAddresses = [
  {
    formatted_address: "123 Main Street, New York, NY 10001",
    place_id: "mock_place_1",
    components: {
      street_number: "123",
      route: "Main Street",
      locality: "New York",
      administrative_area_level_1: "NY",
      postal_code: "10001",
    },
  },
  {
    formatted_address: "456 Oak Avenue, Los Angeles, CA 90210",
    place_id: "mock_place_2",
    components: {
      street_number: "456",
      route: "Oak Avenue",
      locality: "Los Angeles",
      administrative_area_level_1: "CA",
      postal_code: "90210",
    },
  },
  {
    formatted_address: "789 Pine Road, Chicago, IL 60601",
    place_id: "mock_place_3",
    components: {
      street_number: "789",
      route: "Pine Road",
      locality: "Chicago",
      administrative_area_level_1: "IL",
      postal_code: "60601",
    },
  },
  {
    formatted_address: "321 Elm Street, Houston, TX 77001",
    place_id: "mock_place_4",
    components: {
      street_number: "321",
      route: "Elm Street",
      locality: "Houston",
      administrative_area_level_1: "TX",
      postal_code: "77001",
    },
  },
  {
    formatted_address: "654 Maple Drive, Phoenix, AZ 85001",
    place_id: "mock_place_5",
    components: {
      street_number: "654",
      route: "Maple Drive",
      locality: "Phoenix",
      administrative_area_level_1: "AZ",
      postal_code: "85001",
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 3) {
      return NextResponse.json([])
    }

    // Filter mock addresses based on query
    const filteredAddresses = mockAddresses.filter((address) =>
      address.formatted_address.toLowerCase().includes(query.toLowerCase()),
    )

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json(filteredAddresses)
  } catch (error) {
    console.error("Address autocomplete error:", error)
    return NextResponse.json({ error: "Failed to fetch address suggestions" }, { status: 500 })
  }
}
