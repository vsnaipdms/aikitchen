import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("query");
  if (!query) return NextResponse.json({ image: null });

  const pexelsKey = process.env.PEXELS_API_KEY;

  if (pexelsKey) {
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        { headers: { Authorization: pexelsKey } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.photos?.length > 0) {
          return NextResponse.json({ image: data.photos[0].src.large2x || data.photos[0].src.large });
        }
      } else {
        const text = await res.text();
        console.error("Pexels error:", text);
      }
    } catch (err) {
      console.error("Pexels fetch error:", err);
    }
  }

  console.warn("No image found for:", query);
  return NextResponse.json({ image: null });
}
