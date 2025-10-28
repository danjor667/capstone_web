export interface Demographics {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  ethnicity?: string
  contactInfo: ContactInfo
}

export interface ContactInfo {
  email?: string
  phone?: string
  address?: string
  emergencyContact?: string
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface LabResult {
  id: string
  testName: string
  value: number
  unit: string
  referenceRange: string
  date: string
  isAbnormal: boolean
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  prescribedBy: string
}

export interface VitalSigns {
  id: string
  timestamp: string
  bloodPressure: BloodPressure
  heartRate: number
  temperature: number
  weight: number
  height: number
}

export interface BloodPressure {
  systolic: number
  diastolic: number
}

export interface ImagingData {
  id: string
  type: 'ultrasound' | 'ct' | 'mri' | 'xray'
  date: string
  findings: string
  imageUrl?: string
}

export interface PatientData {
  id: string
  demographics: Demographics
  createdAt: string
  updatedAt: string
}