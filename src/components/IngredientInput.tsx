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
    <div>
      <div className="relative">
        <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-[#1a1a2e] border-2 border-orange-200 dark:border-gray-700 rounded-xl focus-within:border-orange-400 transition-colors">
          <div className="flex-1 flex flex-wrap items-center gap-1 px-2 min-h-[40px]">
            {ingredients.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm rounded-full"
              >
                {item}
                <button onClick={() => onRemove(i)} className="hover:text-orange-900 dark:hover:text-orange-100" aria-label={`Remove ${item}`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
              placeholder={ingredients.length === 0 ? "Add ingredients (e.g. Rice, Onion, Tomato)..." : "Add more..."}
              className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 py-1.5"
            />
          </div>
          <div className="flex items-center gap-1 pr-1">
            <button
              onClick={() => setShowRecent(!showRecent)}
              className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-400 transition-colors"
              title="Recent searches"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button
              onClick={() => input && add(input)}
              className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-400 transition-colors"
              title="Add"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
            <button
              onClick={onSearch}
              disabled={ingredients.length === 0 || loading}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Searching
                </span>
              ) : "Find Recipes"}
            </button>
          </div>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 p-1.5 bg-white dark:bg-[#1a1a2e] border border-orange-100 dark:border-gray-700 rounded-xl shadow-lg z-10">
            <div className="flex flex-wrap gap-1">
              {suggestions.slice(0, 10).map((item) => (
                <button
                  key={item}
                  onMouseDown={(e) => { e.preventDefault(); add(item); }}
                  className="px-2.5 py-1 text-sm bg-orange-50 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {showRecent && recentSearches.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-white dark:bg-[#1a1a2e] border border-orange-100 dark:border-gray-700 rounded-xl shadow-lg z-10">
            <p className="text-xs text-gray-400 mb-1.5">Recent</p>
            <div className="flex flex-wrap gap-1">
              {recentSearches.map((q, i) => (
                <button
                  key={i}
                  onMouseDown={(e) => { e.preventDefault(); handleRecent(q); }}
                  className="px-2.5 py-1 text-sm bg-orange-50 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-gray-500 dark:text-gray-400 rounded-lg transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {ingredients.length === 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {["Rice, Egg, Onion", "Pasta, Tomato, Garlic", "Chicken, Potato"].map((ex) => (
            <button
              key={ex}
              onClick={() => handleRecent(ex)}
              className="px-2.5 py-1 text-xs bg-orange-50 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-gray-500 dark:text-gray-400 rounded-lg border border-orange-100 dark:border-gray-700 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
