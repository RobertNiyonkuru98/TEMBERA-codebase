import { RoleGuard, CompanyOnboardingGuard } from "@/components/routing/guards";
import CompanyDashboardPage from "@/pages/CompanyDashboardPage";
import CompanyItinerariesPage from "@/pages/CompanyItinerariesPage";
import CompanyItineraryDetailPage from "@/pages/CompanyItineraryDetailPage";
import CompanyAttendeesPage from "@/pages/CompanyAttendeesPage";
import CompanyItineraryImagesPage from "@/pages/CompanyItineraryImagesPage";
import CompanyStatisticsPage from "@/pages/CompanyStatisticsPage";
import CompanyRegisterPage from "@/pages/CompanyRegisterPage";
import CompanyCreateItineraryPage from "@/pages/CompanyCreateItineraryPage";

export const companyRoutes = [
  {
    path: "/company/register",
    element: (
      <RoleGuard allowedRoles={["company"]}>
        <CompanyOnboardingGuard allowWithoutCompany>
          <CompanyRegisterPage />
        </CompanyOnboardingGuard>
      </RoleGuard>
    ),
  },
  {
    path: "/company/itineraries/create",
    element: (
      <RoleGuard allowedRoles={["company"]}>
        <CompanyOnboardingGuard allowWithoutItinerary>
          <CompanyCreateItineraryPage />
        </CompanyOnboardingGuard>
      </RoleGuard>
    ),
  },
  {
    path: "/company/dashboard",
    element: (
      <RoleGuard allowedRoles={["company"]}>
        <CompanyOnboardingGuard>
          <CompanyDashboardPage />
        </CompanyOnboardingGuard>
      </RoleGuard>
    ),
  },
  {
    path: "/company/itineraries",
    element: (
      <RoleGuard allowedRoles={["company"]}>
        <CompanyOnboardingGuard>
          <CompanyItinerariesPage />
        </CompanyOnboardingGuard>
      </RoleGuard>
    ),
  },
  {
    path: "/company/itinerary/:id/detail",
    element: (
      <RoleGuard allowedRoles={["company"]}>
        <CompanyOnboardingGuard>
          <CompanyItineraryDetailPage />
        </CompanyOnboardingGuard>
      </RoleGuard>
    ),
  },
  {
    path: "/company/itinerary/:id/attendees",
    element: (
      <RoleGuard allowedRoles={["company"]}>
        <CompanyOnboardingGuard>
          <CompanyAttendeesPage />
        </CompanyOnboardingGuard>
      </RoleGuard>
    ),
  },
  {
    path: "/company/itinerary/:id/images",
    element: (
      <RoleGuard allowedRoles={["company"]}>
        <CompanyOnboardingGuard>
          <CompanyItineraryImagesPage />
        </CompanyOnboardingGuard>
      </RoleGuard>
    ),
  },
  {
    path: "/company/statistics",
    element: (
      <RoleGuard allowedRoles={["company"]}>
        <CompanyOnboardingGuard>
          <CompanyStatisticsPage />
        </CompanyOnboardingGuard>
      </RoleGuard>
    ),
  },
];
