"use client";

import { useState } from "react";
import { Item } from "./item.js";

export function ItemList({ items, onItemSelect }) {
  const [sortBy, setSortBy] = useState("name");

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "category") {
      const categoryA = String(a.category).toLowerCase();
      const categoryB = String(b.category).toLowerCase();
      if (categoryA > categoryB) {
        return 1;
      }
      if (categoryA < categoryB) {
        return -1;
      }
      const nameA = String(a.name).toLowerCase();
      const nameB = String(b.name).toLowerCase();
      if (nameA > nameB) {
        return 1;
      }
      if (nameA < nameB) {
        return -1;
      }
      return 0;
    }
    else
    {
      const nameA = String(a.name).toLowerCase();
      const nameB = String(b.name).toLowerCase();
      if (nameA > nameB) {
        return 1;
      }
      if (nameA < nameB) {
        return -1;
      }
      const categoryA = String(a.category).toLowerCase();
      const categoryB = String(b.category).toLowerCase();
      if (categoryA > categoryB) {
        return 1;
      }
      if (categoryA < categoryB) {
        return -1;
      }
      return 0;
    }
  });

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
        {sortedItems.map((items, index) => (
          <Item
            key={index}
            name={items.name}
            quantity={items.quantity}
            category={items.category}
            onSelect={(selectedItem) => onItemSelect(selectedItem)}
          />
        ))}
      </div>
    </div>
  );
}