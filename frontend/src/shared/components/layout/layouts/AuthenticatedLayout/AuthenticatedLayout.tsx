import { type ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui";
import AuthenticatedSidebar from "@/shared/components/layout/AuthenticatedSidebar";
import type { UserRole } from "@/shared/types";
import type { Lang } from "@/core/i18n";

type AuthenticatedLayoutProps = {
  role: UserRole;
  displayName: string;
  logout: () => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  children: ReactNode;
};

export function AuthenticatedLayout({
  role,
  displayName,
  logout,
  lang,
  setLang,
  children,
}: AuthenticatedLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <AuthenticatedSidebar
        role={role}
        displayName={displayName}
        onLogout={logout}
        lang={lang}
        onLangChange={setLang}
      />

      <SidebarInset className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-slate-950 px-4 py-3 text-center text-[11px] text-slate-400">
          © 2026 Tembera Travel Platform
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
