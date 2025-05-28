interface PriceBreakdownDetailedProps {
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

const PriceBreakdownDetailed = ({ subtotal, discount, tax, shipping, total }: PriceBreakdownDetailedProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-500">Subtotal:</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Discount:</span>
        <span>-{formatCurrency(discount)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Tax:</span>
        <span>{formatCurrency(tax)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Shipping:</span>
        <span>{formatCurrency(shipping)}</span>
      </div>
      <div className="flex justify-between font-semibold">
        <span>Total:</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  )
}

export default PriceBreakdownDetailed
