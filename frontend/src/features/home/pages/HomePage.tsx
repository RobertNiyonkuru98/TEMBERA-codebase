import { useEffect, useMemo, useState, useRef } from "react";
import ItineraryCard from "@/features/itineraries/components/ItineraryCard";
import { Link, useNavigate } from "react-router-dom";
import {
  createBooking,
  createBookingItem,
  fetchCompanies,
  fetchItineraries,
} from "@/core/api";
import type { Company, Itinerary } from "@/shared/types";
import { useAuth } from "@/features/auth/AuthContext";
import { toast } from "sonner";
import { ChevronRight, MapPin, Calendar, Users, Star, Play, CheckCircle2, Sparkles, Mountain, Camera } from "lucide-react";
import { useI18n } from "@/core/i18n";

// Import local images and video
import volcanoImg from "@/assets/forigners_on_top_of_volcano.jpg";
import gorillaImg from "@/assets/gorilla_1.jpg";
import happyPeopleImg from "@/assets/happy_people.jpeg";
import hikingImg from "@/assets/hiking_1.jpg";
import visitRwandaVideo from "@/assets/visit_rwanda_video.mp4";

function HomePage() {
  const { token, user, activeRole } = useAuth();
  const { t } = useI18n();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [attendingItineraryId, setAttendingItineraryId] = useState<string | null>(null);
  const [activeDestination, setActiveDestination] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Auto-rotate featured destinations
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDestination((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if(activeRole && ["company", "admin"].includes(activeRole)) {
      toast.info("Switch to visitor role to explore new events itineraries. Today")
      navigate(`/${activeRole}/dashboard`, { replace: true });
      return;
    }
    async function loadData() {
      try {
        const [fetchedItineraries, fetchedCompanies] = await Promise.all([
          fetchItineraries(token ? token : 'undefined'),
          fetchCompanies(token ? token : 'undefined'),
        ]);
        setItineraries(fetchedItineraries);
        setCompanies(fetchedCompanies);
      } catch (loadError) {
        toast.error(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load home data",
        );
      }
    }

    void loadData();
  }, [activeRole, navigate, token]);

  const featuredItineraries = useMemo(() => itineraries.slice(0, 6), [itineraries]);

  async function handleAttend(itinerary: Itinerary) {
    if (!token || !user) {
      toast.error("Please login to register for an itinerary.");
      return;
    }

    try {
      setAttendingItineraryId(String(itinerary.id));

      const booking = await createBooking(token, {
        user_id: String(user.id),
        description: `Registration for ${itinerary.title}`,
        status: "pending",
        date: new Date().toISOString().slice(0, 10),
      });

      await createBookingItem(token, {
        booking_id: String(booking.id),
        itinerary_id: String(itinerary.id),
      });
    toast.success(`Successfully registered for ${itinerary.title}! Check your my Bookings for details.`);
    } catch (attendError) {
      toast.error(
        attendError instanceof Error
          ? attendError.message
          : "Failed to register for itinerary",
      );
    } finally {
      setAttendingItineraryId(null);
    }
  }

  const destinations = [
    { name: t("home.destinationVolcanoes"), image: volcanoImg, tag: t("home.tagGorillaTrekking") },
    { name: t("home.destinationKivu"), image: happyPeopleImg, tag: t("home.tagBeachRelaxation") },
    { name: t("home.destinationNyungwe"), image: hikingImg, tag: t("home.tagCanopyWalks") },
    { name: t("home.destinationAkagera"), image: gorillaImg, tag: t("home.tagSafariAdventures") },
  ];

  const stats = [
    { value: companies.length + "+", label: t("home.statsTourOperators"), icon: Users },
    { value: itineraries.length + "+", label: t("home.statsExperiences"), icon: Mountain },
    { value: "24/7", label: t("home.statsSupport"), icon: CheckCircle2 },
    { value: "100%", label: t("home.statsLocalExpertise"), icon: Star },
  ];

  const howItWorks = [
    { step: "1", title: t("home.stepExplore"), description: t("home.stepExploreDesc"), icon: Camera },
    { step: "2", title: t("home.stepChoose"), description: t("home.stepChooseDesc"), icon: MapPin },
    { step: "3", title: t("home.stepBook"), description: t("home.stepBookDesc"), icon: Calendar },
    { step: "4", title: t("home.stepExperience"), description: t("home.stepExperienceDesc"), icon: Sparkles },
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* HERO SECTION - Full Screen Local Video Background */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] w-full overflow-hidden">
        {/* Local Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none"
            style={{ width: '100vw', height: '56.25vw', minHeight: '100vh', minWidth: '177.77vh' }}
            autoPlay
            muted
            loop
            playsInline
            src={visitRwandaVideo}
          />
        </div>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90 z-10" />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/70 via-transparent to-slate-950/70 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center">
          {/* Animated Badge */}
          <div className="animate-fade-in-down mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              {t("home.heroBadge")}
            </span>
          </div>

          {/* Main Heading with Stagger Animation */}
          <h1 className="animate-fade-in-up mb-6 max-w-5xl text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="bg-linear-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent">
              {t("home.heroMainTitle")}
            </span>
          </h1>

          {/* Subheading */}
          <p className="animate-fade-in mb-10 max-w-3xl text-lg text-slate-200 sm:text-xl md:text-2xl">
            {t("home.heroMainSubtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/itineraries"
              className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-lg font-semibold text-slate-950 shadow-2xl shadow-emerald-500/50 transition-all duration-300 hover:scale-105 hover:bg-emerald-400 hover:shadow-emerald-400/60"
            >
              {t("home.exploreExperiences")}
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            {!user && (
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20"
              >
                <Play className="h-5 w-5" />
                {t("home.getStarted")}
              </Link>
            )}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center gap-2 text-white/70">
              <span className="text-xs uppercase tracking-wider">{t("home.scrollToExplore")}</span>
              <ChevronRight className="h-5 w-5 rotate-90" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DESTINATIONS - Image Carousel */}
      <section className="relative -mt-20 z-30 w-full pb-20">
        <div className="mx-auto w-[95%] max-w-[1920px]">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/80 p-8 backdrop-blur-xl shadow-2xl">
            <div className="mb-8 text-center">
              <h2 className="mb-3 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
                {t("home.popularDestinations")}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {t("home.popularDestinationsSubtitle")}
              </p>
            </div>

            {/* Destination Carousel */}
            <div className="relative h-[400px] overflow-hidden rounded-2xl">
              {destinations.map((dest, idx) => (
                <div
                  key={dest.name}
                  className={`absolute inset-0 transition-all duration-1000 ${
                    idx === activeDestination
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-110"
                  }`}
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="mb-2 inline-block rounded-full bg-emerald-500 px-4 py-1 text-sm font-semibold text-white dark:text-slate-950">
                      {dest.tag}
                    </span>
                    <h3 className="text-3xl font-bold text-white">{dest.name}</h3>
                  </div>
                </div>
              ))}

              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                {destinations.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveDestination(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === activeDestination
                        ? "w-8 bg-emerald-400"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION - Animated Counters */}
      <section className="bg-linear-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900 py-20 w-full">
        <div className="mx-auto w-[95%] max-w-[1920px]">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 text-center transition-all duration-300 hover:scale-105 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-900"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-linear-to-br from-emerald-500/0 to-emerald-500/0 transition-all duration-300 group-hover:from-emerald-500/10 group-hover:to-transparent" />
                  <Icon className="mx-auto mb-4 h-12 w-12 text-emerald-500 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
                  <p className="mb-2 text-5xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - Visual Timeline */}
      <section className="bg-white dark:bg-slate-900 py-20 w-full">
        <div className="mx-auto w-[95%] max-w-[1920px]">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
              {t("home.howItWorks")}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {t("home.howItWorksSubtitle")}
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-1/2 top-0 hidden h-full w-1 -translate-x-1/2 bg-linear-to-b from-emerald-500 via-emerald-400 to-emerald-500 lg:block" />

            <div className="space-y-12">
              {howItWorks.map((item, idx) => {
                const Icon = item.icon;
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={item.step}
                    className={`relative flex items-center gap-8 ${
                      isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                    }`}
                  >
                    {/* Content */}
                    <div className={`flex-1 ${isEven ? "lg:text-right" : "lg:text-left"}`}>
                      <div className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-8 transition-all duration-300 hover:border-emerald-500/50 hover:bg-white dark:hover:bg-slate-950">
                        <div className="mb-4 flex items-center gap-3 lg:justify-end">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-xl font-bold text-white dark:text-slate-950">
                            {item.step}
                          </span>
                          <Icon className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300">{item.description}</p>
                      </div>
                    </div>

                    {/* Center Circle */}
                    <div className="hidden lg:block">
                      <div className="h-6 w-6 rounded-full border-4 border-emerald-500 bg-white dark:bg-slate-900" />
                    </div>

                    {/* Spacer */}
                    <div className="hidden flex-1 lg:block" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ITINERARIES */}
      <section className="bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-20 w-full">
        <div className="mx-auto w-[95%] max-w-[1920px]">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
                {t("home.featuredExperiences")}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">{t("home.featuredExperiencesSubtitle")}</p>
            </div>
            <Link
              to="/itineraries"
              className="group inline-flex items-center gap-2 rounded-full border border-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-500 hover:text-white dark:hover:text-slate-950"
            >
              {t("home.viewAll")}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredItineraries.map((itinerary, idx) => {
              const company = companies.find(
                (c) => String(c.id) === String(itinerary.companyId),
              );
              return (
                <div
                  key={itinerary.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <ItineraryCard
                    itinerary={itinerary}
                    company={company}
                    as="a"
                    onAttend={activeRole === "user" ? handleAttend : undefined}
                    isAttending={attendingItineraryId === String(itinerary.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-500 to-emerald-600 py-20 w-full">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTEyIDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0yNCAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="relative z-10 mx-auto w-[95%] max-w-[1200px] text-center">
          <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
            {t("home.ctaTitle")}
          </h2>
          <p className="mb-10 text-xl text-emerald-50">
            {t("home.ctaSubtitle")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-slate-900"
                >
                  {t("home.signUpNow")}
                  <ChevronRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
                >
                  {t("nav.signIn")}
                </Link>
              </>
            ) : (
              <Link
                to="/itineraries"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-slate-900"
              >
                {t("home.browseExperiences")}
                <ChevronRight className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

