import { RoleGuard } from "@/components/routing/guards";
import BookingsPage from "@/pages/BookingsPage";
import CreateBookingPage from "@/pages/CreateBookingPage";
import ProfilePage from "@/pages/ProfilePage";

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
