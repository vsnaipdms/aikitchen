"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import type { Dish } from "@/types";
import { suggestDishes } from "@/services/ai";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/utils/constants";
import Header from "@/components/Header";
import IngredientInput from "@/components/IngredientInput";
import RecipeCards from "@/components/RecipeCards";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const features = [
  { icon: "🤖", title: "AI Powered Suggestions", desc: "Enter ingredients and get instant recipe suggestions powered by advanced AI." },
  { icon: "🖼️", title: "Dynamic Food Images", desc: "Beautiful food photography fetched dynamically for every recipe suggestion." },
  { icon: "🎥", title: "Video Recipes", desc: "Watch step-by-step cooking tutorials embedded right in the app." },
  { icon: "❤️", title: "Save Favorites", desc: "Bookmark your favorite recipes and access them anytime, anywhere." },
];

const testimonials = [
  { name: "Priya S.", role: "Home Cook", text: "AI Kitchen saved me so many times when I had random ingredients and no idea what to cook!", avatar: "👩‍🍳" },
  { name: "Rajesh K.", role: "College Student", desc: "Perfect for quick meals with whatever I have in my dorm kitchen.", avatar: "👨‍🍳", text: "Perfect for quick meals with whatever I have in my dorm kitchen." },
  { name: "Anita M.", role: "Food Blogger", desc: "The video integration is brilliant. One tap and I'm watching the recipe being made.", avatar: "🧑‍🍳", text: "The video integration is brilliant. One tap and I'm watching the recipe being made." },
];

export default function Home() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(STORAGE_KEYS.RECENT, []);

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

  const handleSelectDish = useCallback(
    (dish: Dish) => {
      const slug = dish.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      router.push(`/recipes/${slug}?ingredients=${encodeURIComponent(ingredients.join(","))}`);
    },
    [ingredients, router]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-[#0f0f1a] dark:via-[#1a1a2e] dark:to-[#0f0f1a]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300/20 dark:bg-orange-500/5 rounded-full blur-3xl animate-pulse-soft" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-300/20 dark:bg-red-500/5 rounded-full blur-3xl animate-pulse-soft" />
            <div className="hidden sm:block">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-1/4 w-16 h-16 text-4xl opacity-20"
              >🍅</motion.div>
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/3 left-1/4 w-12 h-12 text-3xl opacity-20"
              >🥬</motion.div>
              <motion.div
                animate={{ y: [0, -25, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-1/3 right-1/3 w-14 h-14 text-4xl opacity-20"
              >🧅</motion.div>
              <motion.div
                animate={{ y: [0, -18, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-1/4 left-1/3 w-10 h-10 text-3xl opacity-20"
              >🌶️</motion.div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-full mb-6">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  AI-Powered Recipe Generator
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                  Turn Your Ingredients Into{" "}
                  <span className="gradient-text">Delicious Meals</span>
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-4 max-w-lg leading-relaxed">
                  AI Kitchen helps you discover recipes instantly using ingredients already available at home.
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-8">
                  <a
                    href="#ingredients"
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
                  >
                    Find Recipes
                  </a>
                  <a
                    href="#features"
                    className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg transition-all"
                  >
                    Watch Demo
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                  {[
                    { label: "AI Recipes", icon: "🤖" },
                    { label: "Food Images", icon: "🖼️" },
                    { label: "Recipe Videos", icon: "🎥" },
                    { label: "Fast Suggestions", icon: "⚡" },
                  ].map((f) => (
                    <span key={f.label} className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold">✓</span> {f.label}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="relative hidden lg:block"
              >
                <div className="relative">
                  <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-orange-100 via-red-50 to-orange-50 dark:from-orange-900/20 dark:via-red-900/10 dark:to-orange-900/20 flex items-center justify-center overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="text-[10rem] leading-none"
                      >🍳</motion.div>
                      <motion.div
                        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute top-[15%] right-[15%] text-4xl"
                      >🥕</motion.div>
                      <motion.div
                        animate={{ y: [0, -12, 0], rotate: [0, -10, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                        className="absolute bottom-[20%] left-[10%] text-4xl"
                      >🧄</motion.div>
                      <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute top-[25%] left-[10%] text-3xl"
                      >🌿</motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute bottom-[30%] right-[10%] px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl shadow-lg text-sm font-medium"
                      >
                        ⭐ 4.9 Rating
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                        className="absolute top-[40%] -right-4 px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl shadow-lg text-xs font-medium"
                      >
                        🚀 Instant
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* INGREDIENT SEARCH */}
        <section id="ingredients" className="relative -mt-20 z-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 dark:bg-[#1a1a2e]/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-orange-500/10 border border-white/20 dark:border-gray-800/50 p-6 sm:p-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">What ingredients do you have?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Type ingredients and let AI find the perfect recipe</p>
            </div>
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
          </motion.div>
        </section>

        {/* ERROR */}
        {error && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-6">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </div>
          </section>
        )}

        {/* RECIPE SUGGESTIONS */}
        {(dishes.length > 0 || loadingSuggestions) && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <RecipeCards dishes={dishes} onSelect={handleSelectDish} loading={loadingSuggestions} />
          </section>
        )}

        {/* FEATURES */}
        <section id="features" className="py-20 bg-white dark:bg-[#0f0f1a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeUp className="text-center mb-12">
              <span className="text-xs font-semibold px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">Features</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-4">Everything You Need to Cook Smarter</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
                AI Kitchen combines cutting-edge AI with a beautiful interface to make cooking effortless.
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {features.map((f, i) => (
                <FadeUp key={f.title} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="group relative p-6 bg-white dark:bg-[#1a1a2e] rounded-2xl border border-orange-100 dark:border-gray-800 shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-orange-500/15 transition-all overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-500/5 to-transparent rounded-bl-full" />
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                      {f.icon}
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{f.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 bg-gradient-to-b from-transparent to-orange-50/50 dark:to-[#1a1a2e]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeUp className="text-center mb-12">
              <span className="text-xs font-semibold px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">Testimonials</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-4">Loved by Home Cooks</h2>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {testimonials.map((t, i) => (
                <FadeUp key={t.name} delay={i * 0.1}>
                  <div className="relative p-6 bg-white dark:bg-[#1a1a2e] rounded-2xl border border-orange-100 dark:border-gray-800 shadow-lg hover:shadow-xl hover:border-orange-200 dark:hover:border-orange-800 transition-all">
                    <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-orange-500/10 to-transparent rounded-br-2xl" />
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{t.avatar}</span>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white text-sm">{t.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-0.5 mt-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 p-8 sm:p-16 text-center"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Ready to Cook Smarter?
              </h2>
              <p className="text-orange-100 mt-3 text-sm sm:text-lg max-w-lg mx-auto">
                Start discovering delicious recipes with ingredients you already have.
              </p>
              <a
                href="#ingredients"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 mt-6 sm:mt-8 bg-white text-orange-600 font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                Start Cooking
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      <ScrollToTop />
      <Footer />
    </div>
  );
}
