"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
      <div className="h-40 sm:h-48 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center">
        <span className="text-5xl opacity-40">🍽️</span>
      </div>
    );
  }

  return (
    <div className="relative h-40 sm:h-48 bg-orange-50 dark:bg-gray-800 overflow-hidden">
      {img ? (
        <>
          <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-[#1a1a2e] rounded-2xl border border-orange-100 dark:border-gray-800 overflow-hidden animate-pulse">
          <div className="h-48 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-orange-100 dark:bg-gray-800 rounded w-3/4" />
            <div className="h-3 bg-orange-50 dark:bg-gray-800 rounded w-full" />
            <div className="flex gap-2">
              <div className="h-6 bg-orange-50 dark:bg-gray-800 rounded-full w-16" />
              <div className="h-6 bg-orange-50 dark:bg-gray-800 rounded-full w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RecipeCards({ dishes, onSelect, loading }: Props) {
  if (loading) return <Skeleton />;
  if (dishes.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Suggested Dishes</h2>
        <span className="text-sm px-3 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium">{dishes.length}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {dishes.map((dish, index) => (
          <motion.button
            key={dish.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            onClick={() => onSelect(dish)}
            className="group text-left bg-white dark:bg-[#1a1a2e] rounded-2xl border border-orange-100 dark:border-gray-800 overflow-hidden shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-orange-500/10 card-hover"
          >
            <div className="relative overflow-hidden">
              <DishImage name={dish.name} />
              <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm ${
                dish.isVeg ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
              }`}>
                {dish.isVeg ? "Veg" : "Non-Veg"}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                {dish.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">{dish.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="text-xs px-2.5 py-1 bg-orange-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full font-medium">⏱ {dish.cookingTime}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${DIFFICULTY_COLORS[dish.difficulty]}`}>{dish.difficulty}</span>
                <span className="text-xs px-2.5 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full font-medium">{dish.cuisine}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
