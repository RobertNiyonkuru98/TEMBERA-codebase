import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { useI18n } from "../i18n";
import { createCompany } from "../api/platformApi";
import { Building2, FileText, Phone, Loader2, AlertCircle, Sparkles } from "lucide-react";

function CompanyRegisterPage() {
  const { token, user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token || !user) {
      toast.error(t("company.register.loginRequired"));
      return;
    }

    if (!name.trim()) {
      toast.error(t("company.register.nameRequired"));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await createCompany(token, {
        name: name.trim(),
        description: description.trim() || undefined,
        contact: contact.trim() || undefined,
        owner_id: String(user.id),
      });
      toast.success(t("company.register.success"));
      navigate("/company/itineraries/create", { replace: true });
    } catch (submitError) {
      const errorMsg =
        submitError instanceof Error
          ? submitError.message
          : "Failed to register company";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="mx-auto w-[95%] max-w-3xl space-y-8">
        {/* Header */}
        <header className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-2xl bg-linear-to-br from-emerald-400 to-emerald-600 p-4 shadow-lg">
              <Building2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t("company.register.title")}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {t("company.register.subtitle")}
          </p>
        </header>

        {/* Info Banner */}
        <section className="overflow-hidden rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shadow-lg">
          <div className="flex items-start gap-4 p-6">
            <div className="rounded-xl bg-amber-100 dark:bg-amber-900/30 p-3">
              <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-900 dark:text-amber-100">
                {t("company.register.setupRequired")}
              </p>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                {t("company.register.setupMessage")}
              </p>
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg">
            <div className="border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-500 p-2">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t("company.register.companyName")}
                </h2>
              </div>
            </div>
            <div className="p-6">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder={t("company.register.companyNamePlaceholder")}
                required
              />
            </div>
          </div>

          {/* Contact Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg">
            <div className="border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-500 p-2">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t("company.register.contact")}
                </h2>
              </div>
            </div>
            <div className="p-6">
              <input
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder={t("company.register.contactPlaceholder")}
              />
            </div>
          </div>

          {/* Description Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg">
            <div className="border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500 p-2">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t("company.register.description")}
                </h2>
              </div>
            </div>
            <div className="p-6">
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none"
                placeholder={t("company.register.descriptionPlaceholder")}
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
            className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t("company.register.creating")}
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 transition-transform group-hover:scale-110" />
                {t("company.register.createButton")}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompanyRegisterPage;
