"use client";
import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { FavoriteRecipe } from "@/types";
import { STORAGE_KEYS } from "@/utils/constants";

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteRecipe[]>(STORAGE_KEYS.FAVORITES, []);

  const isFavorite = useCallback(
    (name: string) => favorites.some((f) => f.dishName === name),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (recipe: { dishName: string; ingredients: string[] }) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.dishName === recipe.dishName);
        return exists
          ? prev.filter((f) => f.dishName !== recipe.dishName)
          : [...prev, { ...recipe, savedAt: Date.now() }];
      });
    },
    [setFavorites]
  );

  const removeFavorite = useCallback(
    (name: string) => setFavorites((prev) => prev.filter((f) => f.dishName !== name)),
    [setFavorites]
  );

  return { favorites, isFavorite, toggleFavorite, removeFavorite };
}
