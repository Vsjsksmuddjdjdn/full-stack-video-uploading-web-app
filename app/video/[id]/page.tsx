"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IVideo } from "@/model/Video";

export default function VideoWatchPage() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<IVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/video/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Video not found");
          }
          throw new Error("Failed to fetch video");
        }
        const data = await response.json();
        setVideo(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchVideo();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">🎬</div>
          <h1 className="text-2xl font-bold mb-2">Video Not Found</h1>
          <p className="text-gray-400 mb-6">The video you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Videos
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Video Player */}
          <div className="bg-black rounded-lg overflow-hidden mb-6 shadow-2xl">
            <video
              controls
              className="w-full aspect-video"
              poster={video.thumbnailUrl}
              preload="metadata"
            >
              <source src={video.videoUrl} type="video/mp4" />
              <source src={video.videoUrl} type="video/webm" />
              <source src={video.videoUrl} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video Info */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-400">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>
                  {video.transformation?.width || 1080} x {video.transformation?.height || 1920}
                </span>
              </div>
              <div className="flex items-center text-gray-400">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'Unknown date'}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{video.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}