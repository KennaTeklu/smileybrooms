"use client"

import { useState } from "react"

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState("0")
  const [operator, setOperator] = useState(null)
  const [firstValue, setFirstValue] = useState(null)

  const handleNumberClick = (number: string) => {
    setDisplayValue(displayValue === "0" ? number : displayValue + number)
  }

  const handleOperatorClick = (operatorValue: string) => {
    setOperator(operatorValue)
    setFirstValue(Number.parseFloat(displayValue))
    setDisplayValue("0")
  }

  const handleEqualsClick = () => {
    if (operator && firstValue !== null) {
      const secondValue = Number.parseFloat(displayValue)
      let result

      switch (operator) {
        case "+":
          result = firstValue + secondValue
          break
        case "-":
          result = firstValue - secondValue
          break
        case "*":
          result = firstValue * secondValue
          break
        case "/":
          result = firstValue / secondValue
          break
        default:
          result = secondValue
      }

      setDisplayValue(String(result))
      setOperator(null)
      setFirstValue(null)
    }
  }

  const handleClearClick = () => {
    setDisplayValue("0")
    setOperator(null)
    setFirstValue(null)
  }

  const handleDecimalClick = () => {
    if (!displayValue.includes(".")) {
      setDisplayValue(displayValue + ".")
    }
  }

  const handlePercentageClick = () => {
    setDisplayValue(String(Number.parseFloat(displayValue) / 100))
  }

  const handleSignChangeClick = () => {
    setDisplayValue(String(Number.parseFloat(displayValue) * -1))
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-80">
        <div className="text-right text-3xl font-bold mb-4">{displayValue}</div>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={handleClearClick}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
          >
            C
          </button>
          <button
            onClick={handleSignChangeClick}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
          >
            +/-
          </button>
          <button
            onClick={handlePercentageClick}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
          >
            %
          </button>
          <button
            onClick={() => handleOperatorClick("/")}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            /
          </button>

          <button
            onClick={() => handleNumberClick("7")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded"
          >
            7
          </button>
          <button
            onClick={() => handleNumberClick("8")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded"
          >
            8
          </button>
          <button
            onClick={() => handleNumberClick("9")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded"
          >
            9
          </button>
          <button
            onClick={() => handleOperatorClick("*")}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            *
          </button>

          <button
            onClick={() => handleNumberClick("4")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded"
          >
            4
          </button>
          <button
            onClick={() => handleNumberClick("5")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded"
          >
            5
          </button>
          <button
            onClick={() => handleNumberClick("6")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded"
          >
            6
          </button>
          <button
            onClick={() => handleOperatorClick("-")}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            -
          </button>

          <button
            onClick={() => handleNumberClick("1")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded"
          >
            1
          </button>
          <button
            onClick={() => handleNumberClick("2")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded"
          >
            2
          </button>
          <button
            onClick={() => handleNumberClick("3")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded"
          >
            3
          </button>
          <button
            onClick={() => handleOperatorClick("+")}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            +
          </button>

          <button
            onClick={() => handleNumberClick("0")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-gray-700 font-bold py-2 px-4 rounded col-span-2"
          >
            0
          </button>
          <button
            onClick={handleDecimalClick}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded"
          >
            .
          </button>
          <button
            onClick={handleEqualsClick}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            =
          </button>
        </div>
      </div>
    </div>
  )
}

export default Calculator
