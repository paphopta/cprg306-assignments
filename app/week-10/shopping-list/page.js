"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NewItem } from "./new-item.js";
import { ItemList } from "./item-list.js";
import { MealIdeas } from "./meal-ideas";
import { useUserAuth } from "../_utils/auth-context";
import { getItems, addItem } from "../_services/shopping-list-service.js";

export default function Page() {
  const { user, loading } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function loadItems() {
      const userItems = await getItems(user.uid);
      setItems(userItems);
    }

    loadItems();
  }, [user]); 

  const handleAddItem = (newItem) => {
    const newItemId = addItem(user.uid, newItem);
    const newItemWithId = { newItemId, ...newItem };
    setItems((prevItems) => [...prevItems, newItemWithId]);
  };

  const [selectedItemName, setSelectedItemName] = useState("");

  function handleItemSelect(item) {
    const cleanedName = item.name.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').split(",")[0];
    setSelectedItemName(cleanedName);
  }

  return (
    <main>
      {!user ? (
          <div className=""><Link href="../week-10/">Go to login page</Link></div>
        ) : (
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
        )
      }
    </main>
  );
}