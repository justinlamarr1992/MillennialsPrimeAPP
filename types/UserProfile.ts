/**
 * TypeScript interfaces for user profile data
 * Maps to server's MillPrimeUser MongoDB model
 */

// Server response structure (complete user profile from MongoDB)
export interface ServerUserProfile {
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  DOB?: string;
  profilePic?: string;
  location?: {
    country?: string;
    state?: string;
    city?: string;
    zip?: number;
  };
  business?: {
    entrepreneur?: boolean;
    industry?: string;
    companyName?: string;
    lengthOpen?: string;
    whyBusiness?: string;
    firstObjective?: string;
    objectiveNow?: string;
    howMany?: string;
    productsAndServices?: string;
    primaryPromotion?: string;
    factorsOfLocation?: string;
  };
  art?: {
    artist?: boolean;
    professional?: boolean;
    purpose?: string;
    affectIssues?: string;
    navigateIndustry?: string;
    inspirationOfWork?: string;
    styleChanged?: string;
    favsOrNoneFavs?: string;
    network?: boolean;
    support?: string;
    critics?: string;
    specificIntegral?: boolean;
    whatSpecfic?: string;
  };
  profileSettings?: {
    canLike?: boolean;
    canDislike?: boolean;
    canComment?: boolean;
    canShare?: boolean;
    industry?: string;
    B2B?: boolean;
    eComm?: boolean;
    upload?: boolean;
  };
  roles?: {
    User?: number;
    Editor?: number;
    Admin?: number;
  };
  prime?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Mobile form data structures (what we send to server on save)

export interface MyInfoFormData {
  name: string;
  country: string;
  state: string;
  city: string;
  zip: string;
}

export interface BusinessFormData {
  entrepreneur: string; // "Yes" or "No" in mobile
  industry?: string;
  businessSize?: string; // Maps to lengthOpen
  businessLocation?: string;
  businessLocationReason?: string; // Maps to factorsOfLocation
}

export interface ArtFormData {
  artist: string; // "Yes" or "No" in mobile
  professionalArtist?: string; // Maps to professional
  purpose?: string;
  favorites?: string; // Maps to favsOrNoneFavs
  issues?: string; // Maps to affectIssues
  platforms?: string;
  industryNavigation?: string; // Maps to navigateIndustry
  network?: string; // "Yes" or "No" in mobile
  integral?: string; // Maps to specificIntegral
}

export interface ProfileSettingsFormData {
  canLike: string; // "Yes" or "No" in mobile
  canDislike: string;
  canComment: string;
  canShare: string;
  industry?: string;
  B2B?: string;
  eComm?: string;
  upload?: string;
}
