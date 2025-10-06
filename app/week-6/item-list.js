"use client";

import { useState } from "react";
import { Item } from "./item.js";
import items from "./items.json";

export function ItemList() {
  const [sortBy, setSortBy] = useState("name");
  items.sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1);

  return (
    <div className="">
      <div className="">
        Sort by: 
        <button
          onClick={() => setSortBy("name")}
          className={`m-2 p-2 text-sm rounded-lg ${sortBy == "name" ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          > Name
        </button>
        <button
          onClick={() => setSortBy("category")}
          className={`m-2 p-2 text-sm rounded-lg ${sortBy == "category" ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          > Category
        </button>
      </div>
      <div className="">
        {items.map((items, index) => (
          <Item
            key={index}
            name={items.name}
            quantity={items.quantity}
            category={items.category}
          />
        ))}
      </div>
    </div>
  );
}