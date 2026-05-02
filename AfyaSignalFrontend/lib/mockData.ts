import type { Case, Alert, HealthFacility, DashboardStats } from './types';

export const mockHealthFacilities: HealthFacility[] = [
  {
    id: 'hf-001',
    name: 'Kibera Health Center',
    village: 'Kibera',
    district: 'Nairobi',
    phone: '+254712345678',
    capacity: 50,
    currentPatients: 32,
  },
  {
    id: 'hf-002',
    name: 'Mathare Clinic',
    village: 'Mathare',
    district: 'Nairobi',
    phone: '+254712345679',
    capacity: 30,
    currentPatients: 18,
  },
  {
    id: 'hf-003',
    name: 'Mukuru Health Post',
    village: 'Mukuru',
    district: 'Nairobi',
    phone: '+254712345680',
    capacity: 25,
    currentPatients: 12,
  },
  {
    id: 'hf-004',
    name: 'Nairobi Teaching Hospital',
    village: 'Westlands',
    district: 'Nairobi',
    phone: '+254712345681',
    capacity: 200,
    currentPatients: 145,
  },
];

export const mockCases: Case[] = [
  {
    id: 'case-001',
    patientName: 'Amara Kipchoge',
    childId: 'CHILD-2026-0001',
    village: 'Kibera',
    chvName: 'Grace Mwangi',
    triageCategory: 'emergency',
    status: 'referred',
    createdAt: '2026-04-28T09:15:00Z',
    lastUpdated: '2026-04-28T14:30:00Z',
    referralFacility: 'Nairobi Teaching Hospital',
  },
  {
    id: 'case-002',
    patientName: 'David Omondi',
    childId: 'CHILD-2026-0002',
    village: 'Mathare',
    chvName: 'Samuel Kiplagat',
    triageCategory: 'urgent',
    status: 'open',
    createdAt: '2026-04-29T08:45:00Z',
    lastUpdated: '2026-04-29T16:20:00Z',
    referralFacility: 'Mathare Clinic',
  },
  {
    id: 'case-003',
    patientName: 'Zainab Hassan',
    childId: 'CHILD-2026-0003',
    village: 'Mukuru',
    chvName: 'Charity Kipchoge',
    triageCategory: 'priority',
    status: 'open',
    createdAt: '2026-04-30T10:00:00Z',
    lastUpdated: '2026-04-30T15:45:00Z',
  },
  {
    id: 'case-004',
    patientName: 'Michael Kipkemboi',
    childId: 'CHILD-2026-0004',
    village: 'Kibera',
    chvName: 'Grace Mwangi',
    triageCategory: 'general',
    status: 'completed',
    createdAt: '2026-04-25T07:30:00Z',
    lastUpdated: '2026-04-27T12:00:00Z',
  },
  {
    id: 'case-005',
    patientName: 'Nia Mwangi',
    childId: 'CHILD-2026-0005',
    village: 'Mathare',
    chvName: 'Samuel Kiplagat',
    triageCategory: 'urgent',
    status: 'referred',
    createdAt: '2026-04-26T11:20:00Z',
    lastUpdated: '2026-04-28T09:30:00Z',
    referralFacility: 'Kibera Health Center',
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    type: 'emergency',
    caseId: 'case-001',
    patientName: 'Amara Kipchoge',
    message: 'Emergency referral - Severe respiratory distress',
    severity: 'critical',
    status: 'acknowledged',
    createdAt: '2026-04-28T09:15:00Z',
  },
  {
    id: 'alert-002',
    type: 'referral-pending',
    caseId: 'case-002',
    patientName: 'David Omondi',
    message: 'Awaiting confirmation of referral to Mathare Clinic',
    severity: 'high',
    status: 'new',
    createdAt: '2026-04-29T08:45:00Z',
  },
  {
    id: 'alert-003',
    type: 'urgent',
    caseId: 'case-003',
    patientName: 'Zainab Hassan',
    message: 'High fever (39.8°C) and difficulty breathing',
    severity: 'high',
    status: 'new',
    createdAt: '2026-04-30T10:00:00Z',
  },
  {
    id: 'alert-004',
    type: 'follow-up-due',
    caseId: 'case-005',
    patientName: 'Nia Mwangi',
    message: '7-day follow-up check due',
    severity: 'medium',
    status: 'new',
    createdAt: '2026-05-02T07:00:00Z',
  },
];

export const mockDashboardStats: DashboardStats = {
  totalAssessments: 247,
  emergencyCases: 3,
  urgentCases: 12,
  referralsCompleted: 18,
  pendingReferrals: 4,
  activeCHVs: 8,
};

// CHV and Health Worker Data
export const mockCHVs = [
  { id: 'chv-001', name: 'Grace Mwangi', village: 'Kibera', phone: '+254712345690' },
  { id: 'chv-002', name: 'Samuel Kiplagat', village: 'Mathare', phone: '+254712345691' },
  { id: 'chv-003', name: 'Charity Kipchoge', village: 'Mukuru', phone: '+254712345692' },
  { id: 'chv-004', name: 'Peter Ochieng', village: 'Kibera', phone: '+254712345693' },
  { id: 'chv-005', name: 'Elizabeth Kipchoge', village: 'Mathare', phone: '+254712345694' },
  { id: 'chv-006', name: 'John Kipkemboi', village: 'Mukuru', phone: '+254712345695' },
  { id: 'chv-007', name: 'Rose Mwangi', village: 'Kibera', phone: '+254712345696' },
  { id: 'chv-008', name: 'Daniel Kiplagat', village: 'Mathare', phone: '+254712345697' },
];

// Mock assessment data for chart visualization
export const mockWeeklyAssessments = [
  { day: 'Mon', assessments: 12, referrals: 3 },
  { day: 'Tue', assessments: 15, referrals: 4 },
  { day: 'Wed', assessments: 18, referrals: 5 },
  { day: 'Thu', assessments: 14, referrals: 2 },
  { day: 'Fri', assessments: 22, referrals: 6 },
  { day: 'Sat', assessments: 10, referrals: 2 },
  { day: 'Sun', assessments: 8, referrals: 1 },
];

// Triage distribution data
export const mockTriageDistribution = [
  { category: 'Emergency', value: 3, color: '#DC2626' },
  { category: 'Urgent', value: 12, color: '#EA580C' },
  { category: 'Priority', value: 28, color: '#2D7A4A' },
  { category: 'General', value: 204, color: '#68C67C' },
];

// Common symptoms for assessment form
export const commonSymptoms = [
  'Fever',
  'Cough',
  'Diarrhea',
  'Difficulty breathing',
  'Rash',
  'Vomiting',
  'Lethargy',
  'Seizures',
];

// Villages for location selection
export const villages = ['Kibera', 'Mathare', 'Mukuru'];
