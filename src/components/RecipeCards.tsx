"use client";

import { useEffect, useState } from "react";
import type { Dish } from "@/types";
import { DIFFICULTY_COLORS } from "@/utils/constants";

interface Props {
  dishes: Dish[];
  onSelect: (dish: Dish) => void;
  loading: boolean;
}

function DishImage({ name }: { name: string }) {
  const [img, setImg] = useState<string | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    fetch(`/api/images?query=${encodeURIComponent(name + " food dish")}`)
      .then((r) => r.json())
      .then((d) => { if (d.image) setImg(d.image); else setErr(true); })
      .catch(() => setErr(true));
  }, [name]);

  if (err) {
    return (
      <div className="h-36 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center">
        <span className="text-4xl opacity-40">🍽️</span>
      </div>
    );
  }

  return (
    <div className="relative h-36 bg-orange-50 dark:bg-gray-800 overflow-hidden">
      {img ? (
        <img src={img} alt={name} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-orange-100 dark:border-gray-800 overflow-hidden">
            <div className="h-36 bg-orange-50 dark:bg-gray-800" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-orange-50 dark:bg-gray-800 rounded w-3/4" />
              <div className="h-3 bg-orange-50 dark:bg-gray-800 rounded w-full" />
              <div className="flex gap-1.5">
                <div className="h-5 bg-orange-50 dark:bg-gray-800 rounded-full w-14" />
                <div className="h-5 bg-orange-50 dark:bg-gray-800 rounded-full w-14" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RecipeCards({ dishes, onSelect, loading }: Props) {
  if (loading) return <Skeleton />;
  if (dishes.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Suggested Dishes</h2>
        <span className="text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">{dishes.length}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {dishes.map((dish) => (
          <button
            key={dish.id}
            onClick={() => onSelect(dish)}
            className="text-left bg-white dark:bg-[#1a1a2e] rounded-xl border border-orange-100 dark:border-gray-800 overflow-hidden hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700 transition-all group"
          >
            <div className="relative">
              <DishImage name={dish.name} />
              <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                dish.isVeg ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
              }`}>
                {dish.isVeg ? "Veg" : "Non-Veg"}
              </span>
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {dish.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{dish.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs px-2 py-0.5 bg-orange-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">⏱ {dish.cookingTime}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[dish.difficulty]}`}>{dish.difficulty}</span>
                <span className="text-xs px-2 py-0.5 bg-orange-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">{dish.cuisine}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
