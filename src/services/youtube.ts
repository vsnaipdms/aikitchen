export async function searchVideos(query: string) {
  try {
    const res = await fetch(`/api/youtube?query=${encodeURIComponent(query + " recipe")}`);
    const data = await res.json();
    return { videos: data.videos || [], error: data.error || null };
  } catch {
    return { videos: [], error: "Network error" };
  }
}
