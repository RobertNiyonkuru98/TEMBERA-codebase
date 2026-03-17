import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { fetchItineraries, uploadItineraryImages } from "../api/platformApi";
import type { Itinerary } from "../types";

function CompanyItineraryImagesPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
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
          throw new Error("Itinerary not found");
        }
        setItinerary(found);
      } catch (loadError) {
        const errorMsg =
          loadError instanceof Error ? loadError.message : "Failed to load itinerary";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }

    void loadItinerary();
  }, [token, id]);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      toast.warning("Some files were not images and were skipped");
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);

    // Create preview URLs
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removePreview = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    if (!token || !itinerary) {
      toast.error("Missing required information");
      return;
    }

    try {
      setIsUploading(true);
      await uploadItineraryImages(token, String(itinerary.id), selectedFiles);

      toast.success("Images uploaded successfully!");
      setSelectedFiles([]);
      setPreviewUrls([]);

      // Reload itinerary to show new images
      const itineraries = await fetchItineraries(token, { includeBlobs: true });
      const updated = itineraries.find((item) => String(item.id) === String(id));
      if (updated) {
        setItinerary(updated);
      }
    } catch (uploadError) {
      const errorMsg =
        uploadError instanceof Error ? uploadError.message : "Failed to upload images";
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-slate-300">Loading itinerary...</p>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-300">{error}</p>
        <button
          onClick={() => navigate("/company/itineraries")}
          className="rounded-md bg-slate-700 px-3 py-2 text-sm text-slate-100 hover:bg-slate-600"
        >
          Back to Itineraries
        </button>
      </div>
    );
  }

  if (!itinerary) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="space-y-2">
        <button
          onClick={() => navigate("/company/itineraries")}
          className="text-sm text-emerald-400 hover:underline"
        >
          ← Back to Itineraries
        </button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            {itinerary.title} - Manage Images
          </h1>
          <p className="text-sm text-slate-300">
            Add and manage images for your itinerary
          </p>
        </div>
      </header>

      <form onSubmit={handleUpload} className="space-y-6">
        {/* File Input */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <label className="space-y-2">
            <span className="block text-sm font-medium text-slate-200">
              Select Images to Upload
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-500 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-emerald-400 disabled:opacity-50"
            />
            <p className="text-xs text-slate-400">
              Supported formats: JPG, PNG, WebP, GIF (Max 10MB per file)
            </p>
          </label>
        </div>

        {/* Preview Grid */}
        {previewUrls.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-200">
              Preview ({previewUrls.length} image{previewUrls.length !== 1 ? "s" : ""})
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {previewUrls.map((url, index) => (
                <div key={url} className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="aspect-square w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePreview(index)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <span className="rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                      Remove
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        {previewUrls.length > 0 && (
          <button
            type="submit"
            disabled={isUploading}
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isUploading ? "Uploading..." : `Upload ${previewUrls.length} Image${previewUrls.length !== 1 ? "s" : ""}`}
          </button>
        )}
      </form>

      {/* Current Images Section */}
      {(itinerary.imageUrls?.length || itinerary.imageUrl) && (
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-sm font-medium text-slate-200">Current Images</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {(itinerary.imageUrls?.length ? itinerary.imageUrls : itinerary.imageUrl ? [itinerary.imageUrl] : []).map((imageUrl, index) => (
              <div key={`${imageUrl}-${index}`} className="overflow-hidden rounded-lg border border-slate-700">
                <img
                  src={imageUrl}
                  alt={`${itinerary.title} ${index + 1}`}
                  className="aspect-square w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {!itinerary.imageUrl && (!itinerary.imageUrls || itinerary.imageUrls.length === 0) && previewUrls.length === 0 && (
        <div className="rounded-xl border border-amber-900 bg-amber-950/30 p-4 text-sm text-amber-100">
          <p>No images uploaded yet. Start by selecting images above.</p>
        </div>
      )}
    </div>
  );
}

export default CompanyItineraryImagesPage;
