"use client"

import type React from "react"

interface CartButtonProps {
  onClick: () => void
  itemCount: number
}

const CartButton: React.FC<CartButtonProps> = ({ onClick, itemCount }) => {
  return <button onClick={onClick}>Cart ({itemCount})</button>
}

export default CartButton
