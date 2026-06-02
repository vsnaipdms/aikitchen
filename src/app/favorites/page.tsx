"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/hooks/useFavorites";
import { DIFFICULTY_COLORS } from "@/utils/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites, removeFavorite, clearAll } = useFavorites();

  const handleClick = useCallback(
    (name: string, ingredients: string[]) => {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      router.push(`/recipes/${slug}?ingredients=${encodeURIComponent(ingredients.join(","))}`);
    },
    [router]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#fefcf8] dark:bg-[#0f0f1a]">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Favorites</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {favorites.length > 0
                  ? `You have ${favorites.length} saved ${favorites.length === 1 ? "recipe" : "recipes"}`
                  : "Save recipes to access them quickly"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {favorites.length > 0 && (
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/25"
              >
                Find Recipes
              </button>
            </div>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No favorites yet</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Start exploring recipes and save your favorites!</p>
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/25"
              >
                Discover Recipes
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {favorites.map((fav) => (
                <div
                  key={fav.dishName}
                  onClick={() => handleClick(fav.dishName, fav.ingredients)}
                  className="group flex items-center justify-between bg-white dark:bg-[#1a1a2e] rounded-2xl border border-orange-100 dark:border-gray-800 p-4 hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-700 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl shrink-0 flex items-center justify-center text-2xl ${
                      fav.isVeg
                        ? "bg-green-50 dark:bg-green-900/20"
                        : "bg-red-50 dark:bg-red-900/20"
                    }`}>
                      {fav.isVeg ? (
                        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-800 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                        {fav.dishName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {fav.ingredients.length > 0
                          ? fav.ingredients.slice(0, 5).join(", ") + (fav.ingredients.length > 5 ? "..." : "")
                          : fav.description || "No ingredients saved"}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        {fav.cookingTime && (
                          <span className="text-[10px] px-2 py-0.5 bg-orange-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full font-medium">
                            ⏱ {fav.cookingTime}
                          </span>
                        )}
                        {fav.difficulty && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${fav.difficulty ? DIFFICULTY_COLORS[fav.difficulty] : ""}`}>
                            {fav.difficulty}
                          </span>
                        )}
                        {fav.cuisine && (
                          <span className="text-[10px] px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full font-medium">
                            {fav.cuisine}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400 ml-auto">{new Date(fav.savedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(fav.dishName);
                    }}
                    className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-all shrink-0 ml-2"
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
      <ScrollToTop />
      <Footer />
    </div>
  );
}
