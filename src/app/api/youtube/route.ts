import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("query");
  if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 });

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    console.warn("YOUTUBE_API_KEY not set");
    return NextResponse.json({ videos: [] });
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(query)}&type=video&key=${key}`
    );
    if (!res.ok) {
      const text = await res.text();
      console.error("YouTube API error:", text);
      return NextResponse.json({ videos: [], error: text });
    }

    const data = await res.json();
    const videos = (data.items || []).map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      channelName: item.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

    return NextResponse.json({ videos });
  } catch (err) {
    console.error("YouTube search error:", err);
    return NextResponse.json({ videos: [] });
  }
}
