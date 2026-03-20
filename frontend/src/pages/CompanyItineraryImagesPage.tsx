import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { useI18n } from "../i18n";
import { fetchItineraries } from "../api/platformApi";
import type { Itinerary } from "../types";
import { ImageUpload } from "../components/ImageUpload";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Upload,
  ImageIcon,
  Loader2,
  Images,
  CheckCircle2,
} from "lucide-react";

function CompanyItineraryImagesPage() {
  const { token } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<Array<{ url: string; publicId: string; file?: File }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function loadItinerary() {
      if (!token || !id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const itineraries = await fetchItineraries(token, { includeBlobs: true });
        const found = itineraries.find((item) => String(item.id) === String(id));
        if (!found) {
          throw new Error(t("company.manageImages.notFound"));
        }
        setItinerary(found);
      } catch (loadError) {
        const errorMsg =
          loadError instanceof Error ? loadError.message : t("company.manageImages.uploadError");
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }

    void loadItinerary();
  }, [token, id, t]);

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const filesToUpload = images.filter((img) => img.file);
    if (filesToUpload.length === 0) {
      toast.error(t("company.manageImages.uploadError"));
      return;
    }

    if (!token || !itinerary) {
      toast.error(t("company.manageImages.uploadError"));
      return;
    }

    try {
      setIsUploading(true);

      // Step 1: Upload to Cloudinary via /api/upload/images
      const formData = new FormData();
      filesToUpload.forEach((img) => {
        if (img.file) {
          formData.append("images", img.file);
        }
      });

      const uploadUrl = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/api/upload/images`;
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({ message: t("company.manageImages.uploadError") }));
        throw new Error(errorData.message || t("company.manageImages.uploadError"));
      }

      const uploadData = await uploadResponse.json();
      const imageUrls: string[] = uploadData.images.map((img: { url: string }) => img.url);

      // Step 2: Associate Cloudinary URLs with the itinerary
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const associateResponse = await fetch(`${apiBase}/api/itineraries/${itinerary.id}/cloudinary-images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrls }),
      });

      if (!associateResponse.ok) {
        // Fallback: try creating via the itinerary service directly
        // The backend's createItinerary already handles imageUrls, but for adding
        // images to existing itineraries we might need a different approach.
        // Let's use the same pattern: upload to cloudinary, then add via service.
        throw new Error(t("company.manageImages.uploadError"));
      }

      toast.success(t("company.manageImages.uploadSuccess"));
      setImages([]);

      // Reload itinerary to show new images
      const allItineraries = await fetchItineraries(token, { includeBlobs: true });
      const updated = allItineraries.find((item) => String(item.id) === String(id));
      if (updated) {
        setItinerary(updated);
      }
    } catch (uploadError) {
      const errorMsg =
        uploadError instanceof Error ? uploadError.message : t("company.manageImages.uploadError");
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const existingImages = itinerary?.imageUrls?.length
    ? itinerary.imageUrls
    : itinerary?.imageUrl
      ? [itinerary.imageUrl]
      : [];

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-8">
        <div className="mx-auto w-[95%] max-w-4xl space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-5 w-36 bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-8 w-80 bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-4 w-64 bg-slate-200/60 dark:bg-slate-800/60" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-40 bg-slate-200 dark:bg-slate-800" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-8">
        <div className="mx-auto w-[95%] max-w-4xl space-y-6">
          <button
            onClick={() => navigate("/company/itineraries")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("company.manageImages.backToItineraries")}
          </button>
          <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-8 text-center">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="mx-auto w-[95%] max-w-4xl space-y-8">
        {/* Header */}
        <header className="space-y-4">
          <button
            onClick={() => navigate("/company/itineraries")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("company.manageImages.backToItineraries")}
          </button>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-linear-to-br from-indigo-400 to-indigo-600 p-3 shadow-lg">
              <Images className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {itinerary.title}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t("company.manageImages.subtitle")}
              </p>
            </div>
          </div>
        </header>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* Upload Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg">
            <div className="border-b border-slate-200 dark:border-slate-800 bg-linear-to-b from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-500 p-2">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {t("company.manageImages.uploadTitle")}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {t("company.manageImages.uploadSubtitle")}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ImageUpload
                images={images}
                onImagesChange={setImages}
                maxImages={10}
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Upload Button */}
          {images.length > 0 && (
            <button
              type="submit"
              disabled={isUploading}
              className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-b from-emerald-500 to-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t("company.manageImages.uploading")}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 transition-transform group-hover:scale-110" />
                  {t("company.manageImages.uploadButton")} ({images.length})
                </>
              )}
            </button>
          )}
        </form>

        {/* Current Images */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg">
          <div className="border-b border-slate-200 dark:border-slate-800 bg-linear-to-b from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500 p-2">
                  <ImageIcon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t("company.manageImages.currentImages")}
                </h2>
              </div>
              {existingImages.length > 0 && (
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {existingImages.length} {t("company.manageImages.photoCount")}
                </span>
              )}
            </div>
          </div>
          <div className="p-6">
            {existingImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {existingImages.map((imageUrl, index) => (
                  <div
                    key={`existing-${imageUrl}-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-200"
                  >
                    <img
                      src={imageUrl}
                      alt={`${itinerary.title} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-4">
                  <ImageIcon className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-base font-medium text-slate-700 dark:text-slate-300">
                  {t("company.manageImages.noImages")}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t("company.manageImages.noImagesHint")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyItineraryImagesPage;
