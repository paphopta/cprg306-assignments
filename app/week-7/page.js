"use client";

import { useState } from "react";
import { NewItem } from "./new-item.js";
import { ItemList } from "./item-list.js";
import itemsData from "./items.json";

export default function Page() {
  function capitalizeWords(str) {
    return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }
  const capCatItemsData = itemsData.map(item => ({...item, category: capitalizeWords(item.category)}));

  const [items, setItems] = useState(capCatItemsData);

  const handleAddItem = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <main>
      <div className="w-full p-2 m-2 flex flex-col items-center">
        <p className="font-bold text-2xl w-full max-w-128">Shopping List</p>
        <div className="w-full max-w-128">
          <NewItem onAddItem={handleAddItem}/>
        </div>
        <div className="w-full max-w-128">
          <ItemList items={items}/>
        </div>
      </div>
    </main>
  );
}