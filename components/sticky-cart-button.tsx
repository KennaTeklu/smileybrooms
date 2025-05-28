const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Define the component
const StickyCartButton = () => {
  const price = 99.99

  const formattedPrice = (price: number) => {
    try {
      return formatCurrency(price)
    } catch (error) {
      console.error("Error formatting price:", error)
      return "$0.00" // Fallback value
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "white",
        padding: "10px",
        textAlign: "center",
        borderTop: "1px solid #ccc",
      }}
    >
      <button
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add to Cart - {formattedPrice(price)}
      </button>
    </div>
  )
}

export default StickyCartButton
