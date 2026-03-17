import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Toaster, toast } from "sonner";
import HomePage from "./pages/HomePage";
import ItinerariesPage from "./pages/ItinerariesPage";
import ItineraryDetailPage from "./pages/ItineraryDetailPage";
import BookingsPage from "./pages/BookingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateBookingPage from "./pages/CreateBookingPage";
import { useAuth } from "./AuthContext.tsx";
import { useI18n, type Lang } from "./i18n";
import type { UserRole } from "./types";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminItinerariesPage from "./pages/AdminItinerariesPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminCompaniesPage from "./pages/AdminCompaniesPage";
import CompanyItinerariesPage from "./pages/CompanyItinerariesPage";
import CompanyDashboardPage from "./pages/CompanyDashboardPage";
import CompanyAttendeesPage from "./pages/CompanyAttendeesPage";
import CompanyStatisticsPage from "./pages/CompanyStatisticsPage";
import VisitorShowcasePage from "./pages/VisitorShowcasePage";
import ProfilePage from "./pages/ProfilePage";
import AdminCreateCompanyPage from "./pages/AdminCreateCompanyPage";
import AdminCreateItineraryPage from "./pages/AdminCreateItineraryPage";
import CompanyRegisterPage from "./pages/CompanyRegisterPage";
import CompanyCreateItineraryPage from "./pages/CompanyCreateItineraryPage";
import CompanyItineraryImagesPage from "./pages/CompanyItineraryImagesPage";
import AuthenticatedSidebar from "./components/AuthenticatedSidebar";
import GuestTopNav from "./components/GuestTopNav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  getMyCompanyState,
  hasCompanyItineraries,
  type CompanyState,
} from "./api/platformApi";

type RoleProtectedRouteProps = {
  allowedRoles: UserRole[];
  children: ReactNode;
};

function RoleProtectedRoute({ allowedRoles, children }: RoleProtectedRouteProps) {
  const { user, activeRole } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!activeRole || !allowedRoles.includes(activeRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: ReactNode }) {
  return <RoleProtectedRoute allowedRoles={["admin"]}>{children}</RoleProtectedRoute>;
}

function CompanyRoute({ children }: { children: ReactNode }) {
  return <RoleProtectedRoute allowedRoles={["company"]}>{children}</RoleProtectedRoute>;
}

function UserRoute({ children }: { children: ReactNode }) {
  return <RoleProtectedRoute allowedRoles={["user"]}>{children}</RoleProtectedRoute>;
}

type CompanyOnboardingRouteProps = {
  children: ReactNode;
  allowWithoutCompany?: boolean;
  allowWithoutItinerary?: boolean;
};

function CompanyOnboardingRoute({
  children,
  allowWithoutCompany = false,
  allowWithoutItinerary = false,
}: CompanyOnboardingRouteProps) {
  const { user, token, activeRole } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [companyState, setCompanyState] = useState<CompanyState>({ hasCompany: false });
  const [hasItineraries, setHasItineraries] = useState(false);

  useEffect(() => {
    async function loadCompanyState() {
      if (!user || !token || activeRole !== "company") {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const nextState = await getMyCompanyState(token, String(user.id));
        setCompanyState(nextState);

        if (!nextState.hasCompany || !nextState.companyId) {
          setHasItineraries(false);
          return;
        }

        const nextHasItineraries = await hasCompanyItineraries(
          token,
          nextState.companyId,
        );
        setHasItineraries(nextHasItineraries);
      } catch (loadError) {
        toast.error(
          loadError instanceof Error
            ? loadError.message
            : "Failed to validate company onboarding",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadCompanyState();
  }, [activeRole, token, user]);

  const destination = useMemo(() => {
    if (!companyState.hasCompany) {
      toast.warning("You must register a company first", {
        description: "Complete your company profile to unlock your workspace.",
      });
      return "/company/register";
    }

    if (!hasItineraries) {

      toast.info("Create your first itinerary to continue", {
        description: "After creating one, you'll have full access to your dashboard.",
      });
      console.log("No itineraries found for company, redirecting to create page",);
      return "/company/itineraries/create";
    }

    return null;
  }, [companyState.hasCompany, hasItineraries]);

  if (isLoading) {
    return <p className="text-sm text-slate-300">Checking company setup...</p>;
  }
  if (!companyState.hasCompany && allowWithoutCompany) {
    return <>{children}</>;
  }

  if (companyState.hasCompany && !hasItineraries && allowWithoutItinerary) {
    return <>{children}</>;
  }

  if (destination) {
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/itineraries" element={<ItinerariesPage />} />
      <Route path="/itinerary/:id" element={<ItineraryDetailPage />} />
      <Route path="/itineraries/:id" element={<ItineraryDetailPage />} />
      <Route path="/visitor/showcase" element={<VisitorShowcasePage />} />

      <Route
        path="/profile"
        element={
          <RoleProtectedRoute
            allowedRoles={["admin", "company", "user", "visitor"]}
          >
            <ProfilePage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/bookings"
        element={
          <UserRoute>
            <BookingsPage />
          </UserRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <UserRoute>
            <BookingsPage />
          </UserRoute>
        }
      />
      <Route
        path="/bookings/new"
        element={
          <UserRoute>
            <CreateBookingPage />
          </UserRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <AdminRoute>
            <AdminBookingsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/companies"
        element={
          <AdminRoute>
            <AdminCompaniesPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/companies/create"
        element={
          <AdminRoute>
            <AdminCreateCompanyPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/itineraries"
        element={
          <AdminRoute>
            <AdminItinerariesPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/itineraries/create"
        element={
          <AdminRoute>
            <AdminCreateItineraryPage />
          </AdminRoute>
        }
      />

      <Route
        path="/company/register"
        element={
          <CompanyRoute>
            <CompanyOnboardingRoute allowWithoutCompany>
              <CompanyRegisterPage />
            </CompanyOnboardingRoute>
          </CompanyRoute>
        }
      />
      <Route
        path="/company/itineraries/create"
        element={
          <CompanyRoute>
            <CompanyOnboardingRoute allowWithoutItinerary>
              <CompanyCreateItineraryPage />
            </CompanyOnboardingRoute>
          </CompanyRoute>
        }
      />

      <Route
        path="/company/dashboard"
        element={
          <CompanyRoute>
            <CompanyOnboardingRoute>
              <CompanyDashboardPage />
            </CompanyOnboardingRoute>
          </CompanyRoute>
        }
      />
      <Route
        path="/company/itineraries"
        element={
          <CompanyRoute>
            <CompanyOnboardingRoute>
              <CompanyItinerariesPage />
            </CompanyOnboardingRoute>
          </CompanyRoute>
        }
      />
      <Route
        path="/company/itinerary/:id/attendees"
        element={
          <CompanyRoute>
            <CompanyOnboardingRoute>
              <CompanyAttendeesPage />
            </CompanyOnboardingRoute>
          </CompanyRoute>
        }
      />
      <Route
        path="/company/itinerary/:id/images"
        element={
          <CompanyRoute>
            <CompanyOnboardingRoute>
              <CompanyItineraryImagesPage />
            </CompanyOnboardingRoute>
          </CompanyRoute>
        }
      />
      <Route
        path="/company/statistics"
        element={
          <CompanyRoute>
            <CompanyOnboardingRoute>
              <CompanyStatisticsPage />
            </CompanyOnboardingRoute>
          </CompanyRoute>
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AuthenticatedLayout({
  role,
  displayName,
  logout,
  lang,
  setLang,
}: {
  role: UserRole;
  displayName: string;
  logout: () => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
}) {
  return (
    <SidebarProvider defaultOpen>
      <AuthenticatedSidebar
        role={role}
        displayName={displayName}
        onLogout={logout}
        lang={lang}
        onLangChange={setLang}
      />

      <SidebarInset className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <AppRoutes />
        </main>
        <footer className="border-t border-slate-900 bg-slate-950 px-4 py-3 text-center text-[11px] text-slate-400">
          © 2026 Tembera Travel Platform
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}

function GuestLayout({ heroTitle }: { heroTitle: string }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col">
      <GuestTopNav brandTitle={heroTitle} />

      <main className="flex-1 w-full">
        <AppRoutes />
      </main>

      <footer className="mt-auto bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 w-full">
        <div className="px-4 py-3 text-center text-[11px] text-slate-600 dark:text-slate-400">
          © 2026 Tembera Travel Platform
        </div>
      </footer>
    </div>
  );
}

function App() {
  const { user, activeRole, logout, initialize, isInitialized } = useAuth();
  const { lang, setLang, t } = useI18n();

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-300">Loading session...</p>
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        {user ? (
          <AuthenticatedLayout
            role={activeRole ?? user.role}
            displayName={user.name}
            logout={logout}
            lang={lang}
            setLang={setLang}
          />
        ) : (
          <GuestLayout heroTitle={t("home.heroTitle")} />
        )}
      </BrowserRouter>
      <Toaster position="top-right" theme="dark" expand richColors />
    </>
  );
}

export default App;