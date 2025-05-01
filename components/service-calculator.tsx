"use client"

import { useState } from "react"

const ServiceCalculator = () => {
  const [squareFootage, setSquareFootage] = useState<number | null>(null)
  const [serviceType, setServiceType] = useState<string>("")
  const [price, setPrice] = useState<number | null>(null)

  const calculatePrice = () => {
    if (!squareFootage || squareFootage <= 0) {
      alert("Please enter a valid square footage.")
      return
    }

    if (!serviceType) {
      alert("Please select a service type.")
      return
    }

    let basePrice = 0

    switch (serviceType) {
      case "basic":
        basePrice = squareFootage * 0.1
        break
      case "deep":
        basePrice = squareFootage * 0.15
        break
      case "move_in_out":
        basePrice = squareFootage * 0.2
        break
      default:
        alert("Invalid service type.")
        return
    }

    setPrice(basePrice)
  }

  return (
    <div>
      <h2>smileybrooms Service Calculator</h2>
      <div>
        <label htmlFor="squareFootage">Square Footage:</label>
        <input
          type="number"
          id="squareFootage"
          value={squareFootage === null ? "" : squareFootage.toString()}
          onChange={(e) => setSquareFootage(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="serviceType">Service Type:</label>
        <select id="serviceType" value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
          <option value="">Select Service</option>
          <option value="basic">Basic Cleaning</option>
          <option value="deep">Deep Cleaning</option>
          <option value="move_in_out">Move In/Out Cleaning</option>
        </select>
      </div>
      <button onClick={calculatePrice}>Calculate Price</button>
      {price !== null && (
        <div>
          <p>Estimated Price: ${price.toFixed(2)}</p>
        </div>
      )}
      <p>smileybrooms LLC - All rights reserved.</p>
    </div>
  )
}

export default ServiceCalculator
