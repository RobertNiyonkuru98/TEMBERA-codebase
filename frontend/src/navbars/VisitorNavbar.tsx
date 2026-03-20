import { useI18n } from "../i18n";
import BaseNavbar from "./BaseNavbar";

type VisitorNavbarProps = {
  isAuthenticated?: boolean;
};

function VisitorNavbar({ isAuthenticated = false }: VisitorNavbarProps) {
  const { t } = useI18n();

  return (
    <BaseNavbar
      items={[
        { to: "/", label: t("nav.home") },
        { to: "/itineraries", label: t("nav.itineraries") },
        { to: "/login", label: t("nav.login") },
        ...(isAuthenticated ? [{ to: "/profile", label: "Profile" }] : []),
        { to: "/visitor/showcase", label: "Why Tembera", emphasis: true },
      ]}
    />
  );
}

export default VisitorNavbar;
