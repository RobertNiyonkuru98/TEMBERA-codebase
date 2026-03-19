import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  fetchBookingItems,
  fetchCompanies,
  fetchItineraryById,
} from "../api/platformApi";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import type { BookingItem, Company, Itinerary } from "../types";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Building2,
  Users,
  ImageIcon,
  Images,
} from "lucide-react";

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
  }, [id, token]);

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
                <p className="mt-3 text-sm text-slate-500">No images uploaded yet</p>
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
              <p className="text-slate-300 leading-relaxed">{itinerary.description}</p>
            </div>
          )}
        </div>

        {/* Right: Details Panel */}
        <div className="space-y-5">
          {/* Title & Activity */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-50">
              {itinerary.title}
            </h1>
            {itinerary.activity && (
              <span className="mt-2 inline-block rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
                {itinerary.activity}
              </span>
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
                  <p className="font-medium text-slate-200">{itinerary.location}</p>
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

            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                <Users className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Attendees</p>
                <p className="font-medium text-slate-200">
                  {attendeeCount} {attendeeCount === 1 ? "booking" : "bookings"}
                </p>
              </div>
            </div>

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
      </div>
    </div>
  );
}

export default CompanyItineraryDetailPage;
