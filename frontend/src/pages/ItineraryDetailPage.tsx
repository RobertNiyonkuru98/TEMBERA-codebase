import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookingItems, bookings, companies, itineraries, users } from "../mockData";
import { useI18n } from "../i18n";

function ItineraryDetailPage() {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const itineraryId = Number(id);

  const itinerary = itineraries.find((i) => i.id === itineraryId);
  const company = itinerary
    ? companies.find((c) => c.id === itinerary.companyId)
    : undefined;

  const bookingSummary = useMemo(() => {
    if (!itinerary) return null;

    const items = bookingItems.filter((bi) => bi.itineraryId === itinerary.id);
    const relatedBookings = bookings.filter((b) =>
      items.some((bi) => bi.bookingId === b.id),
    );

    return relatedBookings.map((booking) => {
      const user = users.find((u) => u.id === booking.userId);
      return {
        booking,
        userName: user?.name ?? "Unknown user",
      };
    });
  }, [itinerary]);

  if (!itinerary) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-300">
          {/* simple message left in English for now */}
          The requested itinerary could not be found in the mock data.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800 transition"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">
          {itinerary.activity ?? "Experience"}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          {itinerary.title}
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          {itinerary.description}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr,1.1fr] items-start">
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-slate-100">
            {t("detail.tripInfo")}
          </h2>
          <dl className="grid grid-cols-1 gap-3 text-xs text-slate-300 sm:grid-cols-2">
            <div>
              <dt className="text-slate-400">{t("detail.date")}</dt>
              <dd className="font-medium">
                {new Date(itinerary.date).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">{t("detail.location")}</dt>
              <dd className="font-medium">{itinerary.location}</dd>
            </div>
            <div>
              <dt className="text-slate-400">{t("detail.priceLabel")}</dt>
              <dd className="font-medium text-emerald-300">
                {itinerary.price.toLocaleString()} RWF
              </dd>
            </div>
            {company && (
              <div>
                <dt className="text-slate-400">{t("detail.company")}</dt>
                <dd className="font-medium">{company.name}</dd>
              </div>
            )}
          </dl>
          <p className="pt-2 text-[11px] text-slate-400">
            This detail page is backed by static mock data. In a real
            implementation, this would call your backend API (e.g.{" "}
            <code className="rounded bg-slate-800 px-1 py-0.5">
              GET /itineraries/:id
            </code>
            ) and allow users to select dates, group size, and confirm booking.
          </p>
        </section>

        <aside className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-slate-100">
            {t("detail.bookingsTitle")}
          </h2>

          {bookingSummary && bookingSummary.length > 0 ? (
            <ul className="space-y-3 text-xs text-slate-300">
              {bookingSummary.map(({ booking, userName }) => (
                <li
                  key={booking.id}
                  className="rounded-lg border border-slate-800 bg-slate-900/80 p-3"
                >
                  <p className="font-medium text-slate-100">
                    Booking #{booking.id} ·{" "}
                    <span className="capitalize">{booking.status}</span>
                  </p>
                  <p className="text-slate-400">By {userName}</p>
                  <p className="text-slate-400">
                    Created on{" "}
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                  {booking.description && (
                    <p className="mt-1 text-slate-400">
                      “{booking.description}”
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">
              {t("detail.noBookings")}
            </p>
          )}

          <button
            type="button"
            className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition"
          >
            {t("detail.addToBooking")}
          </button>
        </aside>
      </div>
    </div>
  );
}

export default ItineraryDetailPage;

