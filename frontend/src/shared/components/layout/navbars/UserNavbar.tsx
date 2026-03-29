import { useI18n } from "@/core/i18n";
import BaseNavbar from "./BaseNavbar";

function UserNavbar() {
  const { t } = useI18n();

  return (
    <BaseNavbar
      items={[
        { to: "/", label: t("nav.home") },
        { to: "/itineraries", label: t("nav.itineraries") },
        { to: "/bookings", label: t("nav.myBookings") },
        { to: "/profile", label: "Profile" },
        { to: "/bookings/new", label: t("nav.newBooking"), emphasis: true },
      ]}
    />
  );
}

export default UserNavbar;
