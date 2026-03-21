import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { useI18n } from "../i18n";
import { createCompany } from "../api/platformApi";
import { BasicInfoStep } from "./company/components/BasicInfoStep";
import { VisualBrandingStep } from "./company/components/VisualBrandingStep";
import { LocationContactStep } from "./company/components/LocationContactStep";
import { BusinessDetailsStep } from "./company/components/BusinessDetailsStep";
import { OperationalOnlineStep } from "./company/components/OperationalOnlineStep";
import { AdditionalInfoStep } from "./company/components/AdditionalInfoStep";
import type { CompanyFormData } from "./company/components/types";
import { Building2, ChevronLeft, ChevronRight, Check, X, Loader2 } from "lucide-react";

function AdminCreateCompanyPage() {
  const { token, user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    tagline: "",
    description: "",
    ownerId: user ? String(user.id) : "",
    logoImages: [],
    coverImages: [],
    logoUrl: "",
    coverUrl: "",
    address: "",
    city: "",
    country: "Rwanda",
    email: "",
    phone: "",
    specializations: [],
    languages: [],
    operatingDays: "",
    operatingHours: "",
    website: "",
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    insuranceInfo: "",
    emergencyPhone: "",
    supportingDocs: [],
    docUrls: [],
  });

  const updateFormData = (data: Partial<CompanyFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const steps = [
    { title: t("admin.createCompany.basicInfo"), desc: t("admin.createCompany.basicInfoDesc"), component: BasicInfoStep },
    { title: t("admin.createCompany.branding"), desc: t("admin.createCompany.brandingDesc"), component: VisualBrandingStep },
    { title: t("admin.createCompany.locationContact"), desc: t("admin.createCompany.locationContactDesc"), component: LocationContactStep },
    { title: t("admin.createCompany.businessDetails"), desc: t("admin.createCompany.businessDetailsDesc"), component: BusinessDetailsStep },
    { title: t("admin.createCompany.operational"), desc: t("admin.createCompany.operationalDesc"), component: OperationalOnlineStep },
    { title: t("admin.createCompany.additionalInfo"), desc: t("admin.createCompany.additionalInfoDesc"), component: AdditionalInfoStep },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const canGoNext = () => {
    if (currentStep === 0) {
      return formData.name.trim() && formData.ownerId.trim();
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!token) {
      toast.error("You must be logged in to create a company.");
      return;
    }

    if (!formData.name.trim() || !formData.ownerId.trim()) {
      toast.error("Company name and owner ID are required.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createCompany(token, {
        name: formData.name.trim(),
        tagline: formData.tagline.trim() || undefined,
        description: formData.description.trim() || undefined,
        logo_url: formData.logoUrl || undefined,
        cover_image_url: formData.coverUrl || undefined,
        address: formData.address.trim() || undefined,
        city: formData.city.trim() || undefined,
        country: formData.country || undefined,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        specializations: formData.specializations.length > 0 ? formData.specializations : undefined,
        languages: formData.languages.length > 0 ? formData.languages : undefined,
        operating_days: formData.operatingDays.trim() || undefined,
        operating_hours: formData.operatingHours.trim() || undefined,
        website: formData.website.trim() || undefined,
        facebook_url: formData.facebookUrl.trim() || undefined,
        instagram_url: formData.instagramUrl.trim() || undefined,
        twitter_url: formData.twitterUrl.trim() || undefined,
        insurance_info: formData.insuranceInfo.trim() || undefined,
        emergency_phone: formData.emergencyPhone.trim() || undefined,
        supporting_docs: formData.docUrls.length > 0 ? formData.docUrls : undefined,
        owner_id: formData.ownerId.trim(),
      });

      toast.success("Company created successfully!");
      navigate("/admin/companies", { replace: true });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to create company";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {t("admin.createCompany.title")}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t("admin.createCompany.step")} {currentStep + 1} {t("admin.createCompany.of")} {steps.length}
            </p>
          </div>
        </div>

        <Link
          to="/admin/companies"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
          {t("admin.createCompany.cancel")}
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-1 text-center ${
                index < steps.length - 1 ? "mr-2" : ""
              }`}
            >
              <div
                className={`text-xs font-semibold mb-1 transition-colors ${
                  index === currentStep
                    ? "text-emerald-600 dark:text-emerald-400"
                    : index < currentStep
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {step.title}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2.5 flex-1 rounded-full transition-all shadow-sm ${
                index < currentStep
                  ? "bg-emerald-600 dark:bg-emerald-400"
                  : index === currentStep
                  ? "bg-emerald-500 dark:bg-emerald-500"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <CurrentStepComponent
          formData={formData}
          updateFormData={updateFormData}
          token={token || ""}
          isAdmin={true}
          currentUserId={user?.id ? String(user.id) : ""}
          currentUserName={user?.name || ""}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("admin.createCompany.back")}
        </button>

        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext()}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
          >
            {t("admin.createCompany.next")}
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canGoNext() || isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("admin.createCompany.creating")}
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                {t("admin.createCompany.createButton")}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default AdminCreateCompanyPage;
