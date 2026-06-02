"use client";

import { useFavorites } from "@/hooks/useFavorites";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="min-h-screen flex flex-col bg-[#fefcf8] dark:bg-[#0f0f1a]">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Favorites</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {favorites.length > 0 ? `You have ${favorites.length} saved ${favorites.length === 1 ? "recipe" : "recipes"}` : "Save recipes to access them quickly"}
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/25"
            >
              Find Recipes
            </Link>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">💝</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No favorites yet</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Start exploring recipes and save your favorites!</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/25"
              >
                Discover Recipes
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {favorites.map((fav) => (
                <div
                  key={fav.dishName}
                  className="group flex items-center justify-between bg-white dark:bg-[#1a1a2e] rounded-2xl border border-orange-100 dark:border-gray-800 p-4 hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-700 transition-all"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">{fav.dishName}</p>
                    <p className="text-xs text-gray-400 mt-1 truncate">{fav.ingredients.slice(0, 5).join(", ")}{fav.ingredients.length > 5 ? "..." : ""}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(fav.savedAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => removeFavorite(fav.dishName)}
                    className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    aria-label={`Remove ${fav.dishName} from favorites`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
