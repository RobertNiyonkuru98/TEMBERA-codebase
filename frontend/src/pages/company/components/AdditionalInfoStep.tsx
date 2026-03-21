import { useState } from "react";
import { Shield, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "../../../i18n";
import { DocumentUpload } from "../../../components/DocumentUpload";
import type { StepProps } from "./types";

interface AdditionalInfoStepProps extends StepProps {
  token: string;
}

export function AdditionalInfoStep({ formData, updateFormData, token }: AdditionalInfoStepProps) {
  const { t } = useI18n();
  const [uploadingDocs, setUploadingDocs] = useState(false);

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
      throw new Error("Failed to upload document");
    }

    const data = await response.json();
    return data.data.imageUrls[0];
  };

  const handleDocsUpload = async () => {
    if (formData.supportingDocs.length === 0) return;

    try {
      setUploadingDocs(true);
      const urls: string[] = [];

      for (const doc of formData.supportingDocs) {
        if (doc.file) {
          const url = await uploadToCloudinary(doc.file);
          urls.push(url);
        }
      }

      updateFormData({ docUrls: urls });
      toast.success(`${urls.length} ${t("admin.createCompany.docsUploaded")}`);
    } catch (error) {
      toast.error("Failed to upload documents");
      console.error(error);
    } finally {
      setUploadingDocs(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {t("admin.createCompany.additionalInfo")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("admin.createCompany.additionalInfoDesc")}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <label className="space-y-2 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {t("admin.createCompany.insurance")}
          </span>
          <textarea
            value={formData.insuranceInfo}
            onChange={(e) => updateFormData({ insuranceInfo: e.target.value })}
            rows={4}
            className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 transition-all resize-none"
            placeholder={t("admin.createCompany.insurancePlaceholder")}
            maxLength={500}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {formData.insuranceInfo.length}/500 {t("admin.createCompany.charactersCount")}
          </p>
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {t("admin.createCompany.emergencyContact")}
          </span>
          <input
            type="tel"
            value={formData.emergencyPhone}
            onChange={(e) => updateFormData({ emergencyPhone: e.target.value })}
            className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 transition-all"
            placeholder={t("admin.createCompany.emergencyContactPlaceholder")}
          />
        </label>

        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t("admin.createCompany.supportingDocs")}
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("admin.createCompany.supportingDocsHint")}
          </p>
          <DocumentUpload
            documents={formData.supportingDocs}
            onDocumentsChange={(docs) => updateFormData({ supportingDocs: docs })}
            maxDocuments={5}
            acceptedTypes=".pdf,.doc,.docx,.xls,.xlsx,.txt"
          />
          {formData.supportingDocs.length > 0 && formData.docUrls.length === 0 && (
            <button
              type="button"
              onClick={handleDocsUpload}
              disabled={uploadingDocs}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
            >
              {uploadingDocs ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("admin.createCompany.uploadingDocs")}
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {t("admin.createCompany.uploadDocs")}
                </>
              )}
            </button>
          )}
          {formData.docUrls.length > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              {formData.docUrls.length} {t("admin.createCompany.docsUploaded")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
