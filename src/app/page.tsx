"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
  {
    icon: "sparkles",
    title: "AI Powered Suggestions",
    desc: "Enter ingredients and get instant recipe suggestions powered by advanced AI.",
  },
  {
    icon: "image",
    title: "Dynamic Food Images",
    desc: "Beautiful food photography fetched dynamically for every recipe suggestion.",
  },
  {
    icon: "video",
    title: "Video Recipes",
    desc: "Watch step-by-step cooking tutorials embedded right in the app.",
  },
  {
    icon: "heart",
    title: "Save Favorites",
    desc: "Bookmark your favorite recipes and access them anytime, anywhere.",
  },
];

const testimonials = [
  { name: "Priya S.", role: "Home Cook", text: "AI Kitchen saved me so many times when I had random ingredients and no idea what to cook!", initials: "PS" },
  { name: "Rajesh K.", role: "College Student", text: "Perfect for quick meals with whatever I have in my dorm kitchen.", initials: "RK" },
  { name: "Anita M.", role: "Food Blogger", text: "The video integration is brilliant. One tap and I'm watching the recipe being made.", initials: "AM" },
];

function FeatureIcon({ name, className }: { name: string; className?: string }) {
  const cls = `w-7 h-7 ${className || ""}`;
  switch (name) {
    case "sparkles":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      );
    case "image":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
      );
    case "video":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9.75a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      );
    case "heart":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      );
    case "lightning":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      );
    case "star":
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    case "check":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Home() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(STORAGE_KEYS.RECENT, []);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  function handleClear() {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEYS.RECENT);
    setToast("Recent searches cleared");
  }

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

  const heroDecorIcons = [
    { icon: "sparkles", top: "top-1/4", right: "right-1/4", delay: 0 },
    { icon: "image", top: "top-1/3", left: "left-1/4", delay: 1 },
    { icon: "video", bottom: "bottom-1/3", right: "right-1/3", delay: 0.5 },
    { icon: "heart", bottom: "bottom-1/4", left: "left-1/3", delay: 2 },
  ];

  const heroImages = [
    { url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop", label: "Food Spread", type: "Mix" },
    { url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop", label: "Margherita Pizza", type: "Veg" },
    { url: "https://images.unsplash.com/photo-1546069901-ba95909a1d1a?w=800&h=800&fit=crop", label: "Fresh Garden Salad", type: "Veg" },
    { url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=800&fit=crop", label: "Grilled Chicken", type: "Non-Veg" },
    { url: "https://images.unsplash.com/photo-1498837167922-ddd27555a1d0?w=800&h=800&fit=crop", label: "Farm Fresh Veggies", type: "Veg" },
  ];

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHeroIndex((p) => (p + 1) % heroImages.length), 4000);
    return () => clearInterval(t);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-[#0f0f1a] dark:via-[#1a1a2e] dark:to-[#0f0f1a]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ isolation: "isolate" }}>
            <div
              className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300/20 dark:bg-orange-500/5 rounded-full blur-3xl"
              style={{ willChange: "transform", animation: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
            />
            <div
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-300/20 dark:bg-red-500/5 rounded-full blur-3xl"
              style={{ willChange: "transform", animation: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite 1.5s" }}
            />
            <div className="hidden sm:block">
              {heroDecorIcons.map((d, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: d.delay }}
                  className={`absolute ${d.top || ""} ${d.bottom || ""} ${d.left || ""} ${d.right || ""} w-10 h-10 text-orange-400/20 dark:text-orange-500/15`}
                >
                  <FeatureIcon name={d.icon} />
                </motion.div>
              ))}
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
                  <span className="w-2 h-2 bg-orange-500 rounded-full" style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
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
                    { label: "AI Recipes", icon: "sparkles" },
                    { label: "Food Images", icon: "image" },
                    { label: "Recipe Videos", icon: "video" },
                    { label: "Fast Suggestions", icon: "lightning" },
                  ].map((f) => (
                    <span key={f.label} className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                        <FeatureIcon name="check" className="w-3 h-3" />
                      </span>
                      {f.label}
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
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20">
                  {/* Crossfade carousel */}
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={heroIndex}
                      src={heroImages[heroIndex].url}
                      alt={heroImages[heroIndex].label}
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

                  {/* Decorative image badges */}
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-3 right-3 w-28 h-28 rounded-2xl overflow-hidden shadow-xl border-2 border-white/80 dark:border-gray-800 rotate-6 z-10"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1546069901-ba95909a1d1a?w=200&h=200&fit=crop"
                      alt="Fresh salad"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                    className="absolute bottom-1/3 -left-4 w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-2 border-white/80 dark:border-gray-800 -rotate-3 z-10"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop"
                      alt="Grilled chicken"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Food type badge */}
                  <motion.div
                    key={`type-${heroIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute top-4 left-4 z-10"
                  >
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-lg ${
                      heroImages[heroIndex].type === "Veg"
                        ? "bg-green-500/90 text-white"
                        : heroImages[heroIndex].type === "Non-Veg"
                        ? "bg-red-500/90 text-white"
                        : "bg-orange-500/90 text-white"
                    }`}>
                      {heroImages[heroIndex].type}
                    </span>
                  </motion.div>

                  {/* Floating animated icons */}
                  <motion.div
                    animate={{ y: [0, -14, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 right-4 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl shadow-lg flex items-center justify-center z-10"
                  >
                    <FeatureIcon name="heart" className="w-5 h-5 text-red-500" />
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/2 left-4 w-9 h-9 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl shadow-lg flex items-center justify-center z-10"
                  >
                    <FeatureIcon name="sparkles" className="w-4 h-4 text-orange-500" />
                  </motion.div>

                  {/* Rating badge */}
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-4 right-4 px-3.5 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl shadow-lg flex items-center gap-1.5 z-10"
                  >
                    <FeatureIcon name="star" className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-700 dark:text-gray-200 text-sm font-semibold">4.9</span>
                  </motion.div>

                  {/* Carousel dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                    {heroImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setHeroIndex(i)}
                        className={`rounded-full transition-all ${
                          i === heroIndex
                            ? "w-5 h-2 bg-white shadow-md"
                            : "w-2 h-2 bg-white/50 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* INGREDIENT SEARCH */}
        <section id="ingredients" className="relative overflow-hidden py-12 sm:py-16 lg:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-50/80 via-orange-50/40 to-transparent dark:from-orange-900/10 dark:via-orange-900/5 dark:to-transparent" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-[10%] w-32 h-32 bg-orange-300/20 dark:bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-[15%] w-40 h-40 bg-red-300/20 dark:bg-red-500/10 rounded-full blur-3xl" />
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute top-8 left-[8%] w-8 h-8 text-orange-400/20">
              <FeatureIcon name="sparkles" className="w-full h-full" />
            </motion.div>
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="absolute top-12 right-[12%] w-6 h-6 text-red-400/20">
              <FeatureIcon name="heart" className="w-full h-full" />
            </motion.div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute bottom-16 left-[15%] w-7 h-7 text-green-400/20">
              <FeatureIcon name="image" className="w-full h-full" />
            </motion.div>
            <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-20 right-[8%] w-8 h-8 text-orange-400/20">
              <FeatureIcon name="lightning" className="w-full h-full" />
            </motion.div>
          </div>
          <div className="relative z-10 w-[90%] max-w-[1400px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/70 dark:bg-[#1a1a2e]/70 backdrop-blur-2xl rounded-[24px] shadow-2xl shadow-orange-500/15 border border-white/30 dark:border-gray-800/50 p-6 sm:p-8 lg:p-10"
            >
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  What ingredients do you have today?
                </h2>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
                  Add ingredients and let AI discover delicious recipes
                </p>
              </div>
              <IngredientInput
                ingredients={ingredients}
                onAdd={addIngredient}
                onRemove={removeIngredient}
                onSearch={handleSearch}
                loading={loadingSuggestions}
              />
            </motion.div>
          </div>
        </section>

        {/* RECENT SEARCHES */}
        {recentSearches.length > 0 && (
          <section className="max-w-[1400px] w-[90%] mx-auto pb-8 -mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Searches
              </h3>
              <button
                onClick={handleClear}
                className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const items = q.split(", ").filter(Boolean);
                    setIngredients(items);
                    if (items.length > 0) {
                      setDishes([]);
                      setError(null);
                      setLoadingSuggestions(true);
                      suggestDishes(items).then((result) => {
                        setDishes(result);
                        setLoadingSuggestions(false);
                      }).catch((err) => {
                        setError(err instanceof Error ? err.message : "Something went wrong");
                        setLoadingSuggestions(false);
                      });
                    }
                  }}
                  className="px-4 py-2 text-sm bg-white dark:bg-[#1a1a2e] hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 shadow-sm hover:shadow-md transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </section>
        )}

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
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform text-orange-600 dark:text-orange-400">
                      <FeatureIcon name={f.icon} className="w-6 h-6" />
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
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br ${
                        i === 0 ? "from-orange-500 to-red-500" : i === 1 ? "from-green-500 to-emerald-500" : "from-blue-500 to-purple-500"
                      }`}>
                        {t.initials}
                      </div>
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

      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-xl shadow-2xl transition-opacity">
          {toast}
        </div>
      )}

      <ScrollToTop />
      <Footer />
    </div>
  );
}
