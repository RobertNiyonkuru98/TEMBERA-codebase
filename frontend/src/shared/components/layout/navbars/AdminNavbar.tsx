import BaseNavbar from "./BaseNavbar";

function AdminNavbar() {
  return (
    <BaseNavbar
      items={[
        { to: "/", label: "Home" },
        { to: "/admin/bookings", label: "Admin Bookings" },
        { to: "/admin/users", label: "Admin Users" },
        { to: "/profile", label: "Profile" },
        { to: "/admin/itineraries", label: "Admin Itineraries", emphasis: true },
      ]}
    />
  );
}

export default AdminNavbar;
