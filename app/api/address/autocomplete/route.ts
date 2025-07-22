import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
  }

  // Mock address suggestions based on the query
  const mockSuggestions = [
    {
      formatted_address: "123 Main Street, Anytown, CA 90210, USA",
      place_id: "mock_place_1",
      components: {
        street_number: "123",
        route: "Main Street",
        locality: "Anytown",
        administrative_area_level_1: "CA",
        postal_code: "90210",
      },
    },
    {
      formatted_address: "456 Oak Avenue, Somecity, NY 10001, USA",
      place_id: "mock_place_2",
      components: {
        street_number: "456",
        route: "Oak Avenue",
        locality: "Somecity",
        administrative_area_level_1: "NY",
        postal_code: "10001",
      },
    },
    {
      formatted_address: "789 Pine Lane, Otherville, TX 73301, USA",
      place_id: "mock_place_3",
      components: {
        street_number: "789",
        route: "Pine Lane",
        locality: "Otherville",
        administrative_area_level_1: "TX",
        postal_code: "73301",
      },
    },
  ]

  const filteredSuggestions = mockSuggestions.filter((s) =>
    s.formatted_address.toLowerCase().includes(query.toLowerCase()),
  )

  return NextResponse.json(filteredSuggestions)
}
