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
  | "auth.phoneNumber"
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
  | "booking.submit"
  | "nav.explore"
  | "nav.whyTembera"
  | "nav.signIn"
  | "nav.getStarted"
  | "nav.language"
  | "nav.theme"
  | "theme.light"
  | "theme.dark"
  | "theme.system"
  | "home.heroMainTitle"
  | "home.heroMainSubtitle"
  | "home.heroBadge"
  | "home.exploreExperiences"
  | "home.getStarted"
  | "home.scrollToExplore"
  | "home.popularDestinations"
  | "home.popularDestinationsSubtitle"
  | "home.destinationVolcanoes"
  | "home.destinationKivu"
  | "home.destinationNyungwe"
  | "home.destinationAkagera"
  | "home.tagGorillaTrekking"
  | "home.tagBeachRelaxation"
  | "home.tagCanopyWalks"
  | "home.tagSafariAdventures"
  | "home.statsTourOperators"
  | "home.statsExperiences"
  | "home.statsSupport"
  | "home.statsLocalExpertise"
  | "home.howItWorks"
  | "home.howItWorksSubtitle"
  | "home.stepExplore"
  | "home.stepExploreDesc"
  | "home.stepChoose"
  | "home.stepChooseDesc"
  | "home.stepBook"
  | "home.stepBookDesc"
  | "home.stepExperience"
  | "home.stepExperienceDesc"
  | "home.featuredExperiences"
  | "home.featuredExperiencesSubtitle"
  | "home.viewAll"
  | "home.ctaTitle"
  | "home.ctaSubtitle"
  | "home.signUpNow"
  | "home.browseExperiences"
  | "auth.welcomeBack"
  | "auth.continueAdventure"
  | "auth.continueAdventureDesc"
  | "auth.startJourney"
  | "auth.discoverRwanda"
  | "auth.discoverRwandaDesc"
  | "auth.or"
  | "itineraries.pageTitle"
  | "itineraries.pageSubtitle"
  | "itineraries.loading"
  | "itineraries.noResults"
  | "itineraries.error"
  | "itineraries.registered"
  | "itineraries.loginRequired"
  | "itineraries.filterAll"
  | "itineraries.searchPlaceholder"
  | "detail.goBack"
  | "detail.notFound"
  | "detail.loadingDetails"
  | "detail.attendButton"
  | "detail.attending"
  | "detail.bookingNumber"
  | "detail.createdOn"
  | "detail.by"
  | "card.by"
  | "card.attend"
  | "card.attending"
  | "showcase.title"
  | "showcase.subtitle"
  | "showcase.feature1"
  | "showcase.feature2"
  | "showcase.feature3"
  | "showcase.whyChooseUs"
  | "showcase.whySubtitle"
  | "showcase.reason1Title"
  | "showcase.reason1Desc"
  | "showcase.reason2Title"
  | "showcase.reason2Desc"
  | "showcase.reason3Title"
  | "showcase.reason3Desc"
  | "showcase.ctaTitle"
  | "showcase.ctaSubtitle"
  | "showcase.ctaButton"
  | "nav.profile"
  | "nav.companyItineraries"
  | "profile.title"
  | "profile.subtitle"
  | "profile.accountDetails"
  | "profile.userId"
  | "profile.role"
  | "profile.updateProfile"
  | "profile.fullName"
  | "profile.phoneNumber"
  | "profile.saveChanges"
  | "profile.saving"
  | "profile.dangerZone"
  | "profile.deleteAccount"
  | "profile.deleteWarning"
  | "profile.deleting"
  | "profile.updateSuccess"
  | "company.registerTitle"
  | "company.registerSubtitle"
  | "company.setupRequired"
  | "company.setupMessage"
  | "company.name"
  | "company.contact"
  | "company.description"
  | "company.creating"
  | "company.createButton"
  | "company.namePlaceholder"
  | "company.contactPlaceholder"
  | "company.descriptionPlaceholder"
  | "company.createItineraryTitle"
  | "company.createItinerarySubtitle"
  | "company.itineraryTitle"
  | "company.activity"
  | "company.location"
  | "company.date"
  | "company.price"
  | "company.submitting"
  | "company.createItinerary"
  | "company.titlePlaceholder"
  | "company.activityPlaceholder"
  | "company.locationPlaceholder"
  | "company.descriptionPlaceholder2"
  | "company.pricePlaceholder"
  | "admin.dashboardTitle"
  | "admin.dashboardSubtitle"
  | "admin.totalUsers"
  | "admin.totalCompanies"
  | "admin.totalItineraries"
  | "admin.totalRegistrations"
  | "admin.loading"
  | "admin.usersTitle"
  | "admin.usersSubtitle"
  | "admin.name"
  | "admin.email"
  | "admin.status"
  | "admin.phone"
  | "admin.role"
  | "admin.createdAt"
  | "admin.active"
  | "bookings.title"
  | "bookings.subtitle"
  | "bookings.myBookings"
  | "bookings.noBookings"
  | "bookings.loading"
  | "bookings.edit"
  | "bookings.save"
  | "bookings.cancel"
  | "bookings.delete"
  | "bookings.description"
  | "bookings.date"
  | "bookings.status"
  | "bookings.members"
  | "bookings.addMember"
  | "bookings.removeMember"
  | "bookings.memberName"
  | "bookings.memberEmail"
  | "bookings.memberPhone"
  | "bookings.saving"
  | "bookings.deleting"
  | "bookings.deleteConfirm"
  | "bookings.included"
  | "newBooking.title"
  | "newBooking.subtitle"
  | "newBooking.selectItinerary"
  | "newBooking.note"
  | "newBooking.notePlaceholder"
  | "newBooking.isGroup"
  | "newBooking.groupHelper"
  | "newBooking.groupType"
  | "newBooking.groupMembers"
  | "newBooking.memberNationalId"
  | "newBooking.addMember"
  | "newBooking.remove"
  | "newBooking.submit"
  | "newBooking.submitting"
  | "newBooking.personal"
  | "newBooking.couple"
  | "newBooking.family"
  | "newBooking.other"
  | "company.dashboard.title"
  | "company.dashboard.subtitle"
  | "company.dashboard.totalItineraries"
  | "company.dashboard.totalAttendees"
  | "company.dashboard.upcomingEvents"
  | "company.dashboard.totalRevenue"
  | "company.dashboard.upcomingItineraries"
  | "company.dashboard.viewAll"
  | "company.dashboard.noUpcoming"
  | "company.dashboard.attendees"
  | "company.dashboard.view"
  | "company.register.title"
  | "company.register.subtitle"
  | "company.register.setupRequired"
  | "company.register.setupMessage"
  | "company.register.companyName"
  | "company.register.companyNamePlaceholder"
  | "company.register.contact"
  | "company.register.contactPlaceholder"
  | "company.register.description"
  | "company.register.descriptionPlaceholder"
  | "company.register.creating"
  | "company.register.createButton"
  | "company.register.success"
  | "company.register.loginRequired"
  | "company.register.nameRequired"
  | "company.createItinerary.title"
  | "company.createItinerary.subtitle"
  | "company.createItinerary.companyRequired"
  | "company.createItinerary.companyRequiredMessage"
  | "company.createItinerary.createCompany"
  | "company.createItinerary.itineraryTitle"
  | "company.createItinerary.titlePlaceholder"
  | "company.createItinerary.details"
  | "company.createItinerary.activity"
  | "company.createItinerary.activityPlaceholder"
  | "company.createItinerary.location"
  | "company.createItinerary.locationPlaceholder"
  | "company.createItinerary.schedule"
  | "company.createItinerary.date"
  | "company.createItinerary.price"
  | "company.createItinerary.description"
  | "company.createItinerary.descriptionPlaceholder"
  | "company.createItinerary.creating"
  | "company.createItinerary.createButton"
  | "company.createItinerary.success"
  | "company.createItinerary.noCompany"
  | "company.createItinerary.requiredFields"
  | "company.createItinerary.invalidPrice"
  | "company.manageImages.title"
  | "company.manageImages.subtitle"
  | "company.manageImages.backToItineraries"
  | "company.manageImages.uploadTitle"
  | "company.manageImages.uploadSubtitle"
  | "company.manageImages.currentImages"
  | "company.manageImages.noImages"
  | "company.manageImages.noImagesHint"
  | "company.manageImages.uploadButton"
  | "company.manageImages.uploading"
  | "company.manageImages.uploadSuccess"
  | "company.manageImages.uploadError"
  | "company.manageImages.photoCount"
  | "company.manageImages.notFound"
  | "company.manageImages.loading";

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
    "home.statsMockTitle": "environment",
    "home.statsMockSubtitle": "No real bookings created",
    "home.featuredTitle": "Featured itineraries",
    "home.featuredLink": "View all itineraries",
    "itineraries.title": "All itineraries",
    "itineraries.subtitle":
      "Browse all available activities and trips from local companies.",
    "detail.tripInfo": "Trip information",
    "detail.date": "Date",
    "detail.location": "Location",
    "detail.priceLabel": "Price per person (RWF)",
    "detail.company": "Company",
    "detail.bookingsTitle": "Bookings that include this itinerary",
    "detail.noBookings": "No  bookings currently include this itinerary.",
    "detail.addToBooking": "Add to booking",
    "auth.loginTitle": "Login",
    "auth.loginSubtitle":
      "Use email (for example alice@example.com) to sign in.",
    "auth.email": "Email",
    "auth.phone": "Phone number (optional)",
    "auth.phoneNumber": "Phone Number",
    "auth.password": "Password",
    "auth.loginButton": "Login",
    "auth.noAccount": "No account?",
    "auth.registerLink": "Register with  data",
    "auth.registerTitle": "Register",
    "auth.registerSubtitle":
      "This creates a  user only on the frontend and signs you in immediately.",
    "auth.fullName": "Full name",
    "auth.registerButton": "Create account",
    "auth.haveAccount": "Already have an account?",
    "auth.loginLink": "Login",
    "bookings.title": "My bookings",
    "bookings.subtitle":
      "Showing bookings for you from the  data set. No real reservations are created.",
    "bookings.empty": "You have no bookings yet in the  dataset.",
    "bookings.itinerariesInBooking": "Itineraries in this booking",
    "booking.createTitle": "Create a booking",
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
    "booking.submit": "Create  booking",
    "nav.explore": "Explore",
    "nav.whyTembera": "Why Tembera",
    "nav.signIn": "Sign In",
    "nav.getStarted": "Get Started",
    "nav.language": "Language",
    "nav.theme": "Theme",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",
    "home.heroMainTitle": "Experience the Land of a Thousand Hills",
    "home.heroMainSubtitle": "Book authentic local experiences, connect with trusted tour operators, and create memories that last a lifetime.",
    "home.heroBadge": "Discover Rwanda's Hidden Gems",
    "home.exploreExperiences": "Explore Experiences",
    "home.getStarted": "Get Started",
    "home.scrollToExplore": "Scroll to explore",
    "home.popularDestinations": "Popular Destinations",
    "home.popularDestinationsSubtitle": "Explore Rwanda's most breathtaking locations",
    "home.destinationVolcanoes": "Volcanoes National Park",
    "home.destinationKivu": "Lake Kivu",
    "home.destinationNyungwe": "Nyungwe Forest",
    "home.destinationAkagera": "Akagera National Park",
    "home.tagGorillaTrekking": "Gorilla Trekking",
    "home.tagBeachRelaxation": "Beach & Relaxation",
    "home.tagCanopyWalks": "Canopy Walks",
    "home.tagSafariAdventures": "Safari Adventures",
    "home.statsTourOperators": "Trusted Tour Operators",
    "home.statsExperiences": "Unique Experiences",
    "home.statsSupport": "Customer Support",
    "home.statsLocalExpertise": "Local Expertise",
    "home.howItWorks": "How It Works",
    "home.howItWorksSubtitle": "Your journey to unforgettable experiences in 4 simple steps",
    "home.stepExplore": "Explore",
    "home.stepExploreDesc": "Browse curated Rwanda experiences",
    "home.stepChoose": "Choose",
    "home.stepChooseDesc": "Select your perfect adventure",
    "home.stepBook": "Book",
    "home.stepBookDesc": "Secure your spot instantly",
    "home.stepExperience": "Experience",
    "home.stepExperienceDesc": "Create unforgettable memories",
    "home.featuredExperiences": "Featured Experiences",
    "home.featuredExperiencesSubtitle": "Handpicked adventures just for you",
    "home.viewAll": "View All",
    "home.ctaTitle": "Ready to Start Your Adventure?",
    "home.ctaSubtitle": "Join thousands of travelers discovering Rwanda's beauty",
    "home.signUpNow": "Sign Up Now",
    "home.browseExperiences": "Browse All Experiences",
    "auth.welcomeBack": "Welcome Back",
    "auth.continueAdventure": "Continue Your Adventure",
    "auth.continueAdventureDesc": "Sign in to access your bookings and discover new experiences in Rwanda.",
    "auth.startJourney": "Start Your Journey",
    "auth.discoverRwanda": "Discover Rwanda's Hidden Gems",
    "auth.discoverRwandaDesc": "Join thousands of travelers exploring the land of a thousand hills.",
    "auth.or": "or",
    "itineraries.pageTitle": "Explore Experiences",
    "itineraries.pageSubtitle": "Discover amazing adventures and activities across Rwanda",
    "itineraries.loading": "Loading experiences...",
    "itineraries.noResults": "No experiences found.",
    "itineraries.error": "Failed to load experiences",
    "itineraries.registered": "Successfully registered!",
    "itineraries.loginRequired": "Please login to register for an experience.",
    "itineraries.filterAll": "All Experiences",
    "itineraries.searchPlaceholder": "Search experiences...",
    "detail.goBack": "Go back",
    "detail.notFound": "The requested experience could not be found.",
    "detail.loadingDetails": "Loading experience details...",
    "detail.attendButton": "Book Now",
    "detail.attending": "Booking...",
    "detail.bookingNumber": "Booking",
    "detail.createdOn": "Created on",
    "detail.by": "By",
    "card.by": "by",
    "card.attend": "Book Now",
    "card.attending": "Booking...",
    "showcase.title": "Why Choose Tembera",
    "showcase.subtitle": "Your trusted partner for unforgettable Rwanda experiences",
    "showcase.feature1": "Curated local experiences from verified tour operators",
    "showcase.feature2": "Secure booking platform with 24/7 customer support",
    "showcase.feature3": "Authentic Rwanda adventures at competitive prices",
    "showcase.whyChooseUs": "What Makes Us Different",
    "showcase.whySubtitle": "Experience Rwanda like never before",
    "showcase.reason1Title": "Local Expertise",
    "showcase.reason1Desc": "Work directly with Rwanda's best tour operators who know every hidden gem",
    "showcase.reason2Title": "Verified Quality",
    "showcase.reason2Desc": "All experiences are vetted and reviewed by real travelers",
    "showcase.reason3Title": "Best Prices",
    "showcase.reason3Desc": "Direct booking means no middleman fees - just great value",
    "showcase.ctaTitle": "Ready to Explore Rwanda?",
    "showcase.ctaSubtitle": "Join thousands of travelers discovering the land of a thousand hills",
    "showcase.ctaButton": "Browse Experiences",
    "nav.profile": "Profile",
    "nav.companyItineraries": "Company Itineraries",
    "profile.title": "Profile",
    "profile.subtitle": "Manage your personal information and account",
    "profile.accountDetails": "Account Details",
    "profile.userId": "User ID",
    "profile.role": "Role",
    "profile.updateProfile": "Update Profile",
    "profile.fullName": "Full Name",
    "profile.phoneNumber": "Phone Number",
    "profile.saveChanges": "Save Changes",
    "profile.saving": "Saving...",
    "profile.dangerZone": "Danger Zone",
    "profile.deleteAccount": "Delete Account",
    "profile.deleteWarning": "Deleting your account is irreversible and removes your access",
    "profile.deleting": "Processing...",
    "profile.updateSuccess": "Profile updated successfully",
    "company.registerTitle": "Register Your Company",
    "company.registerSubtitle": "You need to register a company to continue",
    "company.setupRequired": "Company Setup Required",
    "company.setupMessage": "Your company role is active, but your account has no company profile yet. Create one to unlock your workspace",
    "company.name": "Company Name",
    "company.contact": "Contact",
    "company.description": "Description",
    "company.creating": "Creating...",
    "company.createButton": "Create Company",
    "company.namePlaceholder": "e.g. Lake Kivu Tours",
    "company.contactPlaceholder": "Phone or email",
    "company.descriptionPlaceholder": "Describe your company and services",
    "company.createItineraryTitle": "Create Your First Experience",
    "company.createItinerarySubtitle": "Share your unique Rwanda experience with travelers",
    "company.itineraryTitle": "Experience Title",
    "company.activity": "Activity Type",
    "company.location": "Location",
    "company.date": "Date",
    "company.price": "Price (RWF)",
    "company.submitting": "Creating...",
    "company.createItinerary": "Create Experience",
    "company.titlePlaceholder": "e.g. Gorilla Trekking Adventure",
    "company.activityPlaceholder": "e.g. Wildlife, Culture, Adventure",
    "company.locationPlaceholder": "e.g. Volcanoes National Park",
    "company.descriptionPlaceholder2": "Describe what makes this experience special",
    "company.pricePlaceholder": "Price per person",
    "admin.dashboardTitle": "Admin Dashboard",
    "admin.dashboardSubtitle": "Platform-wide statistics and activity overview",
    "admin.totalUsers": "Total Users",
    "admin.totalCompanies": "Total Companies",
    "admin.totalItineraries": "Total Experiences",
    "admin.totalRegistrations": "Total Registrations",
    "admin.loading": "Loading dashboard...",
    "admin.usersTitle": "All Users",
    "admin.usersSubtitle": "All registered users in the system",
    "admin.name": "Name",
    "admin.email": "Email",
    "admin.status": "Status",
    "admin.phone": "Phone",
    "admin.role": "Role",
    "admin.createdAt": "Created At",
    "admin.active": "Active",
    "bookings.myBookings": "Your Bookings",
    "bookings.noBookings": "You haven't made any bookings yet",
    "bookings.loading": "Loading bookings...",
    "bookings.edit": "Edit",
    "bookings.save": "Save",
    "bookings.cancel": "Cancel",
    "bookings.delete": "Delete",
    "bookings.description": "Description",
    "bookings.date": "Date",
    "bookings.status": "Status",
    "bookings.members": "Group Members",
    "bookings.addMember": "Add Member",
    "bookings.removeMember": "Remove",
    "bookings.memberName": "Name",
    "bookings.memberEmail": "Email",
    "bookings.memberPhone": "Phone",
    "bookings.saving": "Saving...",
    "bookings.deleting": "Deleting...",
    "bookings.deleteConfirm": "Are you sure you want to delete this booking?",
    "bookings.included": "Included Experiences",
    "newBooking.title": "Create New Booking",
    "newBooking.subtitle": "Book your next Rwanda adventure",
    "newBooking.selectItinerary": "Select Experience",
    "newBooking.note": "Booking Note",
    "newBooking.notePlaceholder": "Add any special requests or notes",
    "newBooking.isGroup": "Group Booking",
    "newBooking.groupHelper": "Check this if you're booking for multiple people",
    "newBooking.groupType": "Group Type",
    "newBooking.groupMembers": "Group Members",
    "newBooking.memberNationalId": "National ID",
    "newBooking.addMember": "Add Member",
    "newBooking.remove": "Remove",
    "newBooking.submit": "Create Booking",
    "newBooking.submitting": "Creating...",
    "newBooking.personal": "Personal",
    "newBooking.couple": "Couple",
    "newBooking.family": "Family",
    "newBooking.other": "Other",
    "company.dashboard.title": "Company Dashboard",
    "company.dashboard.subtitle": "Overview of your business performance and upcoming events",
    "company.dashboard.totalItineraries": "Total Experiences",
    "company.dashboard.totalAttendees": "Total Attendees",
    "company.dashboard.upcomingEvents": "Upcoming Events",
    "company.dashboard.totalRevenue": "Total Revenue",
    "company.dashboard.upcomingItineraries": "Upcoming Experiences",
    "company.dashboard.viewAll": "View All",
    "company.dashboard.noUpcoming": "No upcoming experiences scheduled",
    "company.dashboard.attendees": "Attendees",
    "company.dashboard.view": "View Details",
    "company.register.title": "Register Your Company",
    "company.register.subtitle": "Create your company profile to start offering experiences",
    "company.register.setupRequired": "Company Setup Required",
    "company.register.setupMessage": "Your company role is active, but you need to create a company profile to continue",
    "company.register.companyName": "Company Name",
    "company.register.companyNamePlaceholder": "e.g. Lake Kivu Adventures",
    "company.register.contact": "Contact Information",
    "company.register.contactPlaceholder": "Phone or email",
    "company.register.description": "Company Description",
    "company.register.descriptionPlaceholder": "Tell travelers about your company and what makes you unique",
    "company.register.creating": "Creating Company...",
    "company.register.createButton": "Create Company",
    "company.register.success": "Company registered successfully!",
    "company.register.loginRequired": "You must be logged in to register a company",
    "company.register.nameRequired": "Company name is required",
    "company.createItinerary.title": "Create New Experience",
    "company.createItinerary.subtitle": "Share your unique Rwanda experience with travelers worldwide",
    "company.createItinerary.companyRequired": "Company Profile Required",
    "company.createItinerary.companyRequiredMessage": "You need to register a company before creating experiences",
    "company.createItinerary.createCompany": "Register Company",
    "company.createItinerary.itineraryTitle": "Experience Title",
    "company.createItinerary.titlePlaceholder": "e.g. Gorilla Trekking Adventure in Volcanoes Park",
    "company.createItinerary.details": "Experience Details",
    "company.createItinerary.activity": "Activity Type",
    "company.createItinerary.activityPlaceholder": "e.g. Wildlife, Culture, Adventure",
    "company.createItinerary.location": "Location",
    "company.createItinerary.locationPlaceholder": "e.g. Volcanoes National Park",
    "company.createItinerary.schedule": "Schedule & Pricing",
    "company.createItinerary.date": "Date",
    "company.createItinerary.price": "Price per Person",
    "company.createItinerary.description": "Description",
    "company.createItinerary.descriptionPlaceholder": "Describe what makes this experience special and what travelers can expect",
    "company.createItinerary.creating": "Creating Experience...",
    "company.createItinerary.createButton": "Create Experience",
    "company.createItinerary.success": "Experience created successfully!",
    "company.createItinerary.noCompany": "No company found for your account",
    "company.createItinerary.requiredFields": "Title, date, and price are required",
    "company.createItinerary.invalidPrice": "Price must be a valid number greater than 0",
    "company.manageImages.title": "Manage Images",
    "company.manageImages.subtitle": "Upload and manage photos for your experience",
    "company.manageImages.backToItineraries": "Back to Itineraries",
    "company.manageImages.uploadTitle": "Upload New Images",
    "company.manageImages.uploadSubtitle": "Add photos to showcase your experience",
    "company.manageImages.currentImages": "Current Images",
    "company.manageImages.noImages": "No images yet",
    "company.manageImages.noImagesHint": "Upload your first photos to attract more travelers",
    "company.manageImages.uploadButton": "Upload Images",
    "company.manageImages.uploading": "Uploading...",
    "company.manageImages.uploadSuccess": "Images uploaded successfully!",
    "company.manageImages.uploadError": "Failed to upload images",
    "company.manageImages.photoCount": "photos",
    "company.manageImages.notFound": "Itinerary not found",
    "company.manageImages.loading": "Loading itinerary...",
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
    "auth.phoneNumber": "Numéro de Téléphone",
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
    "nav.explore": "Explorer",
    "nav.whyTembera": "Pourquoi Tembera",
    "nav.signIn": "Se connecter",
    "nav.getStarted": "Commencer",
    "nav.language": "Langue",
    "nav.theme": "Thème",
    "theme.light": "Clair",
    "theme.dark": "Sombre",
    "theme.system": "Système",
    "home.heroMainTitle": "Découvrez le Pays aux Mille Collines",
    "home.heroMainSubtitle": "Réservez des expériences locales authentiques, connectez-vous avec des opérateurs de confiance et créez des souvenirs inoubliables.",
    "home.heroBadge": "Découvrez les Trésors Cachés du Rwanda",
    "home.exploreExperiences": "Explorer les Expériences",
    "home.getStarted": "Commencer",
    "home.scrollToExplore": "Faites défiler pour explorer",
    "home.popularDestinations": "Destinations Populaires",
    "home.popularDestinationsSubtitle": "Explorez les lieux les plus époustouflants du Rwanda",
    "home.destinationVolcanoes": "Parc National des Volcans",
    "home.destinationKivu": "Lac Kivu",
    "home.destinationNyungwe": "Forêt de Nyungwe",
    "home.destinationAkagera": "Parc National d'Akagera",
    "home.tagGorillaTrekking": "Trekking des Gorilles",
    "home.tagBeachRelaxation": "Plage & Détente",
    "home.tagCanopyWalks": "Promenades en Canopée",
    "home.tagSafariAdventures": "Aventures Safari",
    "home.statsTourOperators": "Opérateurs de Confiance",
    "home.statsExperiences": "Expériences Uniques",
    "home.statsSupport": "Support Client",
    "home.statsLocalExpertise": "Expertise Locale",
    "home.howItWorks": "Comment Ça Marche",
    "home.howItWorksSubtitle": "Votre voyage vers des expériences inoubliables en 4 étapes simples",
    "home.stepExplore": "Explorer",
    "home.stepExploreDesc": "Parcourez les expériences rwandaises organisées",
    "home.stepChoose": "Choisir",
    "home.stepChooseDesc": "Sélectionnez votre aventure parfaite",
    "home.stepBook": "Réserver",
    "home.stepBookDesc": "Sécurisez votre place instantanément",
    "home.stepExperience": "Vivre",
    "home.stepExperienceDesc": "Créez des souvenirs inoubliables",
    "home.featuredExperiences": "Expériences en Vedette",
    "home.featuredExperiencesSubtitle": "Aventures sélectionnées rien que pour vous",
    "home.viewAll": "Voir Tout",
    "home.ctaTitle": "Prêt à Commencer Votre Aventure?",
    "home.ctaSubtitle": "Rejoignez des milliers de voyageurs découvrant la beauté du Rwanda",
    "home.signUpNow": "S'inscrire Maintenant",
    "home.browseExperiences": "Parcourir Toutes les Expériences",
    "auth.welcomeBack": "Bon Retour",
    "auth.continueAdventure": "Continuez Votre Aventure",
    "auth.continueAdventureDesc": "Connectez-vous pour accéder à vos réservations et découvrir de nouvelles expériences au Rwanda.",
    "auth.startJourney": "Commencez Votre Voyage",
    "auth.discoverRwanda": "Découvrez les Trésors Cachés du Rwanda",
    "auth.discoverRwandaDesc": "Rejoignez des milliers de voyageurs explorant le pays aux mille collines.",
    "auth.or": "ou",
    "itineraries.pageTitle": "Explorer les Expériences",
    "itineraries.pageSubtitle": "Découvrez des aventures et activités incroyables à travers le Rwanda",
    "itineraries.loading": "Chargement des expériences...",
    "itineraries.noResults": "Aucune expérience trouvée.",
    "itineraries.error": "Échec du chargement des expériences",
    "itineraries.registered": "Inscription réussie!",
    "itineraries.loginRequired": "Veuillez vous connecter pour vous inscrire à une expérience.",
    "itineraries.filterAll": "Toutes les Expériences",
    "itineraries.searchPlaceholder": "Rechercher des expériences...",
    "detail.goBack": "Retour",
    "detail.notFound": "L'expérience demandée est introuvable.",
    "detail.loadingDetails": "Chargement des détails de l'expérience...",
    "detail.attendButton": "Réserver Maintenant",
    "detail.attending": "Réservation...",
    "detail.bookingNumber": "Réservation",
    "detail.createdOn": "Créé le",
    "detail.by": "Par",
    "card.by": "par",
    "card.attend": "Réserver",
    "card.attending": "Réservation...",
    "showcase.title": "Pourquoi Choisir Tembera",
    "showcase.subtitle": "Votre partenaire de confiance pour des expériences inoubliables au Rwanda",
    "showcase.feature1": "Expériences locales sélectionnées par des opérateurs vérifiés",
    "showcase.feature2": "Plateforme de réservation sécurisée avec support client 24/7",
    "showcase.feature3": "Aventures authentiques au Rwanda à prix compétitifs",
    "showcase.whyChooseUs": "Ce Qui Nous Rend Différents",
    "showcase.whySubtitle": "Découvrez le Rwanda comme jamais auparavant",
    "showcase.reason1Title": "Expertise Locale",
    "showcase.reason1Desc": "Travaillez directement avec les meilleurs opérateurs du Rwanda qui connaissent chaque joyau caché",
    "showcase.reason2Title": "Qualité Vérifiée",
    "showcase.reason2Desc": "Toutes les expériences sont vérifiées et évaluées par de vrais voyageurs",
    "showcase.reason3Title": "Meilleurs Prix",
    "showcase.reason3Desc": "Réservation directe signifie pas de frais d'intermédiaire - juste un excellent rapport qualité-prix",
    "showcase.ctaTitle": "Prêt à Explorer le Rwanda?",
    "showcase.ctaSubtitle": "Rejoignez des milliers de voyageurs découvrant le pays aux mille collines",
    "showcase.ctaButton": "Parcourir les Expériences",
    "nav.profile": "Profil",
    "nav.companyItineraries": "Itinéraires de l'Entreprise",
    "profile.title": "Profil",
    "profile.subtitle": "Gérez vos informations personnelles et votre compte",
    "profile.accountDetails": "Détails du Compte",
    "profile.userId": "ID Utilisateur",
    "profile.role": "Rôle",
    "profile.updateProfile": "Mettre à Jour le Profil",
    "profile.fullName": "Nom Complet",
    "profile.phoneNumber": "Numéro de Téléphone",
    "profile.saveChanges": "Enregistrer les Modifications",
    "profile.saving": "Enregistrement...",
    "profile.dangerZone": "Zone Dangereuse",
    "profile.deleteAccount": "Supprimer le Compte",
    "profile.deleteWarning": "La suppression de votre compte est irréversible et supprime votre accès",
    "profile.deleting": "Traitement...",
    "profile.updateSuccess": "Profil mis à jour avec succès",
    "company.registerTitle": "Enregistrer Votre Entreprise",
    "company.registerSubtitle": "Vous devez enregistrer une entreprise pour continuer",
    "company.setupRequired": "Configuration de l'Entreprise Requise",
    "company.setupMessage": "Votre rôle d'entreprise est actif, mais votre compte n'a pas encore de profil d'entreprise. Créez-en un pour débloquer votre espace de travail",
    "company.name": "Nom de l'Entreprise",
    "company.contact": "Contact",
    "company.description": "Description",
    "company.creating": "Création...",
    "company.createButton": "Créer l'Entreprise",
    "company.namePlaceholder": "ex. Tours du Lac Kivu",
    "company.contactPlaceholder": "Téléphone ou email",
    "company.descriptionPlaceholder": "Décrivez votre entreprise et vos services",
    "company.createItineraryTitle": "Créez Votre Première Expérience",
    "company.createItinerarySubtitle": "Partagez votre expérience unique du Rwanda avec les voyageurs",
    "company.itineraryTitle": "Titre de l'Expérience",
    "company.activity": "Type d'Activité",
    "company.location": "Lieu",
    "company.date": "Date",
    "company.price": "Prix (RWF)",
    "company.submitting": "Création...",
    "company.createItinerary": "Créer l'Expérience",
    "company.titlePlaceholder": "ex. Aventure de Trekking des Gorilles",
    "company.activityPlaceholder": "ex. Faune, Culture, Aventure",
    "company.locationPlaceholder": "ex. Parc National des Volcans",
    "company.descriptionPlaceholder2": "Décrivez ce qui rend cette expérience spéciale",
    "company.pricePlaceholder": "Prix par personne",
    "admin.dashboardTitle": "Tableau de Bord Admin",
    "admin.dashboardSubtitle": "Statistiques et aperçu de l'activité de la plateforme",
    "admin.totalUsers": "Total Utilisateurs",
    "admin.totalCompanies": "Total Entreprises",
    "admin.totalItineraries": "Total Expériences",
    "admin.totalRegistrations": "Total Inscriptions",
    "admin.loading": "Chargement du tableau de bord...",
    "admin.usersTitle": "Tous les Utilisateurs",
    "admin.usersSubtitle": "Tous les utilisateurs enregistrés dans le système",
    "admin.name": "Nom",
    "admin.email": "Email",
    "admin.status": "Statut",
    "admin.phone": "Téléphone",
    "admin.role": "Rôle",
    "admin.createdAt": "Créé le",
    "admin.active": "Actif",
    "bookings.myBookings": "Vos Réservations",
    "bookings.noBookings": "Vous n'avez encore fait aucune réservation",
    "bookings.loading": "Chargement des réservations...",
    "bookings.edit": "Modifier",
    "bookings.save": "Enregistrer",
    "bookings.cancel": "Annuler",
    "bookings.delete": "Supprimer",
    "bookings.description": "Description",
    "bookings.date": "Date",
    "bookings.status": "Statut",
    "bookings.members": "Membres du Groupe",
    "bookings.addMember": "Ajouter un Membre",
    "bookings.removeMember": "Retirer",
    "bookings.memberName": "Nom",
    "bookings.memberEmail": "Email",
    "bookings.memberPhone": "Téléphone",
    "bookings.saving": "Enregistrement...",
    "bookings.deleting": "Suppression...",
    "bookings.deleteConfirm": "Êtes-vous sûr de vouloir supprimer cette réservation?",
    "bookings.included": "Expériences Incluses",
    "newBooking.title": "Créer une Nouvelle Réservation",
    "newBooking.subtitle": "Réservez votre prochaine aventure au Rwanda",
    "newBooking.selectItinerary": "Sélectionner l'Expérience",
    "newBooking.note": "Note de Réservation",
    "newBooking.notePlaceholder": "Ajoutez des demandes ou notes spéciales",
    "newBooking.isGroup": "Réservation de Groupe",
    "newBooking.groupHelper": "Cochez cette case si vous réservez pour plusieurs personnes",
    "newBooking.groupType": "Type de Groupe",
    "newBooking.groupMembers": "Membres du Groupe",
    "newBooking.memberNationalId": "Carte d'Identité Nationale",
    "newBooking.addMember": "Ajouter un Membre",
    "newBooking.remove": "Retirer",
    "newBooking.submit": "Créer la Réservation",
    "newBooking.submitting": "Création...",
    "newBooking.personal": "Personnel",
    "newBooking.couple": "Couple",
    "newBooking.family": "Famille",
    "newBooking.other": "Autre",
    "company.dashboard.title": "Tableau de Bord de l'Entreprise",
    "company.dashboard.subtitle": "Aperçu de vos performances et événements à venir",
    "company.dashboard.totalItineraries": "Total des Expériences",
    "company.dashboard.totalAttendees": "Total des Participants",
    "company.dashboard.upcomingEvents": "Événements à Venir",
    "company.dashboard.totalRevenue": "Revenu Total",
    "company.dashboard.upcomingItineraries": "Expériences à Venir",
    "company.dashboard.viewAll": "Voir Tout",
    "company.dashboard.noUpcoming": "Aucune expérience à venir programmée",
    "company.dashboard.attendees": "Participants",
    "company.dashboard.view": "Voir les Détails",
    "company.register.title": "Enregistrer Votre Entreprise",
    "company.register.subtitle": "Créez votre profil d'entreprise pour commencer à offrir des expériences",
    "company.register.setupRequired": "Configuration de l'Entreprise Requise",
    "company.register.setupMessage": "Votre rôle d'entreprise est actif, mais vous devez créer un profil d'entreprise pour continuer",
    "company.register.companyName": "Nom de l'Entreprise",
    "company.register.companyNamePlaceholder": "ex. Aventures du Lac Kivu",
    "company.register.contact": "Informations de Contact",
    "company.register.contactPlaceholder": "Téléphone ou email",
    "company.register.description": "Description de l'Entreprise",
    "company.register.descriptionPlaceholder": "Parlez aux voyageurs de votre entreprise et de ce qui vous rend unique",
    "company.register.creating": "Création de l'Entreprise...",
    "company.register.createButton": "Créer l'Entreprise",
    "company.register.success": "Entreprise enregistrée avec succès!",
    "company.register.loginRequired": "Vous devez être connecté pour enregistrer une entreprise",
    "company.register.nameRequired": "Le nom de l'entreprise est requis",
    "company.createItinerary.title": "Créer une Nouvelle Expérience",
    "company.createItinerary.subtitle": "Partagez votre expérience unique du Rwanda avec les voyageurs du monde entier",
    "company.createItinerary.companyRequired": "Profil d'Entreprise Requis",
    "company.createItinerary.companyRequiredMessage": "Vous devez enregistrer une entreprise avant de créer des expériences",
    "company.createItinerary.createCompany": "Enregistrer l'Entreprise",
    "company.createItinerary.itineraryTitle": "Titre de l'Expérience",
    "company.createItinerary.titlePlaceholder": "ex. Aventure de Trekking des Gorilles dans le Parc des Volcans",
    "company.createItinerary.details": "Détails de l'Expérience",
    "company.createItinerary.activity": "Type d'Activité",
    "company.createItinerary.activityPlaceholder": "ex. Faune, Culture, Aventure",
    "company.createItinerary.location": "Lieu",
    "company.createItinerary.locationPlaceholder": "ex. Parc National des Volcans",
    "company.createItinerary.schedule": "Horaire et Tarification",
    "company.createItinerary.date": "Date",
    "company.createItinerary.price": "Prix par Personne",
    "company.createItinerary.description": "Description",
    "company.createItinerary.descriptionPlaceholder": "Décrivez ce qui rend cette expérience spéciale et ce que les voyageurs peuvent attendre",
    "company.createItinerary.creating": "Création de l'Expérience...",
    "company.createItinerary.createButton": "Créer l'Expérience",
    "company.createItinerary.success": "Expérience créée avec succès!",
    "company.createItinerary.noCompany": "Aucune entreprise trouvée pour votre compte",
    "company.createItinerary.requiredFields": "Le titre, la date et le prix sont requis",
    "company.createItinerary.invalidPrice": "Le prix doit être un nombre valide supérieur à 0",
    "company.manageImages.title": "Gérer les Images",
    "company.manageImages.subtitle": "Téléchargez et gérez les photos de votre expérience",
    "company.manageImages.backToItineraries": "Retour aux Itinéraires",
    "company.manageImages.uploadTitle": "Télécharger de Nouvelles Images",
    "company.manageImages.uploadSubtitle": "Ajoutez des photos pour mettre en valeur votre expérience",
    "company.manageImages.currentImages": "Images Actuelles",
    "company.manageImages.noImages": "Aucune image pour le moment",
    "company.manageImages.noImagesHint": "Téléchargez vos premières photos pour attirer plus de voyageurs",
    "company.manageImages.uploadButton": "Télécharger les Images",
    "company.manageImages.uploading": "Téléchargement...",
    "company.manageImages.uploadSuccess": "Images téléchargées avec succès!",
    "company.manageImages.uploadError": "Échec du téléchargement des images",
    "company.manageImages.photoCount": "photos",
    "company.manageImages.notFound": "Itinéraire introuvable",
    "company.manageImages.loading": "Chargement de l'itinéraire...",
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
    "auth.phoneNumber": "Numero ya Telefoni",
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
    "nav.explore": "Shakisha",
    "nav.whyTembera": "Kuki Tembera",
    "nav.signIn": "Injira",
    "nav.getStarted": "Tangira",
    "nav.language": "Ururimi",
    "nav.theme": "Imiterere",
    "theme.light": "Urumuri",
    "theme.dark": "Umwijima",
    "theme.system": "Sisitemu",
    "home.heroMainTitle": "Menya Igihugu cy'Imisozi Igihumbi",
    "home.heroMainSubtitle": "Bika ingendo z'imbere mu gihugu, uhuze n'abakora ingendo bizewe, kandi ukore ibintu bizaguma mu bwenge bwawe.",
    "home.heroBadge": "Menya Ubutunzi bw'u Rwanda buhishe",
    "home.exploreExperiences": "Shakisha Ingendo",
    "home.getStarted": "Tangira",
    "home.scrollToExplore": "Kanda hasi kugira ngo urebe",
    "home.popularDestinations": "Ahantu Hazwi Cyane",
    "home.popularDestinationsSubtitle": "Shakisha ahantu heza cyane mu Rwanda",
    "home.destinationVolcanoes": "Pariki y'Ibirunga",
    "home.destinationKivu": "Ikiyaga cya Kivu",
    "home.destinationNyungwe": "Ishyamba rya Nyungwe",
    "home.destinationAkagera": "Pariki ya Akagera",
    "home.tagGorillaTrekking": "Gusura Ingagi",
    "home.tagBeachRelaxation": "Ikiyaga & Kuruhuka",
    "home.tagCanopyWalks": "Kugenda mu Mashyamba",
    "home.tagSafariAdventures": "Safari",
    "home.statsTourOperators": "Abakora Ingendo Bizewe",
    "home.statsExperiences": "Ingendo Zidasanzwe",
    "home.statsSupport": "Ubufasha bwa 24/7",
    "home.statsLocalExpertise": "Ubumenyi bw'imbere mu gihugu",
    "home.howItWorks": "Uburyo Bikora",
    "home.howItWorksSubtitle": "Urugendo rwawe ku ngendo zidashobora kwibagirwa mu ntambwe 4 zoroshye",
    "home.stepExplore": "Shakisha",
    "home.stepExploreDesc": "Reba ingendo z'u Rwanda zateguwe",
    "home.stepChoose": "Hitamo",
    "home.stepChooseDesc": "Hitamo urugendo rukwiye",
    "home.stepBook": "Bika",
    "home.stepBookDesc": "Emeza umwanya wawe ako kanya",
    "home.stepExperience": "Ubunararibonye",
    "home.stepExperienceDesc": "Kora ibintu bizaguma mu bwenge bwawe",
    "home.featuredExperiences": "Ingendo Zigaragajwe",
    "home.featuredExperiencesSubtitle": "Ingendo zatorewe wenyine",
    "home.viewAll": "Reba Byose",
    "home.ctaTitle": "Witeguye Gutangira Urugendo Rwawe?",
    "home.ctaSubtitle": "Jya mu bantu babarirwa mu bihumbi bashakisha ubwiza bw'u Rwanda",
    "home.signUpNow": "Iyandikishe Ubu",
    "home.browseExperiences": "Reba Ingendo Zose",
    "auth.welcomeBack": "Murakaza Neza",
    "auth.continueAdventure": "Komeza Urugendo Rwawe",
    "auth.continueAdventureDesc": "Injira kugira ngo ubone amarezervasi yawe no kumenya ingendo nshya mu Rwanda.",
    "auth.startJourney": "Tangira Urugendo Rwawe",
    "auth.discoverRwanda": "Menya Ubutunzi bw'u Rwanda buhishe",
    "auth.discoverRwandaDesc": "Jya mu bantu babarirwa mu bihumbi bashakisha igihugu cy'imisozi igihumbi.",
    "auth.or": "cyangwa",
    "itineraries.pageTitle": "Shakisha Ingendo",
    "itineraries.pageSubtitle": "Menya ingendo n'ibikorwa byiza mu Rwanda",
    "itineraries.loading": "Gupakira ingendo...",
    "itineraries.noResults": "Nta ngendo zabonetse.",
    "itineraries.error": "Byanze gupakira ingendo",
    "itineraries.registered": "Iyandikishe neza!",
    "itineraries.loginRequired": "Nyamuneka injira kugira ngo wiyandikishe ku ngendo.",
    "itineraries.filterAll": "Ingendo Zose",
    "itineraries.searchPlaceholder": "Shakisha ingendo...",
    "detail.goBack": "Subira inyuma",
    "detail.notFound": "Ingendo wasabye ntiyabonetse.",
    "detail.loadingDetails": "Gupakira amakuru y'ingendo...",
    "detail.attendButton": "Bika Ubu",
    "detail.attending": "Gukora rezervasi...",
    "detail.bookingNumber": "Rezervasi",
    "detail.createdOn": "Yaremwe ku wa",
    "detail.by": "Na",
    "card.by": "na",
    "card.attend": "Bika",
    "card.attending": "Gukora...",
    "showcase.title": "Kuki Uhitamo Tembera",
    "showcase.subtitle": "Umufatanyabikorwa wawe wizewe mu ngendo zidashobora kwibagirwa mu Rwanda",
    "showcase.feature1": "Ingendo z'imbere mu gihugu zatorewe n'abakora ingendo bemejwe",
    "showcase.feature2": "Urubuga rw'amarezervasi rufite umutekano hamwe n'ubufasha bwa 24/7",
    "showcase.feature3": "Ingendo nyakuri zo mu Rwanda ku biciro byiza",
    "showcase.whyChooseUs": "Icyo Dutandukaniyeho",
    "showcase.whySubtitle": "Menya u Rwanda nk'uko utigeze ubimenya",
    "showcase.reason1Title": "Ubumenyi bw'Imbere mu Gihugu",
    "showcase.reason1Desc": "Kora na ba nyir'ingendo beza mu Rwanda bazi ahantu hose heza",
    "showcase.reason2Title": "Ubuziranenge Bwemejwe",
    "showcase.reason2Desc": "Ingendo zose zirebwa kandi zisuzumwa n'abagenzi nyakuri",
    "showcase.reason3Title": "Ibiciro Byiza",
    "showcase.reason3Desc": "Gukora rezervasi itaziguye bisobanura nta mafaranga y'umuhuza - gusa agaciro keza",
    "showcase.ctaTitle": "Witeguye Gushakisha u Rwanda?",
    "showcase.ctaSubtitle": "Jya mu bantu babarirwa mu bihumbi bashakisha igihugu cy'imisozi igihumbi",
    "showcase.ctaButton": "Reba Ingendo",
    "nav.profile": "Umwirondoro",
    "nav.companyItineraries": "Ingendo z'Ikigo",
    "profile.title": "Umwirondoro",
    "profile.subtitle": "Gucunga amakuru yawe bwite na konti yawe",
    "profile.accountDetails": "Amakuru ya Konti",
    "profile.userId": "ID y'Ukoresha",
    "profile.role": "Uruhare",
    "profile.updateProfile": "Kuvugurura Umwirondoro",
    "profile.fullName": "Amazina Yuzuye",
    "profile.phoneNumber": "Numero ya Telefoni",
    "profile.saveChanges": "Bika Impinduka",
    "profile.saving": "Gukora...",
    "profile.dangerZone": "Ahantu h'Akaga",
    "profile.deleteAccount": "Gusiba Konti",
    "profile.deleteWarning": "Gusiba konti yawe ntibishobora gusubizwa inyuma kandi bikuraho uburenganzira bwawe",
    "profile.deleting": "Gutunganya...",
    "profile.updateSuccess": "Umwirondoro wavuguruwe neza",
    "company.registerTitle": "Kwandikisha Ikigo Cyawe",
    "company.registerSubtitle": "Ugomba kwandikisha ikigo kugira ngo ukomeze",
    "company.setupRequired": "Gushiraho Ikigo Birakenewe",
    "company.setupMessage": "Uruhare rw'ikigo cyawe rurakoze, ariko konti yawe nta mwirondoro w'ikigo ifite. Kora umwe kugira ngo ufungure akazu kawe k'akazi",
    "company.name": "Izina ry'Ikigo",
    "company.contact": "Aho Kubarizwa",
    "company.description": "Ibisobanuro",
    "company.creating": "Gukora...",
    "company.createButton": "Kora Ikigo",
    "company.namePlaceholder": "urugero: Ingendo zo ku Kivu",
    "company.contactPlaceholder": "Telefoni cyangwa imeri",
    "company.descriptionPlaceholder": "Sobanura ikigo cyawe na serivisi zawe",
    "company.createItineraryTitle": "Kora Ingendo Yawe ya Mbere",
    "company.createItinerarySubtitle": "Sangiza ingendo yawe idasanzwe yo mu Rwanda n'abagenzi",
    "company.itineraryTitle": "Umutwe w'Ingendo",
    "company.activity": "Ubwoko bw'Ibikorwa",
    "company.location": "Ahantu",
    "company.date": "Itariki",
    "company.price": "Igiciro (RWF)",
    "company.submitting": "Gukora...",
    "company.createItinerary": "Kora Ingendo",
    "company.titlePlaceholder": "urugero: Ingendo yo Gushakisha Ingagi",
    "company.activityPlaceholder": "urugero: Inyamaswa, Umuco, Ingendo",
    "company.locationPlaceholder": "urugero: Pariki y'Igihugu y'Ibirunga",
    "company.descriptionPlaceholder2": "Sobanura icyo gituma iyi ngendo idasanzwe",
    "company.pricePlaceholder": "Igiciro kuri buri muntu",
    "admin.dashboardTitle": "Ikibaho cya Admin",
    "admin.dashboardSubtitle": "Imibare n'incamake y'ibikorwa bya platfomo",
    "admin.totalUsers": "Abakoresha Bose",
    "admin.totalCompanies": "Ibigo Byose",
    "admin.totalItineraries": "Ingendo Zose",
    "admin.totalRegistrations": "Iyandikisha Ryose",
    "admin.loading": "Gupakira ikibaho...",
    "admin.usersTitle": "Abakoresha Bose",
    "admin.usersSubtitle": "Abakoresha bose banditse muri sisitemu",
    "admin.name": "Izina",
    "admin.email": "Imeri",
    "admin.status": "Imimerere",
    "admin.phone": "Telefoni",
    "admin.role": "Uruhare",
    "admin.createdAt": "Byaremwe ku wa",
    "admin.active": "Birakora",
    "bookings.myBookings": "Amarezervasi Yawe",
    "bookings.noBookings": "Ntabwo ukora amarezervasi ubu",
    "bookings.loading": "Gupakira amarezervasi...",
    "bookings.edit": "Hindura",
    "bookings.save": "Bika",
    "bookings.cancel": "Kureka",
    "bookings.delete": "Gusiba",
    "bookings.description": "Ibisobanuro",
    "bookings.date": "Itariki",
    "bookings.status": "Imimerere",
    "bookings.members": "Abagize Itsinda",
    "bookings.addMember": "Ongeraho Umunyamuryango",
    "bookings.removeMember": "Kuraho",
    "bookings.memberName": "Izina",
    "bookings.memberEmail": "Imeri",
    "bookings.memberPhone": "Telefoni",
    "bookings.saving": "Gukora...",
    "bookings.deleting": "Gusiba...",
    "bookings.deleteConfirm": "Uzi neza ko ushaka gusiba iyi rezervasi?",
    "bookings.included": "Ingendo Zirimo",
    "newBooking.title": "Kora Rezervasi Nshya",
    "newBooking.subtitle": "Bika ingendo yawe ikurikira yo mu Rwanda",
    "newBooking.selectItinerary": "Hitamo Ingendo",
    "newBooking.note": "Icyitonderwa cya Rezervasi",
    "newBooking.notePlaceholder": "Ongeraho ibisabwa cyangwa icyitonderwa",
    "newBooking.isGroup": "Rezervasi y'Itsinda",
    "newBooking.groupHelper": "Hitamo ibi niba ubika abantu benshi",
    "newBooking.groupType": "Ubwoko bw'Itsinda",
    "newBooking.groupMembers": "Abagize Itsinda",
    "newBooking.memberNationalId": "Indangamuntu",
    "newBooking.addMember": "Ongeraho Umunyamuryango",
    "newBooking.remove": "Kuraho",
    "newBooking.submit": "Kora Rezervasi",
    "newBooking.submitting": "Gukora...",
    "newBooking.personal": "Umuntu ku giti cye",
    "newBooking.couple": "Ababiri",
    "newBooking.family": "Umuryango",
    "newBooking.other": "Ibindi",
    "company.dashboard.title": "Ikibaho cy'Ikigo",
    "company.dashboard.subtitle": "Incamake y'imikorere y'ubucuruzi bwawe n'ibyabaye bizaza",
    "company.dashboard.totalItineraries": "Ingendo Zose",
    "company.dashboard.totalAttendees": "Abitabiriye Bose",
    "company.dashboard.upcomingEvents": "Ibyabaye Bizaza",
    "company.dashboard.totalRevenue": "Amafaranga Yose",
    "company.dashboard.upcomingItineraries": "Ingendo Zizaza",
    "company.dashboard.viewAll": "Reba Byose",
    "company.dashboard.noUpcoming": "Nta ngendo zizaza zateganijwe",
    "company.dashboard.attendees": "Abitabiriye",
    "company.dashboard.view": "Reba Ibisobanuro",
    "company.register.title": "Kwandikisha Ikigo Cyawe",
    "company.register.subtitle": "Kora umwirondoro w'ikigo cyawe kugira ngo utangire gutanga ingendo",
    "company.register.setupRequired": "Gushiraho Ikigo Birakenewe",
    "company.register.setupMessage": "Uruhare rw'ikigo cyawe rurakoze, ariko ugomba gukora umwirondoro w'ikigo kugira ngo ukomeze",
    "company.register.companyName": "Izina ry'Ikigo",
    "company.register.companyNamePlaceholder": "urugero: Ingendo zo ku Kivu",
    "company.register.contact": "Amakuru yo Kuvugana",
    "company.register.contactPlaceholder": "Telefoni cyangwa imeri",
    "company.register.description": "Ibisobanuro by'Ikigo",
    "company.register.descriptionPlaceholder": "Bwira abagenzi ikigo cyawe n'icyo kigutandukanya",
    "company.register.creating": "Gukora Ikigo...",
    "company.register.createButton": "Kora Ikigo",
    "company.register.success": "Ikigo cyanditswe neza!",
    "company.register.loginRequired": "Ugomba kwinjira kugira ngo wandikishe ikigo",
    "company.register.nameRequired": "Izina ry'ikigo rirakenewe",
    "company.createItinerary.title": "Kora Ingendo Nshya",
    "company.createItinerary.subtitle": "Sangiza ingendo yawe idasanzwe yo mu Rwanda n'abagenzi ku isi",
    "company.createItinerary.companyRequired": "Umwirondoro w'Ikigo Urakenewe",
    "company.createItinerary.companyRequiredMessage": "Ugomba kwandikisha ikigo mbere yo gukora ingendo",
    "company.createItinerary.createCompany": "Andikisha Ikigo",
    "company.createItinerary.itineraryTitle": "Umutwe w'Ingendo",
    "company.createItinerary.titlePlaceholder": "urugero: Ingendo yo Gushakisha Ingagi mu Pariki y'Ibirunga",
    "company.createItinerary.details": "Ibisobanuro by'Ingendo",
    "company.createItinerary.activity": "Ubwoko bw'Ibikorwa",
    "company.createItinerary.activityPlaceholder": "urugero: Inyamaswa, Umuco, Ingendo",
    "company.createItinerary.location": "Ahantu",
    "company.createItinerary.locationPlaceholder": "urugero: Pariki y'Igihugu y'Ibirunga",
    "company.createItinerary.schedule": "Gahunda n'Ibiciro",
    "company.createItinerary.date": "Itariki",
    "company.createItinerary.price": "Igiciro kuri Buri Muntu",
    "company.createItinerary.description": "Ibisobanuro",
    "company.createItinerary.descriptionPlaceholder": "Sobanura icyo gituma iyi ngendo idasanzwe n'icyo abagenzi bashobora gutegereza",
    "company.createItinerary.creating": "Gukora Ingendo...",
    "company.createItinerary.createButton": "Kora Ingendo",
    "company.createItinerary.success": "Ingendo yaremwe neza!",
    "company.createItinerary.noCompany": "Nta kigo cyabonetse kuri konti yawe",
    "company.createItinerary.requiredFields": "Umutwe, itariki n'igiciro birakenewe",
    "company.createItinerary.invalidPrice": "Igiciro kigomba kuba umubare wemewe urenze 0",
    "company.manageImages.title": "Gucunga Amafoto",
    "company.manageImages.subtitle": "Shyiraho kandi ucunge amafoto y'ingendo yawe",
    "company.manageImages.backToItineraries": "Subira ku Ngendo",
    "company.manageImages.uploadTitle": "Shyiraho Amafoto Mashya",
    "company.manageImages.uploadSubtitle": "Ongeraho amafoto kugira ngo urebe ingendo yawe",
    "company.manageImages.currentImages": "Amafoto Ariho",
    "company.manageImages.noImages": "Nta mafoto arahari",
    "company.manageImages.noImagesHint": "Shyiraho amafoto yawe ya mbere kugira ngo ukurure abagenzi benshi",
    "company.manageImages.uploadButton": "Shyiraho Amafoto",
    "company.manageImages.uploading": "Gushyiraho...",
    "company.manageImages.uploadSuccess": "Amafoto yashyizweho neza!",
    "company.manageImages.uploadError": "Byanze gushyiraho amafoto",
    "company.manageImages.photoCount": "amafoto",
    "company.manageImages.notFound": "Ingendo ntiyabonetse",
    "company.manageImages.loading": "Gupakira ingendo...",
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
    return "rw";
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

