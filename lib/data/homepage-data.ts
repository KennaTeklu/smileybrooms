import "server-only"

export async function getHomepageContent() {
  // Simulate fetching data from a database or CMS
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  return {
    title: "Welcome to SmileyBrooms!",
    description: "Your trusted partner for a sparkling clean home. Book your service today!",
    timestamp: new Date().toLocaleString(),
    featuredServices: [
      { id: "deep-clean", name: "Deep Cleaning", price: 150 },
      { id: "standard-clean", name: "Standard Cleaning", price: 100 },
      { id: "move-in-out", name: "Move-in/out Cleaning", price: 200 },
    ],
  }
}
