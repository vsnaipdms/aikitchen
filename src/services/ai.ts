export async function suggestDishes(ingredients: string[]) {
  const res = await fetch("/api/suggest-dishes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to get suggestions");
  }
  const data = await res.json();
  return data.dishes;
}

export async function generateRecipe(dishName: string, ingredients: string[]) {
  const res = await fetch("/api/generate-recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dishName, ingredients }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to generate recipe");
  }
  const data = await res.json();
  return data.recipe;
}
