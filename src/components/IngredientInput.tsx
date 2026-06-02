"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { EXAMPLE_INGREDIENTS } from "@/utils/constants";

interface Props {
  ingredients: string[];
  onAdd: (name: string) => void;
  onRemove: (index: number) => void;
  onSearch: () => void;
  loading: boolean;
  recentSearches: string[];
  onRecentClick: (query: string) => void;
}

export default function IngredientInput({
  ingredients, onAdd, onRemove, onSearch, loading, recentSearches, onRecentClick,
}: Props) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = EXAMPLE_INGREDIENTS.filter(
    (i) => i.toLowerCase().includes(input.toLowerCase()) && !ingredients.some((v) => v.toLowerCase() === i.toLowerCase())
  );

  function add(name: string) {
    const t = name.trim();
    if (t && !ingredients.some((v) => v.toLowerCase() === t.toLowerCase())) onAdd(t);
    setInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); add(input); }
    if (e.key === "," || e.key === "Tab") { e.preventDefault(); add(input.replace(/,/g, "")); }
  }

  function handleRecent(q: string) {
    q.split(", ").filter(Boolean).forEach((item) => {
      if (!ingredients.some((v) => v.toLowerCase() === item.toLowerCase())) onAdd(item);
    });
    setShowRecent(false);
  }

  return (
    <div id="ingredients">
      <div className="relative">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 sm:p-4 bg-white/95 dark:bg-[#1a1a2e]/95 backdrop-blur-xl border-2 border-orange-200 dark:border-gray-700 rounded-2xl sm:rounded-[24px] shadow-2xl shadow-orange-500/10 focus-within:border-orange-400 focus-within:shadow-orange-500/25 transition-all duration-300">
          <div className="flex-1 flex flex-wrap items-center gap-2 px-1 sm:px-3 min-h-[55px] sm:min-h-[65px]">
            <svg className="w-5 h-5 text-orange-400 shrink-0 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
            <div className="flex-1 flex flex-wrap items-center gap-1.5 min-w-0 overflow-x-auto pb-1 scrollbar-hide">
              {ingredients.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 text-orange-700 dark:text-orange-300 text-sm sm:text-base font-medium rounded-xl whitespace-nowrap shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082" />
                  </svg>
                  {item}
                  <button onClick={() => onRemove(i)} className="hover:text-orange-900 dark:hover:text-orange-100 ml-0.5" aria-label={`Remove ${item}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value); setShowSuggestions(e.target.value.length > 0); }}
                onFocus={() => { if (input) setShowSuggestions(true); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={handleKey}
                placeholder={ingredients.length === 0 ? "e.g. Rice, Onion, Tomato..." : "Add more..."}
                className="flex-1 min-w-[140px] sm:min-w-[180px] bg-transparent outline-none text-base sm:text-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 py-3"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:pl-2 sm:border-l border-orange-100 dark:border-gray-700">
            <button
              onClick={() => setShowRecent(!showRecent)}
              className="p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-400 hover:text-orange-500 transition-all"
              title="Recent searches"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button
              onClick={onSearch}
              disabled={ingredients.length === 0 || loading}
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700 disabled:cursor-not-allowed text-white text-sm sm:text-base font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Searching
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  Find Recipes
                </span>
              )}
            </button>
          </div>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 p-3 glass rounded-2xl shadow-2xl z-20 border border-orange-100 dark:border-gray-700">
            <div className="flex flex-wrap gap-1.5">
              {suggestions.slice(0, 12).map((item) => (
                <button
                  key={item}
                  onMouseDown={(e) => { e.preventDefault(); add(item); }}
                  className="px-3.5 py-2 text-sm bg-orange-50 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-gray-600 dark:text-gray-400 rounded-xl transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {showRecent && recentSearches.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 p-3 glass rounded-2xl shadow-2xl z-20 border border-orange-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-400 mb-2">Recent Searches</p>
            <div className="flex flex-wrap gap-1.5">
              {recentSearches.map((q, i) => (
                <button
                  key={i}
                  onMouseDown={(e) => { e.preventDefault(); handleRecent(q); }}
                  className="px-3.5 py-2 text-sm bg-orange-50 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-gray-500 dark:text-gray-400 rounded-xl transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {ingredients.length === 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Try:
          </span>
          {["Rice, Egg, Onion", "Pasta, Tomato, Garlic", "Chicken, Potato, Curry"].map((ex) => (
            <button
              key={ex}
              onClick={() => handleRecent(ex)}
              className="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 shadow-sm hover:shadow-md transition-all"
            >
              {ex}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
