import { RoleGuard, CompanyOnboardingGuard } from "@/shared/components/common";
import {
  CompanyDashboardPage,
  CompanyItinerariesPage,
  CompanyItineraryDetailPage,
  CompanyAttendeesPage,
  CompanyItineraryImagesPage,
  CompanyStatisticsPage,
  CompanyRegisterPage,
  CompanyCreateItineraryPage,
} from "@/features/company";

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
