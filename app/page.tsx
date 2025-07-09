"use client";

import { useEffect, useState } from "react";
import { IVideo } from "@/model/Video";

export default function HomePage() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/video");
        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }
        const data = await response.json();
        setVideos(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Video Dashboard</h1>
      
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-6 max-w-2xl mx-auto">
          {error}
        </div>
      )}
      
      {!loading && !error && videos.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400 mb-4">No videos uploaded yet</p>
          <a 
            href="/upload" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Upload Your First Video
          </a>
        </div>
      )}
      
      {videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {videos.map((video) => (
            <div key={video._id?.toString()} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="relative pb-[56.25%] h-0">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 truncate">{video.title}</h3>
                <p className="text-gray-400 line-clamp-2">{video.description}</p>
                <a 
                  href={`/video/${video._id}`} 
                  className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-4 rounded transition-colors"
                >
                  Watch Video
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}