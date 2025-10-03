"use client";
import { useState } from "react";

export function ItemList() {
  const [quantity, setQuantity] = useState(1);

  function increment() {
    if(quantity < 20) {
      setQuantity(quantity + 1);
    }
  }

  function decrement() {
    if(quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  return (
    <div className="border-1 border-solid rounded-md p-4 my-2 border-red-950">
      Quantity: {quantity}
      <div className="flex gap-4">
        <button
          disabled={quantity <= 1}
          onClick={decrement}
          className={`w-10 h-10 my-2 rounded-lg text-xl text-white ${quantity <= 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-400 hover:bg-red-700'} cursor-pointer`}
        > - 
        </button>
        <button
          disabled={quantity >= 20}
          onClick={increment}
          className={`w-10 h-10 my-2 rounded-lg text-xl text-white ${quantity >= 20 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-400 hover:bg-green-700'} cursor-pointer`}
        > + 
        </button>
      </div>
      <p className="text-sm text-stone-500">Allowed range: 1–20</p>
    </div>
  );
}