import { Link } from "react-router-dom";
import type { UserRole } from "../types";
import type { Lang } from "../i18n";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "./ui/menubar";
import { useTheme } from "../theme";
import { RoleSwitcher } from "./RoleSwitcher";

type SidebarLink = {
  to: string;
  label: string;
};

type AuthenticatedSidebarProps = {
  role: UserRole;
  displayName: string;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onLogout: () => void;
};

function linksByRole(role: UserRole): SidebarLink[] {
  if (role === "admin") {
    return [
      { to: "/admin/dashboard", label: "Dashboard" },
      { to: "/admin/bookings", label: "Admin Bookings" },
      { to: "/admin/users", label: "Admin Users" },
      { to: "/admin/companies", label: "Admin Companies" },
      { to: "/admin/companies/create", label: "Create Company" },
      { to: "/admin/itineraries", label: "Admin Itineraries" },
      { to: "/admin/itineraries/create", label: "Create Itinerary" },
      { to: "/profile", label: "Profile" },
    ];
  }

  if (role === "company") {
    return [
      { to: "/company/dashboard", label: "Dashboard" },
      { to: "/company/itineraries", label: "Company Itineraries" },
      { to: "/company/itineraries/create", label: "Create Itinerary" },
      { to: "/company/statistics", label: "Statistics" },
      { to: "/profile", label: "Profile" },
    ];
  }

  if (role === "user") {
    return [
      { to: "/", label: "Home" },
      { to: "/itineraries", label: "Itineraries" },
      { to: "/my-bookings", label: "My Bookings" },
      { to: "/bookings/new", label: "New Booking" },
      { to: "/profile", label: "Profile" },
    ];
  }

  return [
    { to: "/", label: "Home" },
    { to: "/itineraries", label: "Itineraries" },
    { to: "/visitor/showcase", label: "Why Tembera" },
    { to: "/profile", label: "Profile" },
  ];
}

function AuthenticatedSidebar({
  role,
  displayName,
  lang,
  onLangChange,
  onLogout,
}: AuthenticatedSidebarProps) {
  const links = linksByRole(role);
  const primaryLinks = links.slice(0, 4);
  const extraLinks = links.slice(4);
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <Sidebar className="border-sidebar-border md:border-r">
      <SidebarHeader className="gap-3 border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-emerald-500 px-2 py-1 text-sm font-semibold text-slate-950">
            TEMBERA
          </span>
          <span className="text-xs uppercase tracking-wide text-sidebar-foreground/70">
            {role} space
          </span>
        </div>
        <RoleSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-3 py-3">
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryLinks.map((link) => (
                <SidebarMenuItem key={link.to}>
                  <SidebarMenuButton asChild>
                    <Link to={link.to}>{link.label}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {extraLinks.length > 0 && (
          <SidebarGroup className="px-3 py-3">
            <SidebarGroupContent>
              <SidebarMenu>
                {extraLinks.map((link) => (
                  <SidebarMenuItem key={link.to}>
                    <SidebarMenuButton asChild>
                      <Link to={link.to}>{link.label}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="gap-3 border-t border-sidebar-border px-4 py-4">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>{displayName}</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={onLogout}>Logout</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>{lang.toUpperCase()}</MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                onClick={() => onLangChange("en")}
                disabled={lang === "en"}
              >
                English
              </MenubarItem>
              <MenubarItem
                onClick={() => onLangChange("fr")}
                disabled={lang === "fr"}
              >
                French
              </MenubarItem>
              <MenubarItem
                onClick={() => onLangChange("rw")}
                disabled={lang === "rw"}
              >
                Kinyarwanda
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Theme</MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                onClick={() => setTheme("light")}
                disabled={resolvedTheme === "light"}
              >
                Light
              </MenubarItem>
              <MenubarItem
                onClick={() => setTheme("dark")}
                disabled={resolvedTheme === "dark"}
              >
                Dark
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                onClick={() => setTheme("system")}
                disabled={theme === "system"}
              >
                System
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AuthenticatedSidebar;
