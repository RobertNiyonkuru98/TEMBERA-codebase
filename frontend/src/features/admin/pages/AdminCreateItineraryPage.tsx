import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthContext";
import { createItinerary, fetchCompanies } from "@/core/api";
import type { Company } from "@/shared/types";
import { Loader2, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import {
  BasicInfoStep,
  DurationScheduleStep,
  CapacityBookingStep,
  InclusionsStep,
  FoodMealsStep,
  TransportStep,
  LocationDetailsStep,
  RequirementsStep,
  PricingPaymentStep,
  SafetyAdditionalStep,
  MediaUploadStep,
  ReviewSubmitStep,
  INITIAL_FORM_DATA,
  type ItineraryFormData,
} from "@/features/itineraries/components";

const STEPS = [
  { id: 1, name: "Basic Info", component: BasicInfoStep },
  { id: 2, name: "Duration", component: DurationScheduleStep },
  { id: 3, name: "Capacity", component: CapacityBookingStep },
  { id: 4, name: "Inclusions", component: InclusionsStep },
  { id: 5, name: "Food & Meals", component: FoodMealsStep },
  { id: 6, name: "Transport", component: TransportStep },
  { id: 7, name: "Location", component: LocationDetailsStep },
  { id: 8, name: "Requirements", component: RequirementsStep },
  { id: 9, name: "Pricing", component: PricingPaymentStep },
  { id: 10, name: "Safety", component: SafetyAdditionalStep },
  { id: 11, name: "Media", component: MediaUploadStep },
  { id: 12, name: "Review", component: ReviewSubmitStep },
];

function AdminCreateItineraryPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ItineraryFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = (updates: Partial<ItineraryFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    async function loadCompanies() {
      if (!token) {
        setIsLoadingCompanies(false);
        return;
      }

      try {
        setIsLoadingCompanies(true);
        setError(null);
        const allCompanies = await fetchCompanies(token);
        setCompanies(allCompanies);
        if (allCompanies.length > 0) {
          setSelectedCompanyId(String(allCompanies[0].id));
        }
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load companies",
        );
      } finally {
        setIsLoadingCompanies(false);
      }
    }

    void loadCompanies();
  }, [token]);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!token) {
      toast.error("You must be logged in");
      return;
    }

    if (!selectedCompanyId) {
      toast.error("Please select a company");
      return;
    }

    if (!formData.title || !formData.date || formData.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let imageUrls: string[] = [];
      if (formData.images.length > 0 && formData.images.some(img => img.file)) {
        const uploadFormData = new FormData();
        formData.images.forEach((img) => {
          if (img.file) {
            uploadFormData.append("images", img.file);
          }
        });

        try {
          const uploadUrl = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/api/upload/images`;
          const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: uploadFormData,
          });

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            imageUrls = uploadData.images.map((img: { url: string }) => img.url);
          }
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
        }
      }

      await createItinerary(token, {
        company_id: selectedCompanyId,
        title: formData.title,
        activity: formData.activity || undefined,
        description: formData.description || undefined,
        location: formData.location || undefined,
        date: formData.date,
        price: formData.price,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        duration_days: formData.durationDays,
        duration_hours: formData.durationHours,
        start_time: formData.startTime || undefined,
        end_time: formData.endTime || undefined,
        is_multi_day: formData.isMultiDay,
        schedule_details: formData.scheduleDetails || undefined,
        min_participants: formData.minParticipants,
        max_participants: formData.maxParticipants,
        available_slots: formData.availableSlots,
        allows_individuals: formData.allowsIndividuals,
        allows_groups: formData.allowsGroups,
        group_discount_percent: formData.groupDiscountPercent,
        group_min_size: formData.groupMinSize,
        booking_deadline: formData.bookingDeadline || undefined,
        inclusions: formData.inclusions,
        exclusions: formData.exclusions,
        provided_equipment: formData.providedEquipment,
        required_items: formData.requiredItems,
        meals_included: formData.mealsIncluded,
        meal_types: formData.mealTypes,
        food_options: formData.foodOptions || undefined,
        can_buy_food_onsite: formData.canBuyFoodOnsite,
        can_bring_own_food: formData.canBringOwnFood,
        dietary_accommodations: formData.dietaryAccommodations || undefined,
        transport_included: formData.transportIncluded,
        transport_type: formData.transportType || undefined,
        pickup_locations: formData.pickupLocations,
        dropoff_locations: formData.dropoffLocations,
        allows_own_transport: formData.allowsOwnTransport,
        parking_available: formData.parkingAvailable,
        transport_notes: formData.transportNotes || undefined,
        meeting_point: formData.meetingPoint || undefined,
        meeting_point_lat: formData.meetingPointLat,
        meeting_point_lng: formData.meetingPointLng,
        end_point: formData.endPoint || undefined,
        end_point_lat: formData.endPointLat,
        end_point_lng: formData.endPointLng,
        location_details: formData.locationDetails || undefined,
        difficulty_level: formData.difficultyLevel || undefined,
        fitness_level_required: formData.fitnessLevelRequired || undefined,
        min_age: formData.minAge,
        max_age: formData.maxAge,
        age_restrictions_notes: formData.ageRestrictionsNotes || undefined,
        accessibility_info: formData.accessibilityInfo || undefined,
        price_per_person: formData.pricePerPerson,
        price_per_group: formData.pricePerGroup,
        deposit_required: formData.depositRequired,
        deposit_percentage: formData.depositPercentage,
        payment_methods: formData.paymentMethods,
        currency: formData.currency,
        refund_policy: formData.refundPolicy || undefined,
        cancellation_policy: formData.cancellationPolicy || undefined,
        insurance_included: formData.insuranceIncluded,
        insurance_details: formData.insuranceDetails || undefined,
        safety_measures: formData.safetyMeasures,
        emergency_procedures: formData.emergencyProcedures || undefined,
        medical_requirements: formData.medicalRequirements || undefined,
        languages_offered: formData.languagesOffered,
        guide_info: formData.guideInfo || undefined,
        weather_dependency: formData.weatherDependency,
        weather_notes: formData.weatherNotes || undefined,
        what_to_wear: formData.whatToWear || undefined,
        additional_notes: formData.additionalNotes || undefined,
        terms_and_conditions: formData.termsAndConditions || undefined,
        status: formData.status,
        is_featured: formData.isFeatured,
        is_active: formData.isActive,
        tags: formData.tags,
        category: formData.category || undefined,
      });
      
      toast.success("Itinerary created successfully!");
      navigate("/admin/itineraries", { replace: true });
    } catch (submitError) {
      const errorMsg = submitError instanceof Error ? submitError.message : "Failed to create itinerary";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCompanies) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
          <p className="text-sm text-slate-400">Loading companies...</p>
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-8">
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 p-8">
          <div className="flex items-start gap-4">
            <Building2 className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            <div>
              <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                No Companies Available
              </h1>
              <p className="text-sm text-amber-800 dark:text-amber-200 mb-4">
                You need to create a company before creating itineraries.
              </p>
              <Link
                to="/admin/companies"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-emerald-600"
              >
                <Building2 className="h-4 w-4" />
                Go to Companies
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="mx-auto w-[95%] max-w-5xl space-y-8">
        {/* Header */}
        <header className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              Create New Itinerary (Admin)
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Step {currentStep} of {STEPS.length}
            </p>
          </div>

          {/* Company Selector */}
          <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
              <Building2 className="inline h-4 w-4 mr-1" />
              Select Company
            </label>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            >
              {companies.map((company) => (
                <option key={company.id} value={String(company.id)}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-1">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`h-2 flex-1 rounded-full transition-all ${
                  step.id <= currentStep
                    ? "bg-emerald-600"
                    : "bg-slate-200 dark:bg-slate-800"
                }`}
              />
            ))}
          </div>

          {/* Step Names */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {STEPS.map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  step.id === currentStep
                    ? "bg-emerald-600 text-white"
                    : step.id < currentStep
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {step.name}
              </button>
            ))}
          </div>
        </header>

        {/* Form Content */}
        <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 shadow-lg">
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
            token={token || ""}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold transition-colors hover:border-slate-300 dark:hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
            Previous
          </button>

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-lg"
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Itinerary"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCreateItineraryPage;
