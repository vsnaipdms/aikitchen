"use client";

import { useEffect, useState, useRef } from "react";
import type { Recipe } from "@/types";
import { DIFFICULTY_COLORS } from "@/utils/constants";
import VideoSection from "./VideoSection";

interface Props {
  recipe: Recipe | null;
  loading: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
}

export default function RecipeDetails({ recipe, loading, isFavorite, onToggleFavorite, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (recipe && ref.current) ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [recipe]);

  if (!recipe && !loading) return null;

  if (loading) {
    return (
      <div ref={ref} className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-orange-100 dark:border-gray-800 p-4 animate-pulse">
        <div className="h-48 bg-orange-50 dark:bg-gray-800 rounded-lg mb-4" />
        <div className="h-6 bg-orange-50 dark:bg-gray-800 rounded w-48 mb-3" />
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-5 bg-orange-50 dark:bg-gray-800 rounded-full w-16" />)}
        </div>
        {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-3 bg-orange-50 dark:bg-gray-800 rounded w-full mb-2" />)}
      </div>
    );
  }

  if (!recipe) return null;
  const r = recipe;

  function handleCopy() {
    const parts = [
      `🍳 ${r.dishName}`,
      "",
      "Ingredients:",
      ...r.ingredients.map((i) => `  • ${i}`),
      "",
      "Preparation:",
      ...r.prepSteps.map((s, i) => `  ${i + 1}. ${s}`),
      "",
      "Cooking Instructions:",
      ...r.cookSteps.map((s, i) => `  ${i + 1}. ${s}`),
      "",
      `Time: ${r.cookingTime} | Servings: ${r.servings}`,
    ];
    navigator.clipboard.writeText(parts.join("\n")).catch(() => {});
  }

  function handleShare() {
    const text = `🍳 ${r.dishName}\n${r.ingredients.join(", ")}\nTime: ${r.cookingTime}`;
    if (navigator.share) navigator.share({ title: r.dishName, text }).catch(() => {});
    else navigator.clipboard.writeText(text).catch(() => {});
  }

  return (
    <div ref={ref} className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-orange-100 dark:border-gray-800 overflow-hidden">
      <RecipeImage query={recipe.dishName} />

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{recipe.dishName}</h2>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-xs px-2 py-0.5 bg-orange-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">⏱ {recipe.cookingTime}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[recipe.difficulty]}`}>{recipe.difficulty}</span>
              <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">👥 {recipe.servings} servings</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                recipe.isVeg ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
              }`}>{recipe.isVeg ? "Veg" : "Non-Veg"}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={onToggleFavorite} className="p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors" aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
              <svg className={`w-5 h-5 ${isFavorite ? "text-red-500 fill-current" : "text-gray-400"}`} fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
            <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-400 transition-colors" title="Copy">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            </button>
            <button onClick={handleShare} className="p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-400 transition-colors" title="Share">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-400 transition-colors" aria-label="Close">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🛒 Ingredients</h3>
            <ul className="space-y-1.5">
              {recipe.ingredients.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            {recipe.extraIngredients.length > 0 && (
              <div className="mt-3 p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-900/50">
                <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">You may also need:</p>
                <div className="flex flex-wrap gap-1">
                  {recipe.extraIngredients.map((item, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-white dark:bg-[#1a1a2e] text-orange-600 dark:text-orange-400 rounded-full border border-orange-200 dark:border-orange-800">{item}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📋 Preparation</h3>
            <ol className="space-y-2">
              {recipe.prepSteps.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-xs font-semibold shrink-0 mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">👨‍🍳 Cooking Instructions</h3>
          <ol className="space-y-2">
            {recipe.cookSteps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-semibold shrink-0 mt-0.5">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {recipe.tips.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/50">
            <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">💡 Tips</p>
            <ul className="space-y-1">
              {recipe.tips.map((tip, i) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex gap-1.5">
                  <span className="text-green-500 shrink-0">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        <VideoSection dishName={recipe.dishName} />
      </div>
    </div>
  );
}

function RecipeImage({ query }: { query: string }) {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/images?query=${encodeURIComponent(query + " food recipe")}`)
      .then((r) => r.json())
      .then((d) => { if (d.image) setImage(d.image); else setError(true); })
      .catch(() => setError(true));
  }, [query]);

  if (error) {
    return (
      <div className="h-48 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center">
        <span className="text-5xl">🍽️</span>
      </div>
    );
  }

  return (
    <div className="relative h-48 bg-orange-50 dark:bg-gray-800 overflow-hidden">
      {image ? (
        <img src={image} alt={query} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
