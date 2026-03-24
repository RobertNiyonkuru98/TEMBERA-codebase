export interface CompanyFormData {
  // Basic Info
  name: string;
  tagline: string;
  description: string;
  ownerId: string;

  // Visual Branding
  logoImages: Array<{ url: string; publicId: string; file?: File }>;
  coverImages: Array<{ url: string; publicId: string; file?: File }>;
  logoUrl: string;
  coverUrl: string;

  // Location
  address: string;
  city: string;
  country: string;

  // Contact
  email: string;
  phone: string;

  // Business Details
  specializations: string[];
  languages: string[];

  // Operational
  operatingDays: string;
  operatingHours: string;

  // Online Presence
  website: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;

  // Additional Info
  insuranceInfo: string;
  emergencyPhone: string;
  supportingDocs: Array<{ url: string; publicId: string; file?: File }>;
  docUrls: string[];
}

export interface StepProps {
  formData: CompanyFormData;
  updateFormData: (data: Partial<CompanyFormData>) => void;
  onNext?: () => void;
  onBack?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}
