"use client";

import { useState } from "react";

export function NewItem({ onAddItem }) {
  const categoryList = ["Produce", "Dairy", "Bakery", "Meat", "Frozen Foods", "Canned Goods", "Dry Goods", "Beverages", "Snacks", "Household", "Other"];

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
  }

  function increment() {
    if(quantity < 20) {
      setQuantity(quantity + 1);
      setErrorMessage("");
    }
  }

  function decrement() {
    if(quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  const handleSetName = (event) => {
    setErrorMessage("");
    setName(event.target.value);
  };

  const handleSetCategory = (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name == "") {
      setErrorMessage("Please fill out this field.");
    }
    else {
      const newItem = {
        id: generateRandomString(16),
        name: name,
        quantity: quantity,
        category: categoryList[category]
      };
      setErrorMessage("");
      onAddItem(newItem);
      setName("");
      setQuantity(1);
      setCategory("0");
    }
  };

  return (
    <div className="border-1 border-solid rounded-md p-4 my-2 border-red-950">
      <div className="">
        <p>Item Name</p>
        <input type="text" title="Please fill out this field." placeholder="e.g., milk, 4 L 🥛" value={name} onChange={handleSetName} className="block w-full px-2 py-2 my-1 border border-black rounded-md" />
        <p className="text-xs text-red-500">{errorMessage}</p>
      </div>
      <div className="mt-4">
        <p>Quantity: {quantity}</p>
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
        <p className="text-xs text-stone-500">Allowed range: 1–20</p>
      </div>
      <div className="mt-4">
        <p>Category</p>
        <select id="selCategory" value={category} onChange={handleSetCategory} className="block w-full px-2 py-2 my-1 border border-black rounded-md">
          {categoryList.map((categoryName, index) => (
            <option key={index} value={index}>
              {categoryName}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <form onSubmit={handleSubmit}>
          <button type="submit" value="Submit" onSubmit={handleSubmit} className="w-25 h-10 my-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"> 
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}