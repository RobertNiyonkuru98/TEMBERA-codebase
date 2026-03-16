import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ItinerariesPage from "./pages/ItinerariesPage";
import ItineraryDetailPage from "./pages/ItineraryDetailPage";
import BookingsPage from "./pages/BookingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateBookingPage from "./pages/CreateBookingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./AuthContext";
import { useI18n, type Lang } from "./i18n";

function App() {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useI18n();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="rounded-lg bg-emerald-500 px-2 py-1 text-sm font-semibold text-slate-950">
                TEMBERA
              </span>
              <span className="text-sm text-slate-300 hidden sm:inline">
                {t("home.heroTitle")}
              </span>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-4 text-sm">
              <Link
                to="/"
                className="rounded-md px-3 py-1.5 text-slate-200 hover:bg-slate-800 hover:text-white transition"
              >
                {t("nav.home")}
              </Link>
              <Link
                to="/itineraries"
                className="rounded-md px-3 py-1.5 text-slate-200 hover:bg-slate-800 hover:text-white transition"
              >
                {t("nav.itineraries")}
              </Link>
              {user && (
                <>
                  <Link
                    to="/bookings"
                    className="rounded-md px-3 py-1.5 text-slate-200 hover:bg-slate-800 hover:text-white transition"
                  >
                    {t("nav.myBookings")}
                  </Link>
                  <Link
                    to="/bookings/new"
                    className="rounded-md px-3 py-1.5 text-emerald-200 border border-emerald-400/60 hover:bg-emerald-500 hover:text-slate-950 transition"
                  >
                    {t("nav.newBooking")}
                  </Link>
                </>
              )}
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="rounded-md px-3 py-1.5 text-slate-200 hover:bg-slate-800 hover:text-white transition"
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-md px-3 py-1.5 text-emerald-200 border border-emerald-400/60 hover:bg-emerald-500 hover:text-slate-950 transition"
                  >
                    {t("nav.register")}
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-md px-3 py-1.5 text-xs text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white transition"
                >
                  {t("nav.logout")}
                </button>
              )}
              <div className="flex items-center gap-1">
                <label
                  htmlFor="lang"
                  className="hidden sm:inline text-[11px] text-slate-400"
                >
                  {t("nav.languageLabel")}
                </label>
                <select
                  id="lang"
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Lang)}
                  className="rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-[11px] text-slate-100"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="rw">Kinyarwanda</option>
                </select>
              </div>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/itineraries" element={<ItinerariesPage />} />
              <Route path="/itineraries/:id" element={<ItineraryDetailPage />} />

              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <BookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings/new"
                element={
                  <ProtectedRoute>
                    <CreateBookingPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </div>
        </main>

        <footer className="mt-auto bg-slate-950 border-t border-slate-900">
          <div className="px-4 py-3 text-center text-[11px] text-slate-400">
            © 2026 Tembera Travel Platform
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;