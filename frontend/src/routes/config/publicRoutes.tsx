import { Navigate } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ItinerariesPage from "@/pages/ItinerariesPage";
import ItineraryDetailPage from "@/pages/ItineraryDetailPage";
import VisitorShowcasePage from "@/pages/VisitorShowcasePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

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
