import { RoleGuard } from "@/shared/components/common";
import {
  AdminDashboardPage,
  AdminBookingsPage,
  AdminUsersPage,
  AdminCompaniesPage,
  AdminCompanyDetailPage,
  AdminCreateCompanyPage,
  AdminItinerariesPage,
  AdminCreateItineraryPage,
} from "@/features/admin";

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
