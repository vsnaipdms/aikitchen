export async function fetchFoodImage(query: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/images?query=${encodeURIComponent(query + " food")}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.image || null;
  } catch {
    return null;
  }
}
