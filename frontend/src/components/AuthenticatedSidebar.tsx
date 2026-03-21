/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useLocation } from "react-router-dom";
import type { UserRole } from "../types";
import type { Lang } from "../i18n";
import { useI18n } from "../i18n";
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
import { 
  Home, 
  Map, 
  Calendar, 
  PlusCircle, 
  User, 
  LayoutDashboard, 
  Building2, 
  Users, 
  BarChart3,
  LogOut,
  Globe,
  Sun,
  Moon,
  Monitor
} from "lucide-react";

type SidebarLink = {
  to: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type AuthenticatedSidebarProps = {
  role: UserRole;
  displayName: string;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onLogout: () => void;
};

function linksByRole(role: UserRole, t: (key: any) => string): SidebarLink[] {
  if (role === "admin") {
    return [
      { to: "/admin/dashboard", label: t("admin.dashboardTitle"), icon: LayoutDashboard },
      { to: "/admin/bookings", label: t("bookings.title"), icon: Calendar },
      { to: "/admin/users", label: t("admin.usersTitle"), icon: Users },
      { to: "/admin/companies", label: t("admin.totalCompanies"), icon: Building2 },
      { to: "/admin/companies/create", label: t("company.createButton"), icon: PlusCircle },
      { to: "/admin/itineraries", label: t("admin.totalItineraries"), icon: Map },
      { to: "/admin/itineraries/create", label: t("company.createItinerary"), icon: PlusCircle },
      { to: "/profile", label: t("nav.profile"), icon: User },
    ];
  }

  if (role === "company") {
    return [
      { to: "/company/dashboard", label: t("admin.dashboardTitle"), icon: LayoutDashboard },
      { to: "/company/itineraries", label: t("nav.companyItineraries"), icon: Map },
      { to: "/company/itineraries/create", label: t("company.createItinerary"), icon: PlusCircle },
      { to: "/company/statistics", label: "Statistics", icon: BarChart3 },
      { to: "/profile", label: t("nav.profile"), icon: User },
    ];
  }

  if (role === "user") {
    return [
      { to: "/", label: t("nav.home"), icon: Home },
      { to: "/itineraries", label: t("nav.itineraries"), icon: Map },
      { to: "/my-bookings", label: t("nav.myBookings"), icon: Calendar },
      { to: "/bookings/new", label: t("nav.newBooking"), icon: PlusCircle },
      { to: "/profile", label: t("nav.profile"), icon: User },
    ];
  }

  return [
    { to: "/", label: t("nav.home"), icon: Home },
    { to: "/itineraries", label: t("nav.itineraries"), icon: Map },
    { to: "/visitor/showcase", label: t("nav.whyTembera"), icon: BarChart3 },
    { to: "/profile", label: t("nav.profile"), icon: User },
  ];
}

function AuthenticatedSidebar({
  role,
  displayName,
  lang,
  onLangChange,
  onLogout,
}: AuthenticatedSidebarProps) {
  const { t } = useI18n();
  const location = useLocation();
  const links = linksByRole(role, t);
  const primaryLinks = links.slice(0, 4);
  const extraLinks = links.slice(4);
  const { theme, resolvedTheme, setTheme } = useTheme();

  // Helper function to check if a link is active
  const isLinkActive = (linkPath: string) => {
    // Exact match
    if (location.pathname === linkPath) {
      return true;
    }
    
    // For create/new routes, only match exactly - don't activate parent list routes
    if (linkPath.includes('/create') || linkPath.includes('/new')) {
      return false;
    }
    
    // For list/index routes, don't activate if we're on a create/new page
    if (location.pathname.includes('/create') || location.pathname.includes('/new')) {
      return false;
    }
    
    // Allow nested route matching for detail pages (e.g., /itineraries/:id)
    // but not for create/new pages
    return location.pathname.startsWith(linkPath + '/');
  };

  const getThemeIcon = () => {
    if (resolvedTheme === "light") return <Sun className="h-4 w-4" />;
    if (resolvedTheme === "dark") return <Moon className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <Sidebar className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <SidebarHeader className="gap-4 border-b border-slate-200 dark:border-slate-800 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-emerald-500 blur-md opacity-50" />
            <span className="relative rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 px-3 py-2 text-sm font-bold text-slate-950 shadow-lg">
              TEMBERA
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {role === 'admin' ? 'Admin' : role === 'company' ? 'Company' : role === 'user' ? 'Traveler' : 'Visitor'} Portal
            </span>
          </div>
        </div>
        <RoleSwitcher />
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {primaryLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isLinkActive(link.to);
                return (
                  <SidebarMenuItem key={link.to}>
                    <SidebarMenuButton asChild className="group">
                      <Link 
                        to={link.to}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:shadow-sm ${
                          isActive
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 shadow-sm border-l-4 border-emerald-600 dark:border-emerald-400"
                            : "text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400"
                        }`}
                      >
                        {Icon && <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                          isActive ? "text-emerald-600 dark:text-emerald-400" : ""
                        }`} />}
                        <span className={isActive ? "font-semibold" : ""}>{link.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {extraLinks.length > 0 && (
          <SidebarGroup className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {extraLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = isLinkActive(link.to);
                  return (
                    <SidebarMenuItem key={link.to}>
                      <SidebarMenuButton asChild className="group">
                        <Link 
                          to={link.to}
                          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:shadow-sm ${
                            isActive
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 shadow-sm border-l-4 border-emerald-600 dark:border-emerald-400"
                              : "text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400"
                          }`}
                        >
                          {Icon && <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                            isActive ? "text-emerald-600 dark:text-emerald-400" : ""
                          }`} />}
                          <span className={isActive ? "font-semibold" : ""}>{link.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 dark:border-slate-800 bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-900 px-3 py-3">
        <div className="space-y-2">
          {/* User Profile Section */}
          <div className="rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 text-white font-semibold text-sm shadow-md">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{displayName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{role}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 transition-all hover:bg-red-100 dark:hover:bg-red-900/40 hover:shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              {t("nav.logout")}
            </button>
          </div>

          {/* Settings Section */}
          <div className="rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 shadow-sm space-y-1">
            {/* Language Selector */}
            <Menubar className="border-0 bg-transparent p-0 h-auto">
              <MenubarMenu>
                <MenubarTrigger className="w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-900">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">Language</span>
                  </div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{lang.toUpperCase()}</span>
                </MenubarTrigger>
                <MenubarContent className="min-w-[180px]">
                  <MenubarItem
                    onClick={() => onLangChange("en")}
                    disabled={lang === "en"}
                    className="gap-2"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>English</span>
                      {lang === "en" && <span className="text-emerald-500">✓</span>}
                    </div>
                  </MenubarItem>
                  <MenubarItem
                    onClick={() => onLangChange("fr")}
                    disabled={lang === "fr"}
                    className="gap-2"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>Français</span>
                      {lang === "fr" && <span className="text-emerald-500">✓</span>}
                    </div>
                  </MenubarItem>
                  <MenubarItem
                    onClick={() => onLangChange("rw")}
                    disabled={lang === "rw"}
                    className="gap-2"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>Kinyarwanda</span>
                      {lang === "rw" && <span className="text-emerald-500">✓</span>}
                    </div>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>

            {/* Theme Selector */}
            <Menubar className="border-0 bg-transparent p-0 h-auto">
              <MenubarMenu>
                <MenubarTrigger className="w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-900">
                  <div className="flex items-center gap-2">
                    {getThemeIcon()}
                    <span className="text-slate-600 dark:text-slate-400">Theme</span>
                  </div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">{resolvedTheme}</span>
                </MenubarTrigger>
                <MenubarContent className="min-w-[180px]">
                  <MenubarItem
                    onClick={() => setTheme("light")}
                    disabled={resolvedTheme === "light"}
                    className="gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    <div className="flex items-center justify-between w-full">
                      <span>{t("theme.light")}</span>
                      {resolvedTheme === "light" && <span className="text-emerald-500">✓</span>}
                    </div>
                  </MenubarItem>
                  <MenubarItem
                    onClick={() => setTheme("dark")}
                    disabled={resolvedTheme === "dark"}
                    className="gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    <div className="flex items-center justify-between w-full">
                      <span>{t("theme.dark")}</span>
                      {resolvedTheme === "dark" && <span className="text-emerald-500">✓</span>}
                    </div>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem
                    onClick={() => setTheme("system")}
                    disabled={theme === "system"}
                    className="gap-2"
                  >
                    <Monitor className="h-4 w-4" />
                    <div className="flex items-center justify-between w-full">
                      <span>{t("theme.system")}</span>
                      {theme === "system" && <span className="text-emerald-500">✓</span>}
                    </div>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AuthenticatedSidebar;
