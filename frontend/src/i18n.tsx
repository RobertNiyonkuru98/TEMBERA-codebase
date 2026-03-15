import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "fr" | "rw";

type TranslationKey =
  | "nav.home"
  | "nav.itineraries"
  | "nav.myBookings"
  | "nav.newBooking"
  | "nav.login"
  | "nav.register"
  | "nav.logout"
  | "nav.languageLabel"
  | "home.badge"
  | "home.heroTitle"
  | "home.heroSubtitle"
  | "home.ctaExplore"
  | "home.ctaBookings"
  | "home.statsCompanies"
  | "home.statsItineraries"
  | "home.statsMockTitle"
  | "home.statsMockSubtitle"
  | "home.featuredTitle"
  | "home.featuredLink"
  | "itineraries.title"
  | "itineraries.subtitle"
  | "detail.tripInfo"
  | "detail.date"
  | "detail.location"
  | "detail.priceLabel"
  | "detail.company"
  | "detail.bookingsTitle"
  | "detail.noBookings"
  | "detail.addToBooking"
  | "auth.loginTitle"
  | "auth.loginSubtitle"
  | "auth.email"
  | "auth.phone"
  | "auth.password"
  | "auth.loginButton"
  | "auth.noAccount"
  | "auth.registerLink"
  | "auth.registerTitle"
  | "auth.registerSubtitle"
  | "auth.fullName"
  | "auth.registerButton"
  | "auth.haveAccount"
  | "auth.loginLink"
  | "bookings.title"
  | "bookings.subtitle"
  | "bookings.empty"
  | "bookings.itinerariesInBooking"
  | "booking.createTitle"
  | "booking.createSubtitle"
  | "booking.itineraryLabel"
  | "booking.noteLabel"
  | "booking.notePlaceholder"
  | "booking.groupCheckbox"
  | "booking.groupHelper"
  | "booking.groupMembers"
  | "booking.groupType.personal"
  | "booking.groupType.couple"
  | "booking.groupType.family"
  | "booking.groupType.other"
  | "booking.memberName"
  | "booking.memberPhone"
  | "booking.memberEmail"
  | "booking.memberId"
  | "booking.addMember"
  | "booking.submit";

const translations: Record<Lang, Record<TranslationKey, string>> = {
  en: {
    "nav.home": "Home",
    "nav.itineraries": "Itineraries",
    "nav.myBookings": "My Bookings",
    "nav.newBooking": "New Booking",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.logout": "Logout",
    "nav.languageLabel": "Language",
    "home.badge": "Travel & activity booking platform",
    "home.heroTitle": "Discover Rwanda with curated local experiences",
    "home.heroSubtitle":
      "Browse itineraries from trusted local companies, combine multiple experiences into one trip, and keep all your bookings in a single place.",
    "home.ctaExplore": "Explore itineraries",
    "home.ctaBookings": "View my bookings",
    "home.statsCompanies": "local companies",
    "home.statsItineraries": "curated itineraries",
    "home.statsMockTitle": "Mock environment",
    "home.statsMockSubtitle": "No real bookings created",
    "home.featuredTitle": "Featured itineraries",
    "home.featuredLink": "View all itineraries",
    "itineraries.title": "All itineraries",
    "itineraries.subtitle":
      "Browse all available activities and trips from local companies. This list is powered by in-memory mock data.",
    "detail.tripInfo": "Trip information",
    "detail.date": "Date",
    "detail.location": "Location",
    "detail.priceLabel": "Price per person (RWF)",
    "detail.company": "Company",
    "detail.bookingsTitle": "Bookings that include this itinerary",
    "detail.noBookings": "No mock bookings currently include this itinerary.",
    "detail.addToBooking": "(Mock) Add to booking",
    "auth.loginTitle": "Login (mock)",
    "auth.loginSubtitle":
      "Use any email from the mock dataset (for example alice@example.com) to sign in.",
    "auth.email": "Email",
    "auth.phone": "Phone number (optional)",
    "auth.password": "Password",
    "auth.loginButton": "Login",
    "auth.noAccount": "No account?",
    "auth.registerLink": "Register with mock data",
    "auth.registerTitle": "Register (mock)",
    "auth.registerSubtitle":
      "This creates a mock user only on the frontend and signs you in immediately.",
    "auth.fullName": "Full name",
    "auth.registerButton": "Create mock account",
    "auth.haveAccount": "Already have an account?",
    "auth.loginLink": "Login",
    "bookings.title": "My bookings (mock)",
    "bookings.subtitle":
      "Showing bookings for you from the mock data set. No real reservations are created.",
    "bookings.empty": "You have no bookings yet in the mock dataset.",
    "bookings.itinerariesInBooking": "Itineraries in this booking",
    "booking.createTitle": "Create a booking (mock)",
    "booking.createSubtitle":
      "Choose an itinerary, optionally mark this as a group trip, and provide group member details. All data stays in memory on the frontend.",
    "booking.itineraryLabel": "Itinerary",
    "booking.noteLabel": "Booking note (optional)",
    "booking.notePlaceholder":
      "Example: Friends weekend, 4 people, need vegetarian options...",
    "booking.groupCheckbox": "This is a group booking",
    "booking.groupHelper":
      "When enabled, you can select the type of group (2 people, couple, family, or others) and add each member's name, phone number, email, and ID.",
    "booking.groupMembers": "Group members",
    "booking.groupType.personal": "Personal (1 person)",
    "booking.groupType.couple": "Couple (2 people)",
    "booking.groupType.family": "Family",
    "booking.groupType.other": "Others / Group",
    "booking.memberName": "Full name",
    "booking.memberPhone": "Phone number",
    "booking.memberEmail": "Email",
    "booking.memberId": "National ID / Passport",
    "booking.addMember": "+ Add another member",
    "booking.submit": "Create mock booking",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.itineraries": "Itinéraires",
    "nav.myBookings": "Mes réservations",
    "nav.newBooking": "Nouvelle réservation",
    "nav.login": "Connexion",
    "nav.register": "Inscription",
    "nav.logout": "Déconnexion",
    "nav.languageLabel": "Langue",
    "home.badge": "Plateforme de réservation de voyages et d'activités",
    "home.heroTitle":
      "Découvrez le Rwanda avec des expériences locales organisées",
    "home.heroSubtitle":
      "Parcourez les itinéraires de sociétés locales de confiance, combinez plusieurs expériences en un seul voyage et gérez vos réservations au même endroit.",
    "home.ctaExplore": "Explorer les itinéraires",
    "home.ctaBookings": "Voir mes réservations",
    "home.statsCompanies": "entreprises locales",
    "home.statsItineraries": "itinéraires organisés",
    "home.statsMockTitle": "Environnement de démonstration",
    "home.statsMockSubtitle": "Aucune réservation réelle créée",
    "home.featuredTitle": "Itinéraires à la une",
    "home.featuredLink": "Voir tous les itinéraires",
    "itineraries.title": "Tous les itinéraires",
    "itineraries.subtitle":
      "Parcourez toutes les activités et tous les voyages proposés par les entreprises locales. Cette liste est alimentée par des données fictives.",
    "detail.tripInfo": "Informations sur le voyage",
    "detail.date": "Date",
    "detail.location": "Lieu",
    "detail.priceLabel": "Prix par personne (RWF)",
    "detail.company": "Entreprise",
    "detail.bookingsTitle":
      "Réservations qui incluent cet itinéraire",
    "detail.noBookings":
      "Aucune réservation fictive n'inclut actuellement cet itinéraire.",
    "detail.addToBooking": "(Démo) Ajouter à une réservation",
    "auth.loginTitle": "Connexion (démo)",
    "auth.loginSubtitle":
      "Utilisez n'importe quel email du jeu de données fictif (par exemple alice@example.com) pour vous connecter.",
    "auth.email": "Email",
    "auth.phone": "Numéro de téléphone (optionnel)",
    "auth.password": "Mot de passe",
    "auth.loginButton": "Connexion",
    "auth.noAccount": "Pas de compte ?",
    "auth.registerLink": "S'inscrire (données fictives)",
    "auth.registerTitle": "Inscription (démo)",
    "auth.registerSubtitle":
      "Crée un utilisateur fictif uniquement côté frontend et vous connecte immédiatement.",
    "auth.fullName": "Nom complet",
    "auth.registerButton": "Créer un compte fictif",
    "auth.haveAccount": "Vous avez déjà un compte ?",
    "auth.loginLink": "Connexion",
    "bookings.title": "Mes réservations (démo)",
    "bookings.subtitle":
      "Affichage de vos réservations à partir des données fictives. Aucune réservation réelle n'est créée.",
    "bookings.empty":
      "Vous n'avez encore aucune réservation dans les données fictives.",
    "bookings.itinerariesInBooking": "Itinéraires dans cette réservation",
    "booking.createTitle": "Créer une réservation (démo)",
    "booking.createSubtitle":
      "Choisissez un itinéraire, définissez éventuellement un voyage de groupe et ajoutez les détails des membres du groupe. Toutes les données restent en mémoire côté frontend.",
    "booking.itineraryLabel": "Itinéraire",
    "booking.noteLabel": "Note de réservation (facultatif)",
    "booking.notePlaceholder":
      "Exemple : Week‑end entre amis, 4 personnes, options végétariennes...",
    "booking.groupCheckbox": "Ceci est une réservation de groupe",
    "booking.groupHelper":
      "Une fois activé, vous pouvez choisir le type de groupe (2 personnes, couple, famille ou autres) et ajouter le nom, le téléphone, l'email et l'identifiant de chaque membre.",
    "booking.groupMembers": "Membres du groupe",
    "booking.groupType.personal": "Personnel (1 personne)",
    "booking.groupType.couple": "Couple (2 personnes)",
    "booking.groupType.family": "Famille",
    "booking.groupType.other": "Autres / Groupe",
    "booking.memberName": "Nom complet",
    "booking.memberPhone": "Numéro de téléphone",
    "booking.memberEmail": "Email",
    "booking.memberId": "Carte d'identité / Passeport",
    "booking.addMember": "+ Ajouter un membre",
    "booking.submit": "Créer une réservation fictive",
  },
  rw: {
    "nav.home": "Ahabanza",
    "nav.itineraries": "Ingendo",
    "nav.myBookings": "Amarezervasi yanjye",
    "nav.newBooking": "Rezervasi nshya",
    "nav.login": "Injira",
    "nav.register": "Iyandikishe",
    "nav.logout": "Sohoka",
    "nav.languageLabel": "Ururimi",
    "home.badge": "Urubuga rwo kubika ingendo n'ibikorwa",
    "home.heroTitle":
      "Menya u Rwanda binyuze mu ngendo zateguwe n'abaturage",
    "home.heroSubtitle":
      "Reba ingendo zateguwe n'amakompanyi y'imbere mu gihugu, uhuze ibikorwa bitandukanye mu rugendo rumwe, kandi ukurikire amarezervasi yawe hamwe.",
    "home.ctaExplore": "Reba ingendo",
    "home.ctaBookings": "Reba amarezervasi yanjye",
    "home.statsCompanies": "amakompanyi y'imbere mu gihugu",
    "home.statsItineraries": "ingendo zateguwe",
    "home.statsMockTitle": "Urubuga rwo kugerageza",
    "home.statsMockSubtitle": "Nta marezervasi nyayo akorwa",
    "home.featuredTitle": "Ingendo zigaragajwe",
    "home.featuredLink": "Reba ingendo zose",
    "itineraries.title": "Ingendo zose",
    "itineraries.subtitle":
      "Reba ingendo n'ibikorwa bitangwa n'amakompanyi y'imbere mu gihugu. Iyi lisiti ishingiye ku makuru yo kugerageza.",
    "detail.tripInfo": "Amakuru y'ingendo",
    "detail.date": "Itariki",
    "detail.location": "Aho igikorwa kibera",
    "detail.priceLabel": "Igiciro ku muntu (RWF)",
    "detail.company": "Kompanyi",
    "detail.bookingsTitle":
      "Amarezervasi arimo iyi ngendo",
    "detail.noBookings":
      "Nta rezervasi yo kugerageza irimo iyi ngendo ubu.",
    "detail.addToBooking": "(Kugerageza) Ongeraho muri rezervasi",
    "auth.loginTitle": "Kwinjira (kugerageza)",
    "auth.loginSubtitle":
      "Koresha email iri mu makuru yo kugerageza (urugero alice@example.com) kugira ngo winjire.",
    "auth.email": "Email",
    "auth.phone": "Numero ya telefoni (si ngombwa)",
    "auth.password": "Ijambobanga",
    "auth.loginButton": "Injira",
    "auth.noAccount": "Nta konti ufite?",
    "auth.registerLink": "Iyandikishe ukoresheje amakuru yo kugerageza",
    "auth.registerTitle": "Kwiyandikisha (kugerageza)",
    "auth.registerSubtitle":
      "Hagena umukoresha wo kugerageza gusa ku ruhande rwa frontend, akinjira ako kanya.",
    "auth.fullName": "Amazina yuzuye",
    "auth.registerButton": "Hanga konti yo kugerageza",
    "auth.haveAccount": "Usanzwe ufite konti?",
    "auth.loginLink": "Injira",
    "bookings.title": "Amarezervasi yanjye (kugerageza)",
    "bookings.subtitle":
      "Urebye amarezervasi yawe akomoka ku makuru yo kugerageza. Nta marezervasi nyayo akorwa.",
    "bookings.empty":
      "Ntabwo uragira rezervasi mu makuru yo kugerageza.",
    "bookings.itinerariesInBooking": "Ingendo ziri muri iyi rezervasi",
    "booking.createTitle": "Kora rezervasi (kugerageza)",
    "booking.createSubtitle":
      "Hitamo urugendo, niba ari urwa itsinda ubishyireho, hanyuma utange amazina n'amakuru y'abagize itsinda. Amakuru yose aguma muri frontend.",
    "booking.itineraryLabel": "Urugendo",
    "booking.noteLabel": "Ibisobanuro bya rezervasi (si ngombwa)",
    "booking.notePlaceholder":
      "Urugero: Weekend n'inshuti, abantu 4, dukeneye indyo zidafite inyama...",
    "booking.groupCheckbox": "Iyi ni rezervasi y'itsinda",
    "booking.groupHelper":
      "Nuyikanda, ushobora guhitamo ubwoko bw'itsinda (abantu 2, abashakanye, umuryango cyangwa abandi) no kongeramo amazina, telefoni, email n'indangamuntu ya buri muntu.",
    "booking.groupMembers": "Abagize itsinda",
    "booking.groupType.personal": "Umuntu umwe",
    "booking.groupType.couple": "Abashakanye (abantu 2)",
    "booking.groupType.family": "Umuryango",
    "booking.groupType.other": "Abandi / Itsinda",
    "booking.memberName": "Amazina yuzuye",
    "booking.memberPhone": "Numero ya telefoni",
    "booking.memberEmail": "Email",
    "booking.memberId": "Indangamuntu / Pasiporo",
    "booking.addMember": "+ Ongeraho undi muntu",
    "booking.submit": "Kora rezervasi yo kugerageza",
  },
};

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const LANG_STORAGE_KEY = "tembera_lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === "fr" || saved === "rw" || saved === "en") return saved;
    return "en";
  });

  const setLang = (next: Lang) => {
    window.localStorage.setItem(LANG_STORAGE_KEY, next);
    setLangState(next);
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      t: (key: TranslationKey) => translations[lang][key] ?? key,
    }),
    [lang],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

