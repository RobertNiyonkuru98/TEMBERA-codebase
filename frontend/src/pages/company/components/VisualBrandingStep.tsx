import { useState } from "react";
import { ImageIcon, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "../../../i18n";
import { ImageUpload } from "../../../components/ImageUpload";
import type { StepProps } from "./types";

interface VisualBrandingStepProps extends StepProps {
  token: string;
}

export function VisualBrandingStep({ formData, updateFormData, token }: VisualBrandingStepProps) {
  const { t } = useI18n();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formDataUpload = new FormData();
    formDataUpload.append("images", file);

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataUpload,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.data.imageUrls[0];
  };

  const handleLogoUpload = async () => {
    if (formData.logoImages.length === 0 || !formData.logoImages[0].file) return;

    try {
      setUploadingLogo(true);
      const url = await uploadToCloudinary(formData.logoImages[0].file);
      updateFormData({ logoUrl: url });
      toast.success(t("admin.createCompany.companyLogo") + " " + t("admin.createCompany.uploadSuccess"));
    } catch (error) {
      toast.error("Failed to upload logo");
      console.error(error);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCoverUpload = async () => {
    if (formData.coverImages.length === 0 || !formData.coverImages[0].file) return;

    try {
      setUploadingCover(true);
      const url = await uploadToCloudinary(formData.coverImages[0].file);
      updateFormData({ coverUrl: url });
      toast.success(t("admin.createCompany.coverImage") + " " + t("admin.createCompany.uploadSuccess"));
    } catch (error) {
      toast.error("Failed to upload cover image");
      console.error(error);
    } finally {
      setUploadingCover(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg">
          <ImageIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {t("admin.createCompany.visualBranding")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("admin.createCompany.visualBrandingDesc")}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Logo */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t("admin.createCompany.companyLogo")}
          </label>
          <ImageUpload
            images={formData.logoImages}
            onImagesChange={(images) => updateFormData({ logoImages: images })}
            maxImages={1}
          />
          {formData.logoImages.length > 0 && !formData.logoUrl && (
            <button
              type="button"
              onClick={handleLogoUpload}
              disabled={uploadingLogo}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
            >
              {uploadingLogo ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("admin.createCompany.uploading")}
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {t("admin.createCompany.uploadLogo")}
                </>
              )}
            </button>
          )}
          {formData.logoUrl && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              {t("admin.createCompany.companyLogo")} {t("admin.createCompany.uploadSuccess")}
            </div>
          )}
        </div>

        {/* Cover Image */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t("admin.createCompany.coverImage")}
          </label>
          <ImageUpload
            images={formData.coverImages}
            onImagesChange={(images) => updateFormData({ coverImages: images })}
            maxImages={1}
          />
          {formData.coverImages.length > 0 && !formData.coverUrl && (
            <button
              type="button"
              onClick={handleCoverUpload}
              disabled={uploadingCover}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
            >
              {uploadingCover ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("admin.createCompany.uploading")}
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {t("admin.createCompany.uploadCover")}
                </>
              )}
            </button>
          )}
          {formData.coverUrl && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              {t("admin.createCompany.coverImage")} {t("admin.createCompany.uploadSuccess")}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
          <strong className="font-bold">💡 {t("admin.createCompany.uploadTip").split(":")[0]}:</strong> {t("admin.createCompany.uploadTip").split(":").slice(1).join(":")}
        </p>
      </div>
    </div>
  );
}
