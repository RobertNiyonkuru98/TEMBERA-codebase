import { Link } from "react-router-dom";
import { Globe, Menu, X, Sun, Moon, Monitor } from "lucide-react";
import { useState } from "react";
import { useI18n, type Lang } from "../i18n";
import { useTheme, type ThemeMode } from "../theme";

type GuestTopNavProps = {
  brandTitle: string;
};

function GuestTopNav({ brandTitle }: GuestTopNavProps) {
  const { lang, setLang, t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const languages: { code: Lang; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "rw", label: "Kinyarwanda", flag: "🇷🇼" },
  ];

  const currentLanguage = languages.find((l) => l.code === lang) || languages[0];

  const themes: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
    { mode: "light", label: t("theme.light"), icon: Sun },
    { mode: "dark", label: t("theme.dark"), icon: Moon },
    { mode: "system", label: t("theme.system"), icon: Monitor },
  ];

  const currentTheme = themes.find((th) => th.mode === theme) || themes[2];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800/50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl w-full shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50">
      <div className="mx-auto flex w-[95%] max-w-[1920px] items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-emerald-500 blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
            <span className="relative rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 px-3 py-2 text-base font-bold text-slate-950 shadow-lg">
              TEMBERA
            </span>
          </div>
          <span className="hidden text-base font-medium text-slate-600 dark:text-slate-300 lg:inline group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {brandTitle}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/itineraries"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
          >
            {t("nav.explore")}
          </Link>
          <Link
            to="/visitor/showcase"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
          >
            {t("nav.whyTembera")}
          </Link>
          
          {/* Theme Selector */}
          <div className="relative ml-2">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:border-emerald-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            >
              <currentTheme.icon className="h-4 w-4" />
            </button>
            
            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
                {themes.map((themeOption) => {
                  const Icon = themeOption.icon;
                  return (
                    <button
                      key={themeOption.mode}
                      onClick={() => {
                        setTheme(themeOption.mode);
                        setIsThemeMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        theme === themeOption.mode
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{themeOption.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:border-emerald-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.label}</span>
              <span className="sm:hidden">{currentLanguage.flag}</span>
            </button>
            
            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      setLang(language.code);
                      setIsLangMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                      lang === language.code
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span>{language.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          <Link
            to="/login"
            className="ml-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
          >
            {t("nav.signIn")}
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:shadow-emerald-400/30"
          >
            {t("nav.getStarted")}
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden rounded-lg p-2 text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-950/98 backdrop-blur-xl">
          <nav className="mx-auto w-[95%] max-w-[1920px] space-y-1 py-4">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/itineraries"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            >
              {t("nav.explore")}
            </Link>
            <Link
              to="/visitor/showcase"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            >
              {t("nav.whyTembera")}
            </Link>
            
            {/* Mobile Theme Selector */}
            <div className="space-y-1 border-t border-slate-200 dark:border-slate-800 pt-2 mt-2">
              <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">{t("nav.theme")}</p>
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                return (
                  <button
                    key={themeOption.mode}
                    onClick={() => {
                      setTheme(themeOption.mode);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                      theme === themeOption.mode
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{themeOption.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Language Selector */}
            <div className="space-y-1 border-t border-slate-800 pt-2 mt-2">
              <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{t("nav.language")}</p>
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    setLang(language.code);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                    lang === language.code
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              >
                {t("nav.signIn")}
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400"
              >
                {t("nav.getStarted")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default GuestTopNav;
