import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { fetchBookingItems, fetchCompanies, fetchItineraries } from "@/core/api";
import { Skeleton } from "@/shared/components/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui";
import type { BookingItem, Company, Itinerary } from "@/shared/types";
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Eye,
  Images,
  ImageIcon,
} from "lucide-react";

function ItineraryCard({
  itinerary,
  companyName,
  attendeeCount,
}: {
  itinerary: Itinerary;
  companyName: string;
  attendeeCount: number;
}) {
  const images = itinerary.imageUrls?.length
    ? itinerary.imageUrls
    : itinerary.imageUrl
      ? [itinerary.imageUrl]
      : [];

  const thumbnail = images[0];

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 transition-all hover:border-slate-700 hover:bg-slate-900/80">
      {/* Image / Placeholder */}
      <Link to={`/company/itinerary/${itinerary.id}/detail`} className="block">
        {thumbnail ? (
          <div className="relative aspect-16/10 overflow-hidden">
            <img
              src={thumbnail}
              alt={itinerary.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
            {images.length > 1 && (
              <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5 text-xs font-medium text-slate-200 backdrop-blur-sm">
                <ImageIcon className="h-3 w-3" />
                {images.length}
              </span>
            )}
          </div>
        ) : (
          <div className="flex aspect-16/10 items-center justify-center bg-slate-800/30">
            <ImageIcon className="h-10 w-10 text-slate-700" />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <Link
            to={`/company/itinerary/${itinerary.id}/detail`}
            className="text-base font-semibold text-slate-100 transition-colors hover:text-emerald-400 line-clamp-1"
          >
            {itinerary.title}
          </Link>
          <p className="mt-0.5 text-xs text-slate-500">{companyName}</p>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
          {itinerary.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{itinerary.location}</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(itinerary.date).toLocaleDateString()}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" />
            {attendeeCount}
          </span>
        </div>

        {/* Price + Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
          <span className="text-sm font-bold text-emerald-400">
            {itinerary.price.toLocaleString()} RWF
          </span>

          <TooltipProvider>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={`/company/itinerary/${itinerary.id}/detail`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>View details</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={`/company/itinerary/${itinerary.id}/images`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                  >
                    <Images className="h-4 w-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Manage images</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={`/company/itinerary/${itinerary.id}/attendees`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-emerald-400"
                  >
                    <Users className="h-4 w-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>View attendees</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

function ItineraryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
      <Skeleton className="aspect-16/10 w-full bg-slate-800" />
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4 bg-slate-800" />
          <Skeleton className="h-3 w-1/3 bg-slate-800/60" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-3 w-20 bg-slate-800/60" />
          <Skeleton className="h-3 w-20 bg-slate-800/60" />
          <Skeleton className="h-3 w-12 bg-slate-800/60" />
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
          <Skeleton className="h-5 w-24 bg-slate-800" />
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8 rounded-lg bg-slate-800/60" />
            <Skeleton className="h-8 w-8 rounded-lg bg-slate-800/60" />
            <Skeleton className="h-8 w-8 rounded-lg bg-slate-800/60" />
          </div>
        </div>
      </div>
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
    <div className="space-y-6">
      <header>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-50">
              Itineraries
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage and view all itineraries for your companies.
            </p>
          </div>
          <Link
            to="/company/itineraries/create"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/30"
          >
            <Plus className="h-4 w-4" />
            New Itinerary
          </Link>
        </div>
      </header>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ItineraryCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* No companies */}
      {!isLoading && !error && companies.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center">
          <p className="text-sm text-slate-400">
            No companies are linked to your account yet.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && companies.length > 0 && itineraries.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
            <Plus className="h-7 w-7 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-200">
            Create your first itinerary
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Get started by creating an itinerary for your company.
          </p>
          <Link
            to="/company/itineraries/create"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-500"
          >
            <Plus className="h-4 w-4" />
            New Itinerary
          </Link>
        </div>
      )}

      {/* Itinerary Cards Grid */}
      {!isLoading && !error && itineraries.length > 0 && (
        <>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>{itineraries.length} {itineraries.length === 1 ? "itinerary" : "itineraries"}</span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {itineraries.map((itinerary) => (
              <ItineraryCard
                key={itinerary.id}
                itinerary={itinerary}
                companyName={companyById.get(String(itinerary.companyId))?.name ?? "Unknown"}
                attendeeCount={attendeesByItinerary.get(String(itinerary.id)) ?? 0}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default CompanyItinerariesPage;
