// User and Authentication Types
export type UserRole = 'chv' | 'admin' | 'health-facility';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  phone?: string;
  avatar?: string;
  village?: string;
  facility?: string;
}

// Assessment Types
export interface PatientInfo {
  childId: string;
  childName: string;
  age: number;
  ageUnit: 'months' | 'years';
  parentName: string;
  parentPhone: string;
  village: string;
}

export interface Symptoms {
  fever: boolean;
  feverDays?: number;
  cough: boolean;
  coughDays?: number;
  diarrhea: boolean;
  diarrheaDays?: number;
  difficulty_breathing: boolean;
  rash: boolean;
  vomiting: boolean;
  lethargy: boolean;
  seizures: boolean;
  other?: string;
}

export interface Vitals {
  temperature?: number;
  respiratory_rate?: number;
  heart_rate?: number;
  weight?: number;
}

export interface Assessment {
  id: string;
  patientInfo: PatientInfo;
  symptoms: Symptoms;
  vitals: Vitals;
  timestamp: string;
  chvId: string;
  chvName: string;
  status: 'in-progress' | 'completed' | 'referred';
}

// Triage Result Types
export type TriageCategory = 'emergency' | 'urgent' | 'priority' | 'general';

export interface TriageResult {
  id: string;
  assessmentId: string;
  category: TriageCategory;
  recommendations: string[];
  referral?: {
    facility: string;
    reason: string;
    urgency: 'immediate' | 'same-day' | 'next-appointment';
  };
  timestamp: string;
}

// Case and Alert Types
export interface Case {
  id: string;
  patientName: string;
  childId: string;
  village: string;
  chvName: string;
  triageCategory: TriageCategory;
  status: 'open' | 'referred' | 'completed' | 'lost-to-follow-up';
  createdAt: string;
  lastUpdated: string;
  referralFacility?: string;
}

export interface Alert {
  id: string;
  type: 'emergency' | 'urgent' | 'referral-pending' | 'follow-up-due';
  caseId: string;
  patientName: string;
  message: string;
  severity: 'critical' | 'high' | 'medium';
  status: 'new' | 'acknowledged' | 'resolved';
  createdAt: string;
}

// Dashboard Statistics
export interface DashboardStats {
  totalAssessments: number;
  emergencyCases: number;
  urgentCases: number;
  referralsCompleted: number;
  pendingReferrals: number;
  activeCHVs: number;
}

// Hospital/Facility Types
export interface HealthFacility {
  id: string;
  name: string;
  village: string;
  district: string;
  phone: string;
  capacity: number;
  currentPatients: number;
}
