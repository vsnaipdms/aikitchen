"use client";
import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) setValue(JSON.parse(item));
    } catch {}
  }, [key]);

  const setStored = useCallback((val: T | ((v: T) => T)) => {
    setValue((prev) => {
      const next = val instanceof Function ? val(prev) : val;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);

  return [value, setStored] as const;
}
