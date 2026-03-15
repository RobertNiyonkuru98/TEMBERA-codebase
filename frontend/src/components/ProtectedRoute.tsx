import { Navigate, type OutletProps } from "react-router-dom";
import { useAuth } from "../AuthContext";

type ProtectedRouteProps = OutletProps & {
  redirectTo?: string;
};

function ProtectedRoute({ redirectTo = "/login", children }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;

