"use client"

import { useState, useEffect } from "react"
import CartButton from "@/components/cart-button"

const CalculatorPage = () => {
  const [operand1, setOperand1] = useState("")
  const [operand2, setOperand2] = useState("")
  const [operator, setOperator] = useState("")
  const [result, setResult] = useState("")
  const [totalPrice, setTotalPrice] = useState(0) // Example state for total price
  const [cartItems, setCartItems] = useState([]) // Example state for cart items

  useEffect(() => {
    // Example effect to calculate total price based on cart items
    const newTotalPrice = cartItems.reduce((acc, item) => acc + item.price, 0)
    setTotalPrice(newTotalPrice)
  }, [cartItems])

  const handleNumberClick = (number: string) => {
    if (!operator) {
      setOperand1(operand1 + number)
    } else {
      setOperand2(operand2 + number)
    }
  }

  const handleOperatorClick = (op: string) => {
    if (operand1) {
      setOperator(op)
    }
  }

  const handleEqualsClick = () => {
    if (operand1 && operand2 && operator) {
      const num1 = Number.parseFloat(operand1)
      const num2 = Number.parseFloat(operand2)
      let calculatedResult: number

      switch (operator) {
        case "+":
          calculatedResult = num1 + num2
          break
        case "-":
          calculatedResult = num1 - num2
          break
        case "*":
          calculatedResult = num1 * num2
          break
        case "/":
          calculatedResult = num1 / num2
          break
        default:
          calculatedResult = Number.NaN
      }

      setResult(calculatedResult.toString())
    }
  }

  const handleClearClick = () => {
    setOperand1("")
    setOperand2("")
    setOperator("")
    setResult("")
  }

  const handleAddToCart = () => {
    // Example: Add a dummy item to the cart
    const newItem = { id: cartItems.length + 1, name: "Calculator Result", price: Number.parseFloat(result) || 0 }
    setCartItems([...cartItems, newItem])
  }

  const handleCheckout = () => {
    alert("Checkout initiated! Total price: $" + totalPrice)
    // Implement your checkout logic here (e.g., redirect to a payment page)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-80">
        <div className="text-2xl font-semibold mb-4">Calculator</div>
        <div className="text-right text-gray-700 mb-2">
          {operand1} {operator} {operand2}
        </div>
        <div className="text-right text-3xl font-bold mb-4">{result || 0}</div>

        <div className="grid grid-cols-4 gap-2">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={handleClearClick}
          >
            C
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleNumberClick("7")}
          >
            7
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleNumberClick("8")}
          >
            8
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleNumberClick("9")}
          >
            9
          </button>

          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleNumberClick("4")}
          >
            4
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleNumberClick("5")}
          >
            5
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleNumberClick("6")}
          >
            6
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleOperatorClick("+")}
          >
            +
          </button>

          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleNumberClick("1")}
          >
            1
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleNumberClick("2")}
          >
            2
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleNumberClick("3")}
          >
            3
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleOperatorClick("-")}
          >
            -
          </button>

          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleNumberClick("0")}
          >
            0
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleNumberClick(".")}
          >
            .
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleEqualsClick}
          >
            =
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleOperatorClick("*")}
          >
            *
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleOperatorClick("/")}
          >
            /
          </button>
        </div>

        <button
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4 w-full"
          onClick={handleAddToCart}
        >
          Add Result to Cart
        </button>
      </div>
      <CartButton onCheckout={handleCheckout} />
    </div>
  )
}

export default CalculatorPage
