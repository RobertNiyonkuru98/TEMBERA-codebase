import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

type ProtectedRouteProps = {
  children?: ReactNode;
  redirectTo?: string;
};

function ProtectedRoute({ redirectTo = "/login", children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation(); // get current location

  if (!user) {
    // Pass the attempted page in state
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;