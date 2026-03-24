import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import {
  fetchBookingItems,
  fetchCompanies,
  fetchItineraryById,
} from "@/core/api";
import { Card, CardContent } from "@/shared/components/ui";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/shared/components/ui";
import { Skeleton } from "@/shared/components/ui";
import type { BookingItem, Company, Itinerary } from "@/shared/types";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Building2,
  Users,
  ImageIcon,
  Images,
  Clock,
  Star,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Utensils,
  Shield,
  Info,
  AlertCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { EditBasicInfoModal } from "@/features/itineraries/components/itinerary-modals/EditBasicInfoModal";
import { EditPricingPoliciesModal } from "@/features/itineraries/components/itinerary-modals/EditPricingPoliciesModal";
import { EditMealsTransportModal } from "@/features/itineraries/components/itinerary-modals/EditMealsTransportModal";
import { EditRequirementsInfoModal } from "@/features/itineraries/components/itinerary-modals/EditRequirementsInfoModal";
import { EditScheduleLogisticsModal } from "@/features/itineraries/components/itinerary-modals/EditScheduleLogisticsModal";
import { EditAdditionalInfoModal } from "@/features/itineraries/components/itinerary-modals/EditAdditionalInfoModal";
import { ConfirmationModal } from "@/shared/components/ui";
import { deleteItinerary } from "@/core/api";
import { toast } from "sonner";

function CompanyItineraryDetailPage() {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [company, setCompany] = useState<Company | undefined>(undefined);
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  const [refreshKey, setRefreshKey] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal States
  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isMealsTransportOpen, setIsMealsTransportOpen] = useState(false);
  const [isRequirementsOpen, setIsRequirementsOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isAdditionalInfoOpen, setIsAdditionalInfoOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!token || !id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [fetchedItinerary, companies, allBookingItems] =
          await Promise.all([
            fetchItineraryById(token, id),
            fetchCompanies(token),
            fetchBookingItems(token),
          ]);

        setItinerary(fetchedItinerary);
        setCompany(
          companies.find(
            (c) => String(c.id) === String(fetchedItinerary.companyId),
          ),
        );
        setBookingItems(
          allBookingItems.filter(
            (item) => String(item.itineraryId) === String(fetchedItinerary.id),
          ),
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load itinerary details",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, [id, token, refreshKey]);

  const handleDelete = async () => {
    if (!token || !itinerary) return;

    try {
      setIsDeleting(true);
      await deleteItinerary(token, String(itinerary.id));
      toast.success("Itinerary deleted successfully");
      setIsDeleteDialogOpen(false);
      navigate("/company/itineraries");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete itinerary");
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    if (!carouselApi) return;

    const updateCounts = () => {
      setSlideCount(carouselApi.scrollSnapList().length);
      setCurrentSlide(carouselApi.selectedScrollSnap() + 1);
    };

    updateCounts();
    carouselApi.on("select", updateCounts);

    return () => {
      carouselApi.off("select", updateCounts);
    };
  }, [carouselApi]);

  const images = useMemo(() => {
    if (!itinerary) return [];
    return itinerary.imageUrls?.length
      ? itinerary.imageUrls
      : itinerary.imageUrl
        ? [itinerary.imageUrl]
        : [];
  }, [itinerary]);

  const attendeeCount = bookingItems.length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-40 bg-slate-800" />
        <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
          <div className="space-y-4">
            <Skeleton className="aspect-video w-full rounded-2xl bg-slate-800" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-lg bg-slate-800" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 bg-slate-800" />
            <Skeleton className="h-4 w-full bg-slate-800/60" />
            <Skeleton className="h-4 w-full bg-slate-800/60" />
            <Skeleton className="h-4 w-2/3 bg-slate-800/60" />
            <div className="mt-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl bg-slate-800" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-center">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
          <p className="text-sm text-slate-400">Itinerary not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Itineraries
        </button>
        <div className="flex items-center gap-2">
          <Link
            to={`/company/itinerary/${itinerary.id}/images`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700"
          >
            <Images className="h-4 w-4" />
            Manage Images
          </Link>
          <Link
            to={`/company/itinerary/${itinerary.id}/attendees`}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            <Users className="h-4 w-4" />
            View Attendees
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          {images.length > 0 ? (
            <>
              <Carousel setApi={setCarouselApi} className="w-full">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={`${itinerary.id}-img-${index}`}>
                      <Card className="overflow-hidden border-slate-800 bg-slate-900">
                        <CardContent className="p-0">
                          <img
                            src={image}
                            alt={`${itinerary.title} - Image ${index + 1}`}
                            className="aspect-video w-full object-cover"
                          />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-3 border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800" />
                    <CarouselNext className="right-3 border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800" />
                  </>
                )}
              </Carousel>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-3">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((image, index) => (
                      <button
                        key={`thumb-${index}`}
                        onClick={() => carouselApi?.scrollTo(index)}
                        className={`shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                          currentSlide === index + 1
                            ? "border-emerald-500 ring-1 ring-emerald-500/30"
                            : "border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="h-16 w-16 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  <span className="ml-auto shrink-0 text-xs text-slate-500">
                    {currentSlide} / {slideCount}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/30">
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-slate-600" />
                <p className="mt-3 text-sm text-slate-500">
                  No images uploaded yet
                </p>
                <Link
                  to={`/company/itinerary/${itinerary.id}/images`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <Images className="h-3.5 w-3.5" />
                  Add images
                </Link>
              </div>
            </div>
          )}

          {/* Description section */}
          {itinerary.description && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                Description
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {itinerary.description}
              </p>
            </div>
          )}

          {/* Inclusions & Exclusions */}
          {(itinerary.inclusions?.length || itinerary.exclusions?.length) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {itinerary.inclusions && itinerary.inclusions.length > 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> What's
                    Included
                  </h3>
                  <ul className="space-y-2">
                    {itinerary.inclusions.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-300"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {itinerary.exclusions && itinerary.exclusions.length > 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" /> What's Not
                    Included
                  </h3>
                  <ul className="space-y-2">
                    {itinerary.exclusions.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-300"
                      >
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Meals & Transport */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Utensils className="h-4 w-4 text-emerald-500" /> Meals &
                Transport
              </h3>
              <button
                onClick={() => setIsMealsTransportOpen(true)}
                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                title="Edit Meals & Transport"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Meals */}
              {itinerary.mealsIncluded ||
              itinerary.canBuyFoodOnsite ||
              itinerary.canBringOwnFood ? (
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-slate-200 flex items-center gap-2">
                    Meals
                  </h4>
                  <div className="space-y-3">
                    <p className="text-sm text-slate-300">
                      <span className="font-semibold text-slate-200">
                        Included:
                      </span>{" "}
                      {itinerary.mealsIncluded ? "Yes" : "No"}
                    </p>
                    {itinerary.mealTypes && itinerary.mealTypes.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-slate-200 mb-2">
                          Types:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {itinerary.mealTypes.map((meal, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-1 rounded bg-slate-800 text-xs font-medium text-emerald-400"
                            >
                              {meal}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {itinerary.dietaryAccommodations && (
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-slate-200">
                          Dietary:
                        </span>{" "}
                        {itinerary.dietaryAccommodations}
                      </p>
                    )}
                    {itinerary.foodOptions && (
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-slate-200">
                          Details:
                        </span>{" "}
                        {itinerary.foodOptions}
                      </p>
                    )}
                    {(itinerary.canBringOwnFood ||
                      itinerary.canBuyFoodOnsite) && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {itinerary.canBringOwnFood && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />{" "}
                            Bring own
                          </span>
                        )}
                        {itinerary.canBuyFoodOnsite && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />{" "}
                            Buy onsite
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500 italic">
                  No meal logistics configured.
                </div>
              )}

              {/* Transport */}
              {itinerary.transportIncluded ||
              itinerary.allowsOwnTransport ||
              itinerary.parkingAvailable ? (
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-slate-200 flex items-center gap-2">
                    Transportation
                  </h4>
                  <div className="space-y-3">
                    <p className="text-sm text-slate-300">
                      <span className="font-semibold text-slate-200">
                        Included:
                      </span>{" "}
                      {itinerary.transportIncluded ? "Yes" : "No"}
                    </p>
                    {itinerary.transportType && (
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-slate-200">
                          Type:
                        </span>{" "}
                        {itinerary.transportType}
                      </p>
                    )}
                    {itinerary.pickupLocations &&
                      itinerary.pickupLocations.length > 0 && (
                        <p className="text-sm text-slate-300">
                          <span className="font-semibold text-slate-200">
                            Pickup:
                          </span>{" "}
                          {itinerary.pickupLocations.join(", ")}
                        </p>
                      )}
                    {itinerary.dropoffLocations &&
                      itinerary.dropoffLocations.length > 0 && (
                        <p className="text-sm text-slate-300">
                          <span className="font-semibold text-slate-200">
                            Dropoff:
                          </span>{" "}
                          {itinerary.dropoffLocations.join(", ")}
                        </p>
                      )}
                    {itinerary.transportNotes && (
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-slate-200">
                          Notes:
                        </span>{" "}
                        {itinerary.transportNotes}
                      </p>
                    )}
                    {(itinerary.allowsOwnTransport ||
                      itinerary.parkingAvailable) && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {itinerary.allowsOwnTransport && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                            <CheckCircle2 className="h-3 w-3 text-blue-500" />{" "}
                            Own transport okay
                          </span>
                        )}
                        {itinerary.parkingAvailable && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                            <CheckCircle2 className="h-3 w-3 text-blue-500" />{" "}
                            Parking available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500 italic">
                  No transport logistics configured.
                </div>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" /> Schedule &
                Logistics
              </h3>
              <button
                onClick={() => setIsScheduleOpen(true)}
                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                title="Edit Schedule & Logistics"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            {itinerary.scheduleDetails ||
            itinerary.meetingPoint ||
            itinerary.endPoint ||
            itinerary.locationDetails ? (
              <div className="space-y-4">
                {itinerary.scheduleDetails && (
                  <div>
                    <p className="text-sm font-semibold text-slate-200 mb-1">
                      Schedule
                    </p>
                    <p className="text-sm text-slate-300 whitespace-pre-line">
                      {itinerary.scheduleDetails}
                    </p>
                  </div>
                )}
                {itinerary.meetingPoint && (
                  <div>
                    <p className="text-sm font-semibold text-slate-200 mb-1">
                      Meeting Point
                    </p>
                    <p className="text-sm text-slate-300">
                      {itinerary.meetingPoint}
                    </p>
                    {itinerary.meetingPointLat && itinerary.meetingPointLng && (
                      <p className="text-xs text-slate-500">
                        GPS: {itinerary.meetingPointLat},{" "}
                        {itinerary.meetingPointLng}
                      </p>
                    )}
                  </div>
                )}
                {itinerary.endPoint && (
                  <div>
                    <p className="text-sm font-semibold text-slate-200 mb-1">
                      End Point
                    </p>
                    <p className="text-sm text-slate-300">
                      {itinerary.endPoint}
                    </p>
                  </div>
                )}
                {itinerary.locationDetails && (
                  <div>
                    <p className="text-sm font-semibold text-slate-200 mb-1">
                      Location Notes
                    </p>
                    <p className="text-sm text-slate-300">
                      {itinerary.locationDetails}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic mt-2">
                No schedule or logistics configured.
              </p>
            )}
          </div>

          {/* Requirements & Info */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-500" /> Requirements &
                Safety
              </h3>
              <button
                onClick={() => setIsRequirementsOpen(true)}
                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                title="Edit Requirements & Safety"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {(itinerary.providedEquipment?.length ||
                itinerary.requiredItems?.length) && (
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-slate-200">
                    Equipment
                  </h4>
                  {itinerary.providedEquipment &&
                    itinerary.providedEquipment.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-slate-200 mb-2">
                          Provided:
                        </p>
                        <ul className="space-y-1">
                          {itinerary.providedEquipment.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-slate-300"
                            >
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />{" "}
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  {itinerary.requiredItems &&
                    itinerary.requiredItems.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-slate-200 mb-2">
                          What to Bring:
                        </p>
                        <ul className="space-y-1">
                          {itinerary.requiredItems.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-slate-300"
                            >
                              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />{" "}
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}

              {(itinerary.fitnessLevelRequired ||
                itinerary.minAge ||
                itinerary.accessibilityInfo ||
                itinerary.insuranceIncluded ||
                itinerary.safetyMeasures) && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-200">
                    Participant Rules
                  </h4>
                  {itinerary.fitnessLevelRequired && (
                    <div>
                      <p className="text-sm font-semibold text-slate-200 mb-1">
                        Fitness Level
                      </p>
                      <p className="text-sm text-slate-300">
                        {itinerary.fitnessLevelRequired}
                      </p>
                    </div>
                  )}
                  {(itinerary.minAge || itinerary.maxAge) && (
                    <div>
                      <p className="text-sm font-semibold text-slate-200 mb-1">
                        Age Limits
                      </p>
                      <p className="text-sm text-slate-300">
                        {itinerary.minAge && itinerary.maxAge
                          ? `${itinerary.minAge}-${itinerary.maxAge} years`
                          : itinerary.minAge
                            ? `${itinerary.minAge}+ years`
                            : `Up to ${itinerary.maxAge} years`}
                      </p>
                      {itinerary.ageRestrictionsNotes && (
                        <p className="text-xs text-slate-400 mt-1">
                          {itinerary.ageRestrictionsNotes}
                        </p>
                      )}
                    </div>
                  )}
                  {itinerary.accessibilityInfo && (
                    <div>
                      <p className="text-sm font-semibold text-slate-200 mb-1">
                        Accessibility
                      </p>
                      <p className="text-sm text-slate-300">
                        {itinerary.accessibilityInfo}
                      </p>
                    </div>
                  )}
                  {(itinerary.insuranceIncluded ||
                    itinerary.medicalRequirements ||
                    itinerary.safetyMeasures?.length) && (
                    <div className="pt-2 border-t border-slate-800">
                      {itinerary.insuranceIncluded && (
                        <p className="text-sm text-emerald-400 font-medium flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" /> Insurance
                          Included
                        </p>
                      )}
                      {itinerary.insuranceDetails && (
                        <p className="text-xs text-slate-400 mt-1">
                          {itinerary.insuranceDetails}
                        </p>
                      )}
                      {itinerary.medicalRequirements && (
                        <p className="text-sm text-amber-400 mt-2 font-medium">
                          Medical Req:{" "}
                          <span className="text-slate-300 font-normal">
                            {itinerary.medicalRequirements}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pricing Details */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-500" /> Payment &
                Policies
              </h3>
              <button
                onClick={() => setIsPricingOpen(true)}
                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                title="Edit Pricing & Policies"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            {itinerary.pricePerPerson ||
            itinerary.pricePerGroup ||
            itinerary.depositRequired ||
            itinerary.refundPolicy ||
            itinerary.cancellationPolicy ||
            itinerary.paymentMethods?.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  {(itinerary.pricePerPerson || itinerary.pricePerGroup) && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-slate-200 mb-1">
                        Pricing Tiers
                      </p>
                      {itinerary.pricePerPerson && (
                        <p className="text-sm text-emerald-400">
                          {itinerary.pricePerPerson.toLocaleString()}{" "}
                          {itinerary.currency} / person
                        </p>
                      )}
                      {itinerary.pricePerGroup && (
                        <p className="text-sm text-emerald-400">
                          {itinerary.pricePerGroup.toLocaleString()}{" "}
                          {itinerary.currency} / group
                        </p>
                      )}
                    </div>
                  )}
                  {itinerary.depositRequired && (
                    <div>
                      <p className="text-sm font-semibold text-slate-200 mb-1">
                        Deposit
                      </p>
                      <p className="text-sm text-amber-400">
                        {itinerary.depositRequired.toLocaleString()}{" "}
                        {itinerary.currency}{" "}
                        {itinerary.depositPercentage
                          ? `(${itinerary.depositPercentage}%)`
                          : ""}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  {(itinerary.refundPolicy || itinerary.cancellationPolicy) && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-slate-200 mb-1">
                        Policies
                      </p>
                      {itinerary.refundPolicy && (
                        <p className="text-xs text-slate-300 mb-1">
                          <span className="font-semibold text-slate-400">
                            Refund:
                          </span>{" "}
                          {itinerary.refundPolicy}
                        </p>
                      )}
                      {itinerary.cancellationPolicy && (
                        <p className="text-xs text-slate-300">
                          <span className="font-semibold text-slate-400">
                            Canx:
                          </span>{" "}
                          {itinerary.cancellationPolicy}
                        </p>
                      )}
                    </div>
                  )}
                  {itinerary.paymentMethods &&
                    itinerary.paymentMethods.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-slate-200 mb-1">
                          Payment Methods
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {itinerary.paymentMethods.map((m) => (
                            <span
                              key={m}
                              className="bg-slate-800 text-slate-300 text-[10px] px-2 py-1 rounded uppercase tracking-wider"
                            >
                              {m.replace("_", " ")}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic mt-2">
                No specific pricing tiers or policies configured.
              </p>
            )}
          </div>

          {/* Weather, Guide, Notes */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" /> Additional
                Information
              </h3>
              <button
                onClick={() => setIsAdditionalInfoOpen(true)}
                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                title="Edit Additional Information"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            {itinerary.weatherNotes ||
            itinerary.weatherDependency ||
            itinerary.guideInfo ||
            itinerary.languagesOffered?.length ||
            itinerary.additionalNotes ||
            itinerary.termsAndConditions ? (
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  {(itinerary.guideInfo ||
                    itinerary.languagesOffered?.length) && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-slate-200 mb-1">
                        Guide info
                      </p>
                      {itinerary.guideInfo && (
                        <p className="text-sm text-slate-300 mb-2">
                          {itinerary.guideInfo}
                        </p>
                      )}
                      {itinerary.languagesOffered &&
                        itinerary.languagesOffered.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {itinerary.languagesOffered.map((l) => (
                              <span
                                key={l}
                                className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2 py-0.5 rounded-full"
                              >
                                {l}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                  )}
                  {(itinerary.weatherNotes ||
                    itinerary.weatherDependency ||
                    itinerary.whatToWear) && (
                    <div>
                      <p className="text-sm font-semibold text-slate-200 mb-1">
                        Weather & Prep
                      </p>
                      {itinerary.weatherDependency && (
                        <p className="text-xs text-amber-500 font-medium mb-1">
                          Weather Dependent
                        </p>
                      )}
                      {itinerary.weatherNotes && (
                        <p className="text-sm text-slate-300 mb-1">
                          {itinerary.weatherNotes}
                        </p>
                      )}
                      {itinerary.whatToWear && (
                        <p className="text-sm text-slate-300">
                          <span className="text-slate-400">Wear:</span>{" "}
                          {itinerary.whatToWear}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  {itinerary.additionalNotes && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-slate-200 mb-1">
                        Notes
                      </p>
                      <p className="text-sm text-slate-300 whitespace-pre-line">
                        {itinerary.additionalNotes}
                      </p>
                    </div>
                  )}
                  {itinerary.termsAndConditions && (
                    <div>
                      <p className="text-sm font-semibold text-slate-200 mb-1">
                        Terms
                      </p>
                      <p className="text-sm text-slate-300 whitespace-pre-line">
                        {itinerary.termsAndConditions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic mt-2">
                No additional information configured.
              </p>
            )}
          </div>
        </div>

        {/* Right: Details Panel */}
        <div className="space-y-5">
          {/* Title & Activity */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-wider border ${itinerary.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
              >
                {itinerary.isActive ? "Active" : "Inactive"}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-wider border ${itinerary.status === "published" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}
              >
                {itinerary.status || "draft"}
              </span>
              {itinerary.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Star className="h-3 w-3 fill-amber-400" /> Featured
                </span>
              )}
            </div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold tracking-tight text-slate-50">
                {itinerary.title}
              </h1>
              <button
                onClick={() => setIsBasicInfoOpen(true)}
                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                title="Edit Basic Info"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {itinerary.activity && (
                <span className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
                  {itinerary.activity}
                </span>
              )}
              {itinerary.category && (
                <span className="inline-block rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-medium text-purple-400">
                  {itinerary.category}
                </span>
              )}
            </div>
            {itinerary.tags && itinerary.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {itinerary.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Calendar className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Date</p>
                <p className="font-medium text-slate-200">
                  {new Date(itinerary.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {itinerary.location && (
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <MapPin className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="font-medium text-slate-200">
                    {itinerary.location}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <DollarSign className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Price</p>
                <p className="text-lg font-bold text-emerald-400">
                  {itinerary.price.toLocaleString()} RWF
                </p>
              </div>
            </div>

            {company && (
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <Building2 className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Company</p>
                  <p className="font-medium text-slate-200">{company.name}</p>
                </div>
              </div>
            )}

            {(itinerary.durationDays || itinerary.durationHours) && (
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Duration</p>
                  <p className="font-medium text-slate-200">
                    {itinerary.durationDays ? `${itinerary.durationDays}d` : ""}
                    {itinerary.durationDays && itinerary.durationHours
                      ? " "
                      : ""}
                    {itinerary.durationHours
                      ? `${itinerary.durationHours}h`
                      : ""}
                  </p>
                </div>
              </div>
            )}

            {(itinerary.minParticipants || itinerary.maxParticipants) && (
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Capacity</p>
                  <p className="font-medium text-slate-200">
                    {itinerary.minParticipants && itinerary.maxParticipants
                      ? `${itinerary.minParticipants}-${itinerary.maxParticipants}`
                      : itinerary.maxParticipants ||
                        itinerary.minParticipants}{" "}
                    people
                  </p>
                </div>
              </div>
            )}

            {itinerary.availableSlots !== null &&
              itinerary.availableSlots !== undefined && (
                <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <TrendingUp className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Available Slots</p>
                    <p className="font-medium text-slate-200">
                      {itinerary.availableSlots}{" "}
                      {itinerary.availableSlots === 1 ? "slot" : "slots"}
                    </p>
                  </div>
                </div>
              )}

            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                <Users className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Bookings</p>
                <p className="font-medium text-slate-200">
                  {attendeeCount} {attendeeCount === 1 ? "booking" : "bookings"}
                </p>
              </div>
            </div>

            {itinerary.averageRating &&
              itinerary.totalRatings &&
              itinerary.totalRatings > 0 && (
                <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <Star className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Rating</p>
                    <p className="font-medium text-slate-200">
                      {itinerary.averageRating.toFixed(1)}/10 (
                      {itinerary.totalRatings} reviews)
                    </p>
                  </div>
                </div>
              )}

            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10">
                <ImageIcon className="h-5 w-5 text-pink-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Images</p>
                <p className="font-medium text-slate-200">
                  {images.length} {images.length === 1 ? "photo" : "photos"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 space-y-4 mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-red-500 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> Danger Zone
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-200">
                Delete this itinerary
              </p>
              <p className="text-xs text-slate-400">
                Once you delete an itinerary, there is no going back. Please be
                certain.
              </p>
            </div>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeleting || !itinerary}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600/10 border border-red-600/20 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-600/20 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Itinerary
            </button>
          </div>
        </div>
      </div>
      <EditBasicInfoModal
        itinerary={itinerary}
        isOpen={isBasicInfoOpen}
        onClose={() => setIsBasicInfoOpen(false)}
        onSaved={() => setRefreshKey((prev) => prev + 1)}
      />
      <EditPricingPoliciesModal
        itinerary={itinerary}
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onSaved={() => setRefreshKey((prev) => prev + 1)}
      />
      <EditMealsTransportModal
        itinerary={itinerary}
        isOpen={isMealsTransportOpen}
        onClose={() => setIsMealsTransportOpen(false)}
        onSaved={() => setRefreshKey((prev) => prev + 1)}
      />
      <EditRequirementsInfoModal
        itinerary={itinerary}
        isOpen={isRequirementsOpen}
        onClose={() => setIsRequirementsOpen(false)}
        onSaved={() => setRefreshKey((prev) => prev + 1)}
      />
      <EditScheduleLogisticsModal
        itinerary={itinerary}
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSaved={() => setRefreshKey((prev) => prev + 1)}
      />
      <EditAdditionalInfoModal
        itinerary={itinerary}
        isOpen={isAdditionalInfoOpen}
        onClose={() => setIsAdditionalInfoOpen(false)}
        onSaved={() => setRefreshKey((prev) => prev + 1)}
      />
      <ConfirmationModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Itinerary"
        description={`Are you sure you want to delete "${itinerary.title}"? This action cannot be undone and will permanently remove this itinerary from our servers.`}
        confirmText="Yes, delete itinerary"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default CompanyItineraryDetailPage;
