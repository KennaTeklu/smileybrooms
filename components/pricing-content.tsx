"use client"

import type React from "react"

interface PricingContentProps {
  planName: string
  price: number
  features: string[]
  onAddToCart: () => void
}

const PricingContent: React.FC<PricingContentProps> = ({ planName, price, features, onAddToCart }) => {
  return (
    <div className="pricing-content">
      <h3>{planName}</h3>
      <p className="price">${price}/month</p>
      <ul>
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <button onClick={onAddToCart}>Add to Cart</button>
    </div>
  )
}

export default PricingContent
