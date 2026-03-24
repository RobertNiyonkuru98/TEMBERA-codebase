// Shared types for itinerary multi-step form components

export interface ItineraryFormData {
  // Basic Information
  title: string;
  activity: string;
  description: string;
  location: string;
  date: string;
  category: string;
  tags: string[];
  
  // Duration & Scheduling
  durationDays: number;
  durationHours: number;
  startTime: string;
  endTime: string;
  isMultiDay: boolean;
  scheduleDetails: string;
  
  // Capacity & Booking Policies
  minParticipants: number;
  maxParticipants: number;
  availableSlots: number;
  allowsIndividuals: boolean;
  allowsGroups: boolean;
  groupDiscountPercent: number;
  groupMinSize: number;
  bookingDeadline: string;
  
  // Inclusions & Exclusions
  inclusions: string[];
  exclusions: string[];
  providedEquipment: string[];
  requiredItems: string[];
  
  // Food & Meals
  mealsIncluded: boolean;
  mealTypes: string[];
  foodOptions: string;
  canBuyFoodOnsite: boolean;
  canBringOwnFood: boolean;
  dietaryAccommodations: string;
  
  // Transportation
  transportIncluded: boolean;
  transportType: string;
  pickupLocations: string[];
  dropoffLocations: string[];
  allowsOwnTransport: boolean;
  parkingAvailable: boolean;
  transportNotes: string;
  
  // Meeting & Location Details
  meetingPoint: string;
  meetingPointLat: number | null;
  meetingPointLng: number | null;
  endPoint: string;
  endPointLat: number | null;
  endPointLng: number | null;
  locationDetails: string;
  
  // Difficulty & Requirements
  difficultyLevel: string;
  fitnessLevelRequired: string;
  minAge: number;
  maxAge: number;
  ageRestrictionsNotes: string;
  accessibilityInfo: string;
  
  // Pricing & Payment
  price: number;
  pricePerPerson: number;
  pricePerGroup: number;
  depositRequired: number;
  depositPercentage: number;
  paymentMethods: string[];
  currency: string;
  refundPolicy: string;
  cancellationPolicy: string;
  
  // Safety & Insurance
  insuranceIncluded: boolean;
  insuranceDetails: string;
  safetyMeasures: string[];
  emergencyProcedures: string;
  medicalRequirements: string;
  
  // Additional Information
  languagesOffered: string[];
  guideInfo: string;
  weatherDependency: boolean;
  weatherNotes: string;
  whatToWear: string;
  additionalNotes: string;
  termsAndConditions: string;
  
  // Media
  images: Array<{ url: string; publicId: string; file?: File }>;
  videos: Array<{ url: string; publicId: string; thumbnailUrl?: string; file?: File }>;
  
  // Status
  status: string;
  isFeatured: boolean;
  isActive: boolean;
}

export interface StepProps {
  formData: ItineraryFormData;
  updateFormData: (updates: Partial<ItineraryFormData>) => void;
}

export const INITIAL_FORM_DATA: ItineraryFormData = {
  // Basic Information
  title: "",
  activity: "",
  description: "",
  location: "",
  date: "",
  category: "",
  tags: [],
  
  // Duration & Scheduling
  durationDays: 1,
  durationHours: 0,
  startTime: "",
  endTime: "",
  isMultiDay: false,
  scheduleDetails: "",
  
  // Capacity & Booking Policies
  minParticipants: 1,
  maxParticipants: 50,
  availableSlots: 50,
  allowsIndividuals: true,
  allowsGroups: true,
  groupDiscountPercent: 0,
  groupMinSize: 5,
  bookingDeadline: "",
  
  // Inclusions & Exclusions
  inclusions: [],
  exclusions: [],
  providedEquipment: [],
  requiredItems: [],
  
  // Food & Meals
  mealsIncluded: false,
  mealTypes: [],
  foodOptions: "",
  canBuyFoodOnsite: false,
  canBringOwnFood: true,
  dietaryAccommodations: "",
  
  // Transportation
  transportIncluded: false,
  transportType: "",
  pickupLocations: [],
  dropoffLocations: [],
  allowsOwnTransport: false,
  parkingAvailable: false,
  transportNotes: "",
  
  // Meeting & Location Details
  meetingPoint: "",
  meetingPointLat: null,
  meetingPointLng: null,
  endPoint: "",
  endPointLat: null,
  endPointLng: null,
  locationDetails: "",
  
  // Difficulty & Requirements
  difficultyLevel: "",
  fitnessLevelRequired: "",
  minAge: 0,
  maxAge: 100,
  ageRestrictionsNotes: "",
  accessibilityInfo: "",
  
  // Pricing & Payment
  price: 0,
  pricePerPerson: 0,
  pricePerGroup: 0,
  depositRequired: 0,
  depositPercentage: 0,
  paymentMethods: [],
  currency: "RWF",
  refundPolicy: "",
  cancellationPolicy: "",
  
  // Safety & Insurance
  insuranceIncluded: false,
  insuranceDetails: "",
  safetyMeasures: [],
  emergencyProcedures: "",
  medicalRequirements: "",
  
  // Additional Information
  languagesOffered: [],
  guideInfo: "",
  weatherDependency: false,
  weatherNotes: "",
  whatToWear: "",
  additionalNotes: "",
  termsAndConditions: "",
  
  // Media
  images: [],
  videos: [],
  
  // Status
  status: "draft",
  isFeatured: false,
  isActive: true,
};
