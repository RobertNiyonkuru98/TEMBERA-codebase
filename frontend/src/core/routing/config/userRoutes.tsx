import { RoleGuard } from "@/shared/components/common";
import { BookingsPage, CreateBookingPage } from "@/features/bookings";
import { ProfilePage } from "@/features/profile";

export const userRoutes = [
  {
    path: "/bookings",
    element: (
      <RoleGuard allowedRoles={["user"]}>
        <BookingsPage />
      </RoleGuard>
    ),
  },
  {
    path: "/my-bookings",
    element: (
      <RoleGuard allowedRoles={["user"]}>
        <BookingsPage />
      </RoleGuard>
    ),
  },
  {
    path: "/bookings/new",
    element: (
      <RoleGuard allowedRoles={["user"]}>
        <CreateBookingPage />
      </RoleGuard>
    ),
  },
  {
    path: "/profile",
    element: (
      <RoleGuard allowedRoles={["admin", "company", "user", "visitor"]}>
        <ProfilePage />
      </RoleGuard>
    ),
  },
];
