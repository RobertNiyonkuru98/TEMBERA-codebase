import { bookingItems, bookings, itineraries } from "../mockData";
import { useAuth } from "../AuthContext";
import { useI18n } from "../i18n";

function BookingsPage() {
  const { user } = useAuth();
  const { t } = useI18n();

  if (!user) {
    return null;
  }

  const userBookings = bookings.filter((b) => b.userId === user.id);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          {t("bookings.title")}
        </h1>
        <p className="text-sm text-slate-300">
          {t("bookings.subtitle")}{" "}
          <span className="font-semibold">{user.name}</span>
        </p>
      </header>

      {userBookings.length === 0 ? (
        <p className="text-sm text-slate-300">
          {t("bookings.empty")}
        </p>
      ) : (
        <div className="space-y-4">
          {userBookings.map((booking) => {
            const items = bookingItems.filter(
              (bi) => bi.bookingId === booking.id,
            );
            const linkedItineraries = items
              .map((bi) => itineraries.find((i) => i.id === bi.itineraryId))
              .filter((i): i is NonNullable<typeof i> => Boolean(i));

            return (
              <section
                key={booking.id}
                className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">
                      Booking #{booking.id}
                    </p>
                    <p className="text-xs text-slate-400">
                      Created on{" "}
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px] font-medium capitalize text-slate-200">
                    {booking.status}
                  </span>
                </div>

                {booking.description && (
                  <p className="text-xs text-slate-300">
                    “{booking.description}”
                  </p>
                )}

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-200">
                    {t("bookings.itinerariesInBooking")}
                  </p>
                  {linkedItineraries.length > 0 ? (
                    <ul className="space-y-1 text-xs text-slate-300">
                      {linkedItineraries.map((itinerary) => (
                        <li
                          key={itinerary.id}
                          className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2"
                        >
                          <div>
                            <p className="font-medium text-slate-100">
                              {itinerary.title}
                            </p>
                            <p className="text-slate-400">
                              {itinerary.location} ·{" "}
                              {new Date(
                                itinerary.date,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-emerald-300 font-semibold">
                            {itinerary.price.toLocaleString()} RWF
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400">
                      This booking currently has no linked itineraries in the
                      mock dataset.
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BookingsPage;

