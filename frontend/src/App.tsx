import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useAuth } from "@/features/auth/AuthContext";
import { useI18n } from "@/core/i18n";
import { AuthenticatedLayout, GuestLayout } from "@/shared/components/layout/layouts";
import { AppRouter } from "@/core/routing";

function App() {
  const { user, activeRole, logout, initialize, isInitialized } = useAuth();
  const { lang, setLang, t } = useI18n();

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-300">Loading session...</p>
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        {user ? (
          <AuthenticatedLayout
            role={activeRole ?? user.role}
            displayName={user.name}
            logout={logout}
            lang={lang}
            setLang={setLang}
          >
            <AppRouter />
          </AuthenticatedLayout>
        ) : (
          <GuestLayout heroTitle={t("home.heroTitle")}>
            <AppRouter />
          </GuestLayout>
        )}
      </BrowserRouter>
      <Toaster position="top-right" theme="dark" expand richColors />
    </>
  );
}

export default App;