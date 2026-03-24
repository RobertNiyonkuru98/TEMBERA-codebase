import { Image as ImageIcon, Video, Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import type { StepProps } from "./types";

interface MediaUploadStepProps extends StepProps {
  token: string;
}

export function MediaUploadStep({ formData, updateFormData }: MediaUploadStepProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      setUploadError(null);
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        publicId: "",
        file,
      }));
      updateFormData({ images: [...formData.images, ...newImages] });
    } catch (error) {
      console.error("Image selection failed:", error);
      setUploadError("Failed to select images. Please try again.");
    } finally {
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const handleVideoUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      setUploadError(null);
      const newVideos = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        publicId: "",
        thumbnailUrl: "",
        file,
      }));
      updateFormData({ videos: [...formData.videos, ...newVideos] });
    } catch (error) {
      console.error("Video selection failed:", error);
      setUploadError("Failed to select videos. Please try again.");
    } finally {
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    updateFormData({ images: formData.images.filter((_, i) => i !== index) });
  };

  const removeVideo = (index: number) => {
    updateFormData({ videos: formData.videos.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-pink-500 to-pink-600 shadow-lg">
          <ImageIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Media Upload
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Add images and videos to showcase your itinerary
          </p>
        </div>
      </div>

      {uploadError && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
          <p className="text-sm text-red-900 dark:text-red-100">{uploadError}</p>
        </div>
      )}

      <div className="space-y-8">
        {/* Images Upload */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50">
              <ImageIcon className="inline h-4 w-4 mr-1" />
              Images
            </label>
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Upload className="h-4 w-4" />
              Upload Images
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
            />
          </div>

          {formData.images.length === 0 ? (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-12 text-center">
              <ImageIcon className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No images uploaded yet. Click "Upload Images" to add photos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={`Itinerary ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg border-2 border-slate-200 dark:border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Videos Upload */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50">
              <Video className="inline h-4 w-4 mr-1" />
              Videos
            </label>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Upload className="h-4 w-4" />
              Upload Videos
            </button>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => handleVideoUpload(e.target.files)}
              className="hidden"
            />
          </div>

          {formData.videos.length === 0 ? (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-12 text-center">
              <Video className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No videos uploaded yet. Click "Upload Videos" to add videos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.videos.map((_video, index) => (
                <div key={index} className="relative group">
                  <div className="w-full h-40 bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    <Video className="h-12 w-12 text-slate-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 truncate">
                    Video {index + 1}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
