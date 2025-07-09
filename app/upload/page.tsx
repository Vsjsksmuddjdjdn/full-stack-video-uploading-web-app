"use client";

import { useState } from "react";
import FileUpload from "../components/FileUpload";
import { IVideo } from "@/model/Video";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVideoUploadSuccess = (res: any) => {
    setVideoUrl(res.url);
  };

  const handleThumbnailUploadSuccess = (res: any) => {
    setThumbnailUrl(res.url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !videoUrl || !thumbnailUrl) {
      setError("Please fill all required fields and upload both video and thumbnail");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          videoUrl,
          thumbnailUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create video");
      }

      // Redirect to home page or video page after successful upload
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Upload Video</h1>
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Video File *
          </label>
          <div className="border border-dashed border-gray-600 p-4 rounded">
            {videoUrl ? (
              <div className="text-green-500 mb-2">Video uploaded successfully!</div>
            ) : (
              <FileUpload 
                onSuccess={handleVideoUploadSuccess} 
                onProgress={setUploadProgress}
                fileType="video" 
              />
            )}
            {uploadProgress > 0 && !videoUrl && (
              <div className="mt-2">
                <div className="h-2 bg-gray-700 rounded-full mt-1">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400 mt-1">{uploadProgress}% uploaded</p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Thumbnail Image *
          </label>
          <div className="border border-dashed border-gray-600 p-4 rounded">
            {thumbnailUrl ? (
              <div>
                <div className="text-green-500 mb-2">Thumbnail uploaded successfully!</div>
                <img 
                  src={thumbnailUrl} 
                  alt="Thumbnail preview" 
                  className="max-h-40 mt-2 rounded" 
                />
              </div>
            ) : (
              <FileUpload 
                onSuccess={handleThumbnailUploadSuccess} 
                fileType="image" 
              />
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !formData.title || !formData.description || !videoUrl || !thumbnailUrl}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded font-medium transition-colors"
        >
          {isSubmitting ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
}