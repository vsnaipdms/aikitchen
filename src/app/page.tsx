"use client";

import { useState, useCallback } from "react";
import type { Dish, Recipe } from "@/types";
import { suggestDishes, generateRecipe } from "@/services/ai";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFavorites } from "@/hooks/useFavorites";
import { STORAGE_KEYS } from "@/utils/constants";
import Header from "@/components/Header";
import IngredientInput from "@/components/IngredientInput";
import RecipeCards from "@/components/RecipeCards";
import RecipeDetails from "@/components/RecipeDetails";

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(STORAGE_KEYS.RECENT, []);
  const { isFavorite, toggleFavorite } = useFavorites();

  const addIngredient = useCallback((name: string) => {
    setIngredients((prev) => [...prev, name]);
  }, []);

  const removeIngredient = useCallback((index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSearch = useCallback(async () => {
    if (ingredients.length === 0) return;
    setLoadingSuggestions(true);
    setError(null);
    setDishes([]);
    setRecipe(null);
    setSelectedDish(null);

    try {
      const result = await suggestDishes(ingredients);
      setDishes(result);
      const q = ingredients.join(", ");
      setRecentSearches((prev) => [q, ...prev.filter((s) => s !== q)].slice(0, 8));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoadingSuggestions(false);
    }
  }, [ingredients, setRecentSearches]);

  const handleSelectDish = useCallback(async (dish: Dish) => {
    setSelectedDish(dish);
    setLoadingRecipe(true);
    setRecipe(null);

    try {
      const result = await generateRecipe(dish.name, ingredients);
      setRecipe(result);
    } catch {
      setRecipe({
        dishName: dish.name,
        ingredients: [],
        servings: 2,
        cookingTime: dish.cookingTime,
        difficulty: dish.difficulty,
        cuisine: dish.cuisine,
        isVeg: dish.isVeg,
        prepSteps: ["Could not generate recipe. Please try again."],
        cookSteps: [],
        tips: [],
        extraIngredients: [],
      });
    } finally {
      setLoadingRecipe(false);
    }
  }, [ingredients]);

  const handleToggleFavorite = useCallback(() => {
    if (recipe) toggleFavorite({ dishName: recipe.dishName, ingredients: recipe.ingredients });
  }, [recipe, toggleFavorite]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="max-w-2xl mx-auto px-4 pt-8 pb-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white leading-tight">
            What Can You Cook Today?
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Enter ingredients and discover recipes instantly
          </p>
        </section>

        <section className="max-w-2xl mx-auto px-4 pb-6">
          <IngredientInput
            ingredients={ingredients}
            onAdd={addIngredient}
            onRemove={removeIngredient}
            onSearch={handleSearch}
            loading={loadingSuggestions}
            recentSearches={recentSearches}
            onRecentClick={(q) => {
              q.split(", ").filter(Boolean).forEach((item) => {
                if (!ingredients.some((v) => v.toLowerCase() === item.toLowerCase())) addIngredient(item);
              });
            }}
          />
        </section>

        {error && (
          <section className="max-w-2xl mx-auto px-4 pb-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </div>
          </section>
        )}

        <section className="max-w-5xl mx-auto px-4 pb-8">
          <RecipeCards dishes={dishes} onSelect={handleSelectDish} loading={loadingSuggestions} />
        </section>

        {(selectedDish || loadingRecipe) && (
          <section className="max-w-2xl mx-auto px-4 pb-12">
            <RecipeDetails
              recipe={recipe}
              loading={loadingRecipe}
              isFavorite={recipe ? isFavorite(recipe.dishName) : false}
              onToggleFavorite={handleToggleFavorite}
              onClose={() => { setRecipe(null); setSelectedDish(null); }}
            />
          </section>
        )}
      </main>
    </div>
  );
}
