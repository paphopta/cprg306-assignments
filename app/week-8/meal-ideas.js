"use client";

import { useState, useEffect } from "react";

async function fetchMealIdeas(ingredient) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export function MealIdeas({ ingredient }) {
  const [meals, setMeals] = useState([]);

  async function loadMealIdeas() {
    if (!ingredient) {
      return;
    }
    const mealData = await fetchMealIdeas(ingredient);
    setMeals(mealData);
  }

  useEffect(() => {loadMealIdeas();}, [ingredient]);

  return (
    <div className="px-2 mx-2">
      {ingredient ? (
        <p className="font-bold text-2xl mb-2">Meal Ideas for {ingredient}</p>
      ) : (
        <p className="font-bold text-2xl mb-2">Meal ideas (select an item)</p>
      )}
      {meals.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {meals.map((meal) => (<div key={meal.idMeal} className="p-2 border rounded-md"><p>{meal.strMeal}</p></div>))}
        </div>
      ) : (
        <p>No meals found.</p>
      )}
    </div>
  );
}