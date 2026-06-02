"use client";

import { useFavorites } from "@/hooks/useFavorites";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="min-h-screen bg-[#fefcf8] dark:bg-[#1a1a2e]">
      <header className="border-b border-orange-100 dark:border-gray-800 bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-xl">🍳</span>
            <span className="font-bold text-lg text-gray-800 dark:text-white">AI Kitchen</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors">Home</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Favorites {favorites.length > 0 && <span className="text-sm font-normal text-gray-400">({favorites.length})</span>}
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">💝</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No favorites yet</p>
            <Link href="/" className="text-sm text-orange-500 hover:text-orange-600 font-medium">Find recipes →</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {favorites.map((fav) => (
              <div key={fav.dishName} className="flex items-center justify-between bg-white dark:bg-[#1a1a2e] border border-orange-100 dark:border-gray-800 rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{fav.dishName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{fav.ingredients.slice(0, 4).join(", ")}{fav.ingredients.length > 4 ? "..." : ""}</p>
                </div>
                <button onClick={() => removeFavorite(fav.dishName)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
