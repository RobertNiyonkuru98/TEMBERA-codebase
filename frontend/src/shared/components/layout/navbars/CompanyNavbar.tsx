import BaseNavbar from "./BaseNavbar";

function CompanyNavbar() {
  return (
    <BaseNavbar
      items={[
        { to: "/", label: "Home" },
        { to: "/profile", label: "Profile" },
        { to: "/company/itineraries", label: "Company Itineraries", emphasis: true },
      ]}
    />
  );
}

export default CompanyNavbar;
