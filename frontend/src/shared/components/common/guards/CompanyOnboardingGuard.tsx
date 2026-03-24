import { Navigate } from "react-router-dom";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthContext";
import {
  getMyCompanyState,
  hasCompanyItineraries,
  type CompanyState,
} from "@/core/api";

type CompanyOnboardingGuardProps = {
  children: ReactNode;
  allowWithoutCompany?: boolean;
  allowWithoutItinerary?: boolean;
};

export function CompanyOnboardingGuard({
  children,
  allowWithoutCompany = false,
  allowWithoutItinerary = false,
}: CompanyOnboardingGuardProps) {
  const { user, token, activeRole } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [companyState, setCompanyState] = useState<CompanyState>({ hasCompany: false });
  const [hasItineraries, setHasItineraries] = useState(false);

  useEffect(() => {
    async function loadCompanyState() {
      if (!user || !token || activeRole !== "company") {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const nextState = await getMyCompanyState(token, String(user.id));
        setCompanyState(nextState);

        if (!nextState.hasCompany || !nextState.companyId) {
          setHasItineraries(false);
          return;
        }

        const nextHasItineraries = await hasCompanyItineraries(
          token,
          nextState.companyId,
        );
        setHasItineraries(nextHasItineraries);
      } catch (loadError) {
        toast.error(
          loadError instanceof Error
            ? loadError.message
            : "Failed to validate company onboarding",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadCompanyState();
  }, [activeRole, token, user]);

  const destination = useMemo(() => {
    if (!companyState.hasCompany) {
      toast.warning("You must register a company first", {
        description: "Complete your company profile to unlock your workspace.",
      });
      return "/company/register";
    }

    // Allow companies to access all pages even without itineraries
    // They can create their first itinerary from the dashboard or itineraries page
    return null;
  }, [companyState.hasCompany]);

  if (isLoading) {
    return <p className="text-sm text-slate-300">Checking company setup...</p>;
  }
  if (!companyState.hasCompany && allowWithoutCompany) {
    return <>{children}</>;
  }

  if (companyState.hasCompany && !hasItineraries && allowWithoutItinerary) {
    return <>{children}</>;
  }

  if (destination) {
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
}
