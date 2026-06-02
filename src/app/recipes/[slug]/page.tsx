"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { generateRecipe, suggestDishes } from "@/services/ai";
import { useFavorites } from "@/hooks/useFavorites";
import type { Recipe, Dish } from "@/types";
import { DIFFICULTY_COLORS } from "@/utils/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import VideoSection from "@/components/VideoSection";
import RecipeCards from "@/components/RecipeCards";

export default function RecipePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const ingredientsStr = searchParams.get("ingredients") || "";
  const ingredients = ingredientsStr ? ingredientsStr.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [similarDishes, setSimilarDishes] = useState<Dish[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const dishName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const fetchImage = useCallback(async (query: string) => {
    try {
      const res = await fetch(`/api/images?query=${encodeURIComponent(query + " food recipe")}`);
      const data = await res.json();
      if (data.image) setHeroImage(data.image);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setRecipe(null);

    Promise.all([
      generateRecipe(dishName, ingredients.length > 0 ? ingredients : [dishName]),
      fetchImage(dishName),
    ])
      .then(([recipeData]) => setRecipe(recipeData))
      .catch(() => {
        setRecipe({
          dishName,
          ingredients: [],
          servings: 2,
          cookingTime: "30 mins",
          difficulty: "Medium",
          cuisine: "Indian",
          isVeg: true,
          prepSteps: ["Could not generate recipe. Please try again."],
          cookSteps: [],
          tips: [],
          extraIngredients: [],
        });
      })
      .finally(() => setLoading(false));
  }, [slug, dishName, ingredients.length, fetchImage]);

  useEffect(() => {
    if (ingredients.length === 0) return;
    setLoadingSimilar(true);
    suggestDishes(ingredients)
      .then((dishes) => setSimilarDishes(dishes.filter((d) => d.name.toLowerCase() !== dishName.toLowerCase()).slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoadingSimilar(false));
  }, [ingredients, dishName]);

  const handleSelectSimilar = useCallback(
    (dish: Dish) => {
      const s = dish.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      router.push(`/recipes/${s}?ingredients=${encodeURIComponent(ingredients.join(","))}`);
    },
    [router, ingredients]
  );

  function handleFavorite() {
    if (recipe) toggleFavorite({ dishName: recipe.dishName, ingredients: recipe.ingredients });
  }

  function handleShare() {
    const text = `🍳 ${dishName}\nIngredients: ${ingredients.join(", ")}\nCheck it out at ${window.location.href}`;
    if (navigator.share) navigator.share({ title: dishName, text }).catch(() => {});
    else navigator.clipboard.writeText(text).catch(() => {});
  }

  function handlePrint() {
    window.print();
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fefcf8] dark:bg-[#0f0f1a]">
        <Header />
        <main className="flex-1 pt-16">
          <div className="h-64 sm:h-80 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 animate-pulse" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-6 bg-orange-100 dark:bg-gray-800 rounded w-48 animate-pulse" />
                <div className="h-4 bg-orange-50 dark:bg-gray-800 rounded w-32 animate-pulse" />
                <div className="space-y-2 mt-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-4 bg-orange-50 dark:bg-gray-800 rounded w-full animate-pulse" />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-orange-50 dark:bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!recipe) return null;
  const r = recipe;

  return (
    <div className="min-h-screen flex flex-col bg-[#fefcf8] dark:bg-[#0f0f1a]">
      <Header />

      <main className="flex-1 pt-16">
        {/* SECTION 1: Hero Image */}
        <section className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20">
            {heroImage && (
              <img src={heroImage} alt={dishName} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  recipe.isVeg ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}>
                  {recipe.isVeg ? "Veg" : "Non-Veg"}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${DIFFICULTY_COLORS[recipe.difficulty]} bg-white/90 dark:bg-gray-800/90`}>
                  {recipe.difficulty}
                </span>
                <span className="text-xs font-medium px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 rounded-full">
                  ⏱ {recipe.cookingTime}
                </span>
                <span className="text-xs font-medium px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 rounded-full">
                  {recipe.cuisine}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg">
                {dishName}
              </h1>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: Two Column Details */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* LEFT: Ingredients & Prep Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { label: "Prep Time", value: "15 mins", icon: "⏱️" },
                  { label: "Cook Time", value: recipe.cookingTime, icon: "🔥" },
                  { label: "Servings", value: `${recipe.servings}`, icon: "👥" },
                ].map((info) => (
                  <div key={info.label} className="p-3 bg-white dark:bg-[#1a1a2e] rounded-xl border border-orange-100 dark:border-gray-800 text-center">
                    <span className="text-lg">{info.icon}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{info.label}</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{info.value}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-orange-500 rounded-full" />
                Ingredients
              </h2>
              <ul className="space-y-2.5 mb-8">
                {recipe.ingredients.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>

              {recipe.extraIngredients.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-100 dark:border-orange-900/50 mb-8">
                  <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2">You may also need:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {recipe.extraIngredients.map((item, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 bg-white dark:bg-[#1a1a2e] text-orange-600 dark:text-orange-400 rounded-full border border-orange-200 dark:border-orange-800 font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* RIGHT: Instructions */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-green-500 rounded-full" />
                Preparation Steps
              </h2>
              <div className="space-y-3 mb-8">
                {recipe.prepSteps.map((step, i) => (
                  <motion.div
                    key={`prep-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 bg-white dark:bg-[#1a1a2e] rounded-xl border border-orange-100 dark:border-gray-800 shadow-sm"
                  >
                    <div className="flex gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 pt-0.5">{step}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-red-500 rounded-full" />
                Cooking Instructions
              </h2>
              <div className="space-y-3">
                {recipe.cookSteps.map((step, i) => (
                  <motion.div
                    key={`cook-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 bg-white dark:bg-[#1a1a2e] rounded-xl border border-orange-100 dark:border-gray-800 shadow-sm"
                  >
                    <div className="flex gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 pt-0.5">{step}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {recipe.tips.length > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-900/50">
                  <p className="text-xs font-bold text-green-700 dark:text-green-300 mb-2 flex items-center gap-1.5">💡 Tips</p>
                  <ul className="space-y-1.5">
                    {recipe.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex gap-2">
                        <span className="text-green-500 shrink-0 mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* SECTION 3: Video Recipes */}
        <section className="bg-white dark:bg-[#0f0f1a] py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Video Recipes
              </h2>
            </motion.div>
            <VideoSection dishName={dishName} />
          </div>
        </section>

        {/* SECTION 4: Similar Recipes */}
        {similarDishes.length > 0 && (
          <section className="py-10 lg:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                  Similar Recipes You Might Like
                </h2>
              </motion.div>
              <RecipeCards dishes={similarDishes} onSelect={handleSelectSimilar} loading={loadingSimilar} />
            </div>
          </section>
        )}
      </main>

      {/* SECTION 5: Sticky Action Bar */}
      <div className="sticky bottom-0 z-40 bg-white/95 dark:bg-[#1a1a2e]/95 backdrop-blur-xl border-t border-orange-100 dark:border-gray-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-xl transition-all"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5l-7.5-7.5 7.5-7.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center">
            <button
              onClick={handleFavorite}
              className="flex flex-col sm:flex-row items-center gap-0 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-sm font-medium rounded-xl transition-all hover:bg-orange-50 dark:hover:bg-gray-800"
            >
              <svg className={`w-5 h-5 ${isFavorite(dishName) ? "text-red-500 fill-current" : "text-gray-400"}`} fill={isFavorite(dishName) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span className="text-gray-500 dark:text-gray-400 sm:text-gray-600 sm:dark:text-gray-300">Save</span>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col sm:flex-row items-center gap-0 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-gray-600 sm:dark:text-gray-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              <span>Share</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
              </svg>
              Print
            </button>

            <button
              onClick={handleCopyLink}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                copied ? "bg-green-50 dark:bg-green-900/20 text-green-600" : "text-gray-600 dark:text-gray-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </div>

      <ScrollToTop />
      <Footer />
    </div>
  );
}
