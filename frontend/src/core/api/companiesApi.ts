import type { Company } from "@/shared/types";
import { BaseApiService } from "./baseApi";

export type BackendCompany = {
  // Basic Info
  id: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  
  // Visual Branding
  logo_url?: string | null;
  cover_image_url?: string | null;
  
  // Location
  address?: string | null;
  city?: string | null;
  country?: string | null;
  
  // Contact Information
  email?: string | null;
  phone?: string | null;
  contact?: string | null;
  
  // Business Details
  specializations?: string[] | null;
  languages?: string[] | null;
  
  // Operational
  operating_days?: string | null;
  operating_hours?: string | null;
  
  // Online Presence
  website?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  twitter_url?: string | null;
  
  // Additional Info
  insurance_info?: string | null;
  emergency_phone?: string | null;
  supporting_docs?: string[] | null;
  
  // Metadata
  owner_id: string;
  created_at?: string;
  updated_at?: string;
};

export type CreateCompanyPayload = {
  name: string;
  tagline?: string;
  description?: string;
  logo_url?: string;
  cover_image_url?: string;
  address?: string;
  city?: string;
  country?: string;
  email?: string;
  phone?: string;
  contact?: string;
  specializations?: string[];
  languages?: string[];
  operating_days?: string;
  operating_hours?: string;
  website?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  insurance_info?: string;
  emergency_phone?: string;
  supporting_docs?: string[];
  owner_id: string;
};

export type CompanyState = {
  hasCompany: boolean;
  companyId?: string;
};

export function mapCompany(company: BackendCompany): Company {
  return {
    id: company.id,
    name: company.name,
    tagline: company.tagline ?? undefined,
    description: company.description ?? undefined,
    logoUrl: company.logo_url ?? undefined,
    coverImageUrl: company.cover_image_url ?? undefined,
    address: company.address ?? undefined,
    city: company.city ?? undefined,
    country: company.country ?? undefined,
    email: company.email ?? undefined,
    phone: company.phone ?? undefined,
    contact: company.contact ?? undefined,
    specializations: company.specializations ?? undefined,
    languages: company.languages ?? undefined,
    operatingDays: company.operating_days ?? undefined,
    operatingHours: company.operating_hours ?? undefined,
    website: company.website ?? undefined,
    facebookUrl: company.facebook_url ?? undefined,
    instagramUrl: company.instagram_url ?? undefined,
    twitterUrl: company.twitter_url ?? undefined,
    insuranceInfo: company.insurance_info ?? undefined,
    emergencyPhone: company.emergency_phone ?? undefined,
    supportingDocs: company.supporting_docs ?? undefined,
    ownerId: company.owner_id,
    createdAt: company.created_at,
    updatedAt: company.updated_at,
  };
}

class CompaniesApiService extends BaseApiService<Company, BackendCompany> {}
export const companiesService = new CompaniesApiService("/api/companies", mapCompany);

export async function fetchCompanies(token: string): Promise<Company[]> {
  return companiesService.getAll(token);
}

export async function fetchCompanyById(token: string, companyId: string): Promise<Company> {
  return companiesService.getById(companyId, token);
}

export async function createCompany(token: string, payload: CreateCompanyPayload): Promise<Company> {
  return companiesService.create<CreateCompanyPayload>(payload, token);
}

export async function deleteCompany(token: string, companyId: string): Promise<void> {
  return companiesService.delete(companyId, token);
}

export async function getMyCompanyState(token: string, userId: string): Promise<CompanyState> {
  const companies = await fetchCompanies(token);
  const company = companies.find((item) => String(item.ownerId) === String(userId));
  return company ? { hasCompany: true, companyId: String(company.id) } : { hasCompany: false };
}
