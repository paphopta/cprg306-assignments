"use client";

import { useState } from "react";
import { NewItem } from "./new-item.js";
import { ItemList } from "./item-list.js";
import { MealIdeas } from "./meal-ideas";
import itemsData from "./items.json";

export default function Page() {
  const capCatItemsData = itemsData.map(item => ({...item, category: capitalizeWords(item.category)}));
  const [items, setItems] = useState(capCatItemsData);

  const handleAddItem = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const [selectedItemName, setSelectedItemName] = useState("");
  
  function handleItemSelect(item) {
    const cleanedName = item.name.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').split(",")[0];
    setSelectedItemName(cleanedName);
  }

  function capitalizeWords(str) {
    return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }

  return (
    <main>
      <div className="flex flex-row w-full p-2 m-2 items-start justify-center">
        <div className="w-full max-w-128">
          <p className="font-bold text-2xl w-full max-w-128">Shopping List</p>
          <NewItem onAddItem={handleAddItem}/>
          <ItemList items={items} onItemSelect={handleItemSelect}/>
        </div>
        <div className="w-full max-w-128">
          <MealIdeas items={items} ingredient={selectedItemName}/>
        </div>
      </div>
    </main>
  );
}