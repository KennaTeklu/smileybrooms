"use client"

import type React from "react"
import { useState } from "react"

interface RoomCustomizationPanelProps {
  onAddToCart: (item: any) => void // Assuming 'any' for item type, refine as needed
}

const RoomCustomizationPanel: React.FC<RoomCustomizationPanelProps> = ({ onAddToCart }) => {
  const [selectedColor, setSelectedColor] = useState<string>("white")
  const [selectedSize, setSelectedSize] = useState<string>("medium")
  const [quantity, setQuantity] = useState<number>(1)

  const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColor(event.target.value)
  }

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(event.target.value)
  }

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number.parseInt(event.target.value, 10)
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    const item = {
      name: "Customized Room",
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      price: 100, // Example price
    }
    onAddToCart(item)
  }

  return (
    <div>
      <h2>Customize Your Room</h2>
      <div>
        <label htmlFor="color">Color:</label>
        <select id="color" value={selectedColor} onChange={handleColorChange}>
          <option value="white">White</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
        </select>
      </div>
      <div>
        <label htmlFor="size">Size:</label>
        <select id="size" value={selectedSize} onChange={handleSizeChange}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div>
        <label htmlFor="quantity">Quantity:</label>
        <input type="number" id="quantity" value={quantity} onChange={handleQuantityChange} min="1" />
      </div>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  )
}

export default RoomCustomizationPanel
