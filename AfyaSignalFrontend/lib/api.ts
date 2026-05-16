import type { UserRole } from './types';

const configuredApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;

const defaultApiBaseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8082'
    : 'https://afyasignal.onrender.com';

export const API_BASE_URL = (
  configuredApiBaseUrl || defaultApiBaseUrl
).replace(/\/$/, '');

export interface ApiError {
  timestamp?: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  validationErrors?: Record<string, string> | null;
}

export interface AuthResponse {
  token: string;
  id: string;
  name: string;
  email: string;
  role: 'CHV' | 'ADMIN' | 'HEALTH_FACILITY';
  village?: string | null;
  facility?: string | null;
}

export interface DashboardStatsResponse {
  totalAssessments: number;
  emergencyCases: number;
  urgentCases: number;
  totalCHVs: number;
  pendingAlerts: number;
  assessmentsThisWeek: number;
}

export interface AssessmentRequest {
  childName: string;
  ageMonths: number;
  parentName?: string;
  parentPhone?: string;
  village: string;
  weight?: number;
  fever: boolean;
  feverDays?: number;
  cough: boolean;
  coughDays?: number;
  diarrhea: boolean;
  diarrheaDays?: number;
  difficultyBreathing: boolean;
  rash: boolean;
  vomiting: boolean;
  lethargy: boolean;
  seizures: boolean;
  otherSymptoms?: string;
  temperature?: number;
  respiratoryRate?: number;
  referralFacilityId?: string;
}

export interface AssessmentResponse {
  id: string;
  childId: string;
  childName: string;
  ageMonths: number;
  village: string;
  triageCategory: 'EMERGENCY' | 'URGENT' | 'PRIORITY' | 'GENERAL';
  triageExplanation?: string;
  referralFacilityName?: string;
  referralReason?: string;
  chvName?: string;
  createdAt: string;
}

export interface AlertResponse {
  id: string;
  type: string;
  village: string;
  message: string;
  caseCount?: number;
  dayWindow?: number;
  status: 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED';
  createdAt: string;
}

export interface FacilityResponse {
  id: string;
  name: string;
  village: string;
  subCounty: string;
  phone?: string;
  totalBeds?: number;
  availableBeds?: number;
  operatingHours?: string;
  managerName?: string;
}

export function mapBackendRole(role: AuthResponse['role']): UserRole {
  if (role === 'CHV') return 'chv';
  if (role === 'HEALTH_FACILITY') return 'health-facility';
  return 'admin';
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('afyasignal_token') : null;
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let error: ApiError;
    try {
      error = await response.json();
    } catch {
      error = {
        status: response.status,
        error: response.statusText,
        message: 'Request failed',
      };
    }
    throw error;
  }

  return response.json();
}

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type:
    | 'ASSESSMENT_SUBMITTED'
    | 'CRITICAL_CASE_FLAGGED'
    | 'OUTBREAK_ALERT_GENERATED'
    | 'ALERT_ACKNOWLEDGED'
    | 'REFERRAL_INCOMING'
    | 'REFERRAL_ACKNOWLEDGED';
  referenceId?: string;
  referenceType?: string;
  isRead: boolean;
  createdAt: string;
}

export async function getNotifications(): Promise<NotificationResponse[]> {
  return apiRequest<NotificationResponse[]>('/api/notifications');
}

export async function getUnreadCount(): Promise<number> {
  return apiRequest<number>('/api/notifications/unread/count');
}

export async function markNotificationAsRead(id: string): Promise<void> {
  return apiRequest<void>(`/api/notifications/${id}/read`, { method: 'PATCH' });
}

export async function markAllNotificationsAsRead(): Promise<void> {
  return apiRequest<void>('/api/notifications/read-all', { method: 'PATCH' });
}
