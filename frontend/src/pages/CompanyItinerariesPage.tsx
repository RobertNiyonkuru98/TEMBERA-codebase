import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { fetchBookingItems, fetchCompanies, fetchItineraries } from "../api/platformApi";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { BookingItem, Company, Itinerary } from "../types";

function ItineraryImageCarousel({ itinerary }: { itinerary: Itinerary }) {
  const images = itinerary.imageUrls?.length
    ? itinerary.imageUrls
    : itinerary.imageUrl
      ? [itinerary.imageUrl]
      : [];

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateCounts = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
    };

    updateCounts();

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    return () => {
      api.off("select", updateCounts);
    };
  }, [api]);

  if (images.length === 0) {
    return <span className="text-xs text-slate-400">No images</span>;
  }

  return (
    <div className="mx-auto max-w-48 sm:max-w-xs">
      <Carousel setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={`${itinerary.id}-${image}-${index}`}>
              <Card className="m-px overflow-hidden border-slate-700 bg-slate-950">
                <CardContent className="p-0">
                  <img
                    src={image}
                    alt={`${itinerary.title} image ${index + 1}`}
                    className="aspect-square w-full object-cover"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
      {images.length > 1 && (
        <div className="py-2 text-center text-xs text-slate-400">
          Slide {current} of {count}
        </div>
      )}
    </div>
  );
}

function CompanyItinerariesPage() {
  const { user, token } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!token || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const [allCompanies, allItineraries, allBookingItems] = await Promise.all([
          fetchCompanies(token),
          fetchItineraries(token, { includeBlobs: true }),
          fetchBookingItems(token),
        ]);

        const ownedCompanies = allCompanies.filter(
          (company) => String(company.ownerId) === String(user.id),
        );
        const ownedCompanyIds = new Set(
          ownedCompanies.map((company) => String(company.id)),
        );

        setCompanies(ownedCompanies);
        const companyItineraries = allItineraries.filter((itinerary) =>
            ownedCompanyIds.has(String(itinerary.companyId)),
          );
        const companyItineraryIds = new Set(
          companyItineraries.map((itinerary) => String(itinerary.id)),
        );
        setItineraries(companyItineraries);
        setBookingItems(
          allBookingItems.filter((item) =>
            companyItineraryIds.has(String(item.itineraryId)),
          ),
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load company itineraries",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, [token, user]);

  const companyById = useMemo(
    () => new Map(companies.map((company) => [String(company.id), company])),
    [companies],
  );

  const attendeesByItinerary = useMemo(() => {
    const counts = new Map<string, number>();
    bookingItems.forEach((item) => {
      const key = String(item.itineraryId);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return counts;
  }, [bookingItems]);

  return (
    <div className="space-y-4">
      <header>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              Company Itineraries
            </h1>
            <p className="text-sm text-slate-300">
              Itineraries belonging to companies owned by your account.
            </p>
          </div>
          <Link
            to="/company/itineraries/create"
            className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Create Itinerary
          </Link>
        </div>
      </header>

      {isLoading && (
        <div className="space-y-4">
          {/* Header Skeleton */}
          <div className="animate-pulse space-y-3">
            <div className="h-8 w-64 rounded-lg bg-slate-800"></div>
            <div className="h-4 w-96 rounded-lg bg-slate-800/60"></div>
          </div>
          
          {/* Table Skeleton */}
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
            <div className="border-b border-slate-800 bg-slate-900/80 px-4 py-3">
              <div className="flex gap-4">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-700"></div>
                <div className="h-4 w-24 animate-pulse rounded bg-slate-700"></div>
                <div className="h-4 w-24 animate-pulse rounded bg-slate-700"></div>
                <div className="h-4 w-24 animate-pulse rounded bg-slate-700"></div>
                <div className="h-4 w-24 animate-pulse rounded bg-slate-700"></div>
                <div className="h-4 w-24 animate-pulse rounded bg-slate-700"></div>
              </div>
            </div>
            <div className="divide-y divide-slate-800/60">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="px-4 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-48 animate-pulse rounded-lg bg-slate-800"></div>
                    <div className="h-6 w-32 animate-pulse rounded-lg bg-slate-800"></div>
                    <div className="h-20 w-20 animate-pulse rounded-lg bg-slate-800"></div>
                    <div className="h-6 w-24 animate-pulse rounded-lg bg-slate-800"></div>
                    <div className="h-6 w-24 animate-pulse rounded-lg bg-slate-800"></div>
                    <div className="h-6 w-20 animate-pulse rounded-lg bg-slate-800"></div>
                    <div className="h-6 w-16 animate-pulse rounded-lg bg-slate-800"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-24 animate-pulse rounded-md bg-slate-700"></div>
                      <div className="h-8 w-24 animate-pulse rounded-md bg-slate-700"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {error && <p className="text-sm text-red-300">{error}</p>}

      {!isLoading && !error && companies.length === 0 && (
        <p className="text-sm text-slate-300">
          No companies are linked to your user yet.
        </p>
      )}

      {!isLoading && !error && companies.length > 0 && (
        itineraries.length === 0 ? (
          <div className="rounded-xl border border-amber-900 bg-amber-950/30 p-4 text-sm text-amber-100">
            <p className="font-medium">Create your first itinerary to start.</p>
            <p className="mt-1 text-amber-200">Your dashboard unlocks after your first itinerary.</p>
            <Link
              to="/company/itineraries/create"
              className="mt-3 inline-flex rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Create Itinerary
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
            <table className="w-full min-w-[880px] text-left text-sm text-slate-200">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Images</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Attendees</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {itineraries.map((itinerary) => (
                  <tr key={itinerary.id} className="border-b border-slate-800/60">
                    <td className="px-4 py-3">{itinerary.title}</td>
                    <td className="px-4 py-3">
                      {companyById.get(String(itinerary.companyId))?.name ?? "Unknown"}
                    </td>
                    <td className="px-4 py-3">
                      <ItineraryImageCarousel itinerary={itinerary} />
                    </td>
                    <td className="px-4 py-3">{itinerary.location ?? "-"}</td>
                    <td className="px-4 py-3">
                      {new Date(itinerary.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-emerald-300">
                      {itinerary.price.toLocaleString()} RWF
                    </td>
                    <td className="px-4 py-3">
                      {attendeesByItinerary.get(String(itinerary.id)) ?? 0}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <Link
                        to={`/company/itinerary/${itinerary.id}/attendees`}
                        className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 transition hover:bg-slate-800"
                      >
                        View attendees
                      </Link>
                      <Link
                        to={`/company/itinerary/${itinerary.id}/images`}
                        className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 transition hover:bg-slate-700"
                      >
                        Manage images
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

export default CompanyItinerariesPage;
