import { Navigate } from "react-router-dom";
import { HomePage, VisitorShowcasePage } from "@/features/home";
import { ItinerariesPage, ItineraryDetailPage } from "@/features/itineraries";
import { LoginPage, RegisterPage } from "@/features/auth";

export const publicRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/itineraries",
    element: <ItinerariesPage />,
  },
  {
    path: "/itinerary/:id",
    element: <ItineraryDetailPage />,
  },
  {
    path: "/itineraries/:id",
    element: <ItineraryDetailPage />,
  },
  {
    path: "/visitor/showcase",
    element: <VisitorShowcasePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
