import { requestHelper } from "./requestHelper";
import { API_BASE_URL } from "./config";

export type CompanyRating = {
  id: string;
  rating: number;
  comment?: string;
  userId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  company?: {
    id: string;
    name: string;
    logoUrl?: string;
  };
};

export type BackendCompanyRating = {
  id: string;
  rating: number;
  comment?: string | null;
  user_id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  company?: {
    id: string;
    name: string;
    logo_url?: string | null;
  };
};

export function mapCompanyRating(rating: BackendCompanyRating): CompanyRating {
  return {
    id: rating.id,
    rating: rating.rating,
    comment: rating.comment || undefined,
    userId: rating.user_id,
    companyId: rating.company_id,
    createdAt: rating.created_at,
    updatedAt: rating.updated_at,
    user: rating.user,
    company: rating.company ? {
      id: rating.company.id,
      name: rating.company.name,
      logoUrl: rating.company.logo_url || undefined,
    } : undefined,
  };
}

export async function createOrUpdateCompanyRating(
  token: string,
  companyId: string,
  rating: number,
  comment?: string,
): Promise<CompanyRating> {
  const parsed = await requestHelper<BackendCompanyRating>({
    method: "POST",
    url: `${API_BASE_URL}/api/companies/${companyId}/ratings`,
    token,
    data: { rating, comment },
  });
  return mapCompanyRating(parsed.data);
}

export async function getCompanyRatings(companyId: string): Promise<CompanyRating[]> {
  const parsed = await requestHelper<BackendCompanyRating[]>({
    method: "GET",
    url: `${API_BASE_URL}/api/companies/${companyId}/ratings`,
  });
  return parsed.data.map(mapCompanyRating);
}

export async function getCompanyRatingStats(companyId: string): Promise<{
  average: number;
  count: number;
  ratings: CompanyRating[];
}> {
  const parsed = await requestHelper<{
    average: number;
    count: number;
    ratings: BackendCompanyRating[];
  }>({
    method: "GET",
    url: `${API_BASE_URL}/api/companies/${companyId}/ratings/stats`,
  });
  return {
    average: parsed.data.average,
    count: parsed.data.count,
    ratings: parsed.data.ratings.map(mapCompanyRating),
  };
}

export async function getUserRatingForCompany(
  token: string,
  companyId: string,
): Promise<CompanyRating | null> {
  try {
    const parsed = await requestHelper<BackendCompanyRating | null>({
      method: "GET",
      url: `${API_BASE_URL}/api/companies/${companyId}/ratings/me`,
      token,
    });
    return parsed.data ? mapCompanyRating(parsed.data) : null;
  } catch {
    return null;
  }
}

export async function getUserRatings(token: string): Promise<CompanyRating[]> {
  const parsed = await requestHelper<BackendCompanyRating[]>({
    method: "GET",
    url: `${API_BASE_URL}/api/companies/ratings/me`,
    token,
  });
  return parsed.data.map(mapCompanyRating);
}

export async function deleteCompanyRating(
  token: string,
  ratingId: string,
): Promise<void> {
  await requestHelper({
    method: "DELETE",
    url: `${API_BASE_URL}/api/companies/ratings/${ratingId}`,
    token,
  });
}
