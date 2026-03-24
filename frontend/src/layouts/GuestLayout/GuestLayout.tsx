import { type ReactNode } from "react";
import GuestTopNav from "@/components/GuestTopNav";

type GuestLayoutProps = {
  heroTitle: string;
  children: ReactNode;
};

export function GuestLayout({ heroTitle, children }: GuestLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col">
      <GuestTopNav brandTitle={heroTitle} />

      <main className="flex-1 w-full">
        {children}
      </main>

      <footer className="mt-auto bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 w-full">
        <div className="px-4 py-3 text-center text-[11px] text-slate-600 dark:text-slate-400">
          © 2026 Tembera Travel Platform
        </div>
      </footer>
    </div>
  );
}
