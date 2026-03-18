import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { useI18n } from "../i18n";
import { createItinerary, fetchCompanies } from "../api/platformApi";
import type { Company } from "../types";
import { ImageUpload } from "../components/ImageUpload";
import { 
  Calendar, 
  MapPin, 
  FileText, 
  DollarSign, 
  Loader2, 
  Building2, 
  Sparkles,
  Activity,
  AlertCircle,
  Image as ImageIcon
} from "lucide-react";

function CompanyCreateItineraryPage() {
  const { token, user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [company, setCompany] = useState<Company | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);

  const [title, setTitle] = useState("");
  const [activity, setActivity] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<Array<{ url: string; publicId: string; file?: File }>>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMyCompany() {
      if (!token || !user) {
        setIsLoadingCompany(false);
        return;
      }

      try {
        setIsLoadingCompany(true);
        setError(null);

        const allCompanies = await fetchCompanies(token);
        const ownedCompany =
          allCompanies.find((item) => String(item.ownerId) === String(user.id)) ?? null;

        setCompany(ownedCompany);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load company",
        );
      } finally {
        setIsLoadingCompany(false);
      }
    }

    void loadMyCompany();
  }, [token, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token || !company) {
      toast.error(t("company.createItinerary.noCompany"));
      return;
    }

    if (!title.trim() || !date || !price.trim()) {
      toast.error(t("company.createItinerary.requiredFields"));
      return;
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      toast.error(t("company.createItinerary.invalidPrice"));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // First, upload images if any
      let imageUrls: string[] = [];
      if (images.length > 0 && images.some(img => img.file)) {
        const formData = new FormData();
        images.forEach((img) => {
          if (img.file) {
            formData.append("images", img.file);
          }
        });

        try {
          const uploadUrl = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/api/upload/images`;
          const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({ message: "Upload failed" }));
            throw new Error(errorData.message || "Failed to upload images");
          }

          const uploadData = await uploadResponse.json();
          imageUrls = uploadData.images.map((img: { url: string }) => img.url);
        } catch (uploadError) {
          toast.error(uploadError instanceof Error ? uploadError.message : "Failed to upload images. Please try again.");
          throw uploadError;
        }
      }

      await createItinerary(token, {
        company_id: String(company.id),
        title: title.trim(),
        activity: activity.trim() || undefined,
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        date,
        price: numericPrice,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      });
      toast.success(t("company.createItinerary.success"));
      navigate("/company/itineraries", { replace: true });
    } catch (submitError) {
      const errorMsg =
        submitError instanceof Error
          ? submitError.message
          : "Failed to create itinerary";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCompany) {
    return (
      <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading company profile...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="overflow-hidden rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-linear-to-b from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shadow-lg">
            <div className="flex items-start gap-4 p-8">
              <div className="rounded-xl bg-amber-100 dark:bg-amber-900/30 p-3">
                <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                  {t("company.createItinerary.companyRequired")}
                </h1>
                <p className="text-sm text-amber-800 dark:text-amber-200 mb-4">
                  {t("company.createItinerary.companyRequiredMessage")}
                </p>
                <Link
                  to="/company/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-emerald-600 hover:shadow-xl"
                >
                  <Building2 className="h-4 w-4" />
                  {t("company.createItinerary.createCompany")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="mx-auto w-[95%] max-w-4xl space-y-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-linear-to-br from-emerald-400 to-emerald-600 p-3 shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t("company.createItinerary.title")}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">{company.name}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("company.createItinerary.subtitle")}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg">
            <div className="border-b border-slate-200 dark:border-slate-800 bg-linear-to-b from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-500 p-2">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t("company.createItinerary.itineraryTitle")}
                </h2>
              </div>
            </div>
            <div className="p-6">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder={t("company.createItinerary.titlePlaceholder")}
                required
              />
            </div>
          </div>

          {/* Activity & Location Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg">
            <div className="border-b border-slate-200 dark:border-slate-800 bg-linear-to-b from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-500 p-2">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t("company.createItinerary.details")}
                </h2>
              </div>
            </div>
            <div className="p-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t("company.createItinerary.activity")}
                </label>
                <input
                  value={activity}
                  onChange={(event) => setActivity(event.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder={t("company.createItinerary.activityPlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t("company.createItinerary.location")}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    placeholder={t("company.createItinerary.locationPlaceholder")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date & Price Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg">
            <div className="border-b border-slate-200 dark:border-slate-800 bg-linear-to-b from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500 p-2">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t("company.createItinerary.schedule")}
                </h2>
              </div>
            </div>
            <div className="p-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t("company.createItinerary.date")} *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t("company.createItinerary.price")} (RWF) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    placeholder="50000"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Images Upload Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg">
            <div className="border-b border-slate-200 dark:border-slate-800 bg-linear-to-b from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-500 p-2">
                  <ImageIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Experience Images
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Upload photos to showcase your experience (optional)
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ImageUpload
                images={images}
                onImagesChange={setImages}
                maxImages={10}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Description Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg">
            <div className="border-b border-slate-200 dark:border-slate-800 bg-linear-to-b from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-500 p-2">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t("company.createItinerary.description")}
                </h2>
              </div>
            </div>
            <div className="p-6">
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none"
                placeholder={t("company.createItinerary.descriptionPlaceholder")}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-b from-emerald-500 to-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t("company.createItinerary.creating")}
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 transition-transform group-hover:scale-110" />
                {t("company.createItinerary.createButton")}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompanyCreateItineraryPage;
