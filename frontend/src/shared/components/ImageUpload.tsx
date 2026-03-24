import { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface UploadedImage {
  url: string;
  publicId: string;
  file?: File;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    const newImages: UploadedImage[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      publicId: "", // Will be set after upload
      file,
    }));

    onImagesChange([...images, ...newImages]);
  }, [images, onImagesChange]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (files.length + images.length > maxImages) {
        toast.error(`You can only upload up to ${maxImages} images`);
        return;
      }

      handleFiles(files);
    },
    [disabled, images.length, maxImages, handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const files = Array.from(e.target.files || []).filter((file) =>
        file.type.startsWith("image/")
      );

      if (files.length + images.length > maxImages) {
        toast.error(`You can only upload up to ${maxImages} images`);
        return;
      }

      handleFiles(files);
      e.target.value = ""; // Reset input
    },
    [disabled, images.length, maxImages, handleFiles]
  );

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative rounded-2xl border-2 border-dashed transition-all duration-200
          ${
            isDragging
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 scale-[1.02]"
              : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-600"}
        `}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          id="image-upload-input"
        />
        
        <div className="flex flex-col items-center justify-center gap-4 p-12">
          <div className={`rounded-full p-4 transition-colors ${
            isDragging 
              ? "bg-emerald-100 dark:bg-emerald-900/40" 
              : "bg-slate-200 dark:bg-slate-800"
          }`}>
            <Upload className={`h-10 w-10 transition-colors ${
              isDragging 
                ? "text-emerald-600 dark:text-emerald-400" 
                : "text-slate-500 dark:text-slate-400"
            }`} />
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
              Choose files or drag and drop
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              PNG, JPG, GIF up to 10MB each
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {images.length} / {maxImages} images uploaded
            </p>
          </div>

          {!disabled && (
            <label
              htmlFor="image-upload-input"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-105 cursor-pointer"
            >
              <ImageIcon className="h-4 w-4" />
              Browse Files
            </label>
          )}
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-200"
            >
              <img
                src={image.url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200" />
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                disabled={disabled}
                className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Image Number Badge */}
              <div className="absolute bottom-2 left-2 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
