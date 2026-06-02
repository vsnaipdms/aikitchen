"use client";

import { useEffect, useState } from "react";
import type { VideoItem } from "@/types";
import { searchVideos } from "@/services/youtube";

interface Props {
  dishName: string;
}

export default function VideoSection({ dishName }: Props) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    searchVideos(dishName).then((result) => {
      setVideos(result.videos);
      if (result.error) setError(result.error);
    }).catch(() => { setVideos([]); setError("Failed to load"); }).finally(() => setLoading(false));
  }, [dishName]);

  if (loading) {
    return (
      <div>
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          Video Recipes
        </h3>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse bg-orange-50 dark:bg-gray-800 rounded-xl overflow-hidden flex gap-3 p-2">
              <div className="w-24 h-16 bg-orange-100 dark:bg-gray-700 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5 py-1">
                <div className="h-3 bg-orange-100 dark:bg-gray-700 rounded w-full" />
                <div className="h-3 bg-orange-100 dark:bg-gray-700 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          Video Recipes
        </h3>
        <p className="text-xs text-gray-400">{error || "No videos found for this recipe."}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
        Video Recipes
      </h3>

      {playingId && (
        <div className="mb-3">
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${playingId}`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube player"
            />
          </div>
          <button
            onClick={() => setPlayingId(null)}
            className="mt-1.5 text-xs text-gray-500 hover:text-orange-500 transition-colors font-medium"
          >
            ✕ Close video
          </button>
        </div>
      )}

      <div className="space-y-2">
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => setPlayingId(video.id)}
            className={`group w-full text-left bg-white dark:bg-[#1a1a2e] rounded-xl border border-orange-100 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-700 transition-all flex gap-3 p-2 ${playingId === video.id ? "ring-2 ring-orange-500" : ""}`}
          >
            <div className="relative w-28 h-16 shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img src={video.thumbnail} alt={video.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <svg className="w-6 h-6 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0 py-0.5">
              <p className="text-xs font-medium text-gray-800 dark:text-white line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{video.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{video.channelName}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
