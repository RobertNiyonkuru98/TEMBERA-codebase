import { RoleGuard } from "@/components/routing/guards";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminBookingsPage from "@/pages/AdminBookingsPage";
import AdminUsersPage from "@/pages/AdminUsersPage";
import AdminCompaniesPage from "@/pages/AdminCompaniesPage";
import AdminCompanyDetailPage from "@/pages/AdminCompanyDetailPage";
import AdminCreateCompanyPage from "@/pages/AdminCreateCompanyPage";
import AdminItinerariesPage from "@/pages/AdminItinerariesPage";
import AdminCreateItineraryPage from "@/pages/AdminCreateItineraryPage";

export const adminRoutes = [
  {
    path: "/admin/dashboard",
    element: (
      <RoleGuard allowedRoles={["admin"]}>
        <AdminDashboardPage />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/bookings",
    element: (
      <RoleGuard allowedRoles={["admin"]}>
        <AdminBookingsPage />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <RoleGuard allowedRoles={["admin"]}>
        <AdminUsersPage />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/companies",
    element: (
      <RoleGuard allowedRoles={["admin"]}>
        <AdminCompaniesPage />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/companies/:id",
    element: (
      <RoleGuard allowedRoles={["admin"]}>
        <AdminCompanyDetailPage />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/companies/create",
    element: (
      <RoleGuard allowedRoles={["admin"]}>
        <AdminCreateCompanyPage />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/itineraries",
    element: (
      <RoleGuard allowedRoles={["admin"]}>
        <AdminItinerariesPage />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/itineraries/create",
    element: (
      <RoleGuard allowedRoles={["admin"]}>
        <AdminCreateItineraryPage />
      </RoleGuard>
    ),
  },
];
