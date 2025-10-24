import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { PatientData } from '../types/patient'
import { KidneyMetrics, AlertData } from '../types/medical'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Patient', 'KidneyMetrics', 'Alert', 'LabResult', 'MLPrediction', 'Medication'],
  endpoints: (builder) => ({
    // Patient endpoints
    getPatients: builder.query<PatientData[], void>({
      query: () => '/patients/',
      transformResponse: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data.map((patient: any) => ({
            id: patient.id,
            demographics: {
              firstName: patient.first_name,
              lastName: patient.last_name,
              dateOfBirth: patient.date_of_birth,
              gender: patient.gender,
              ethnicity: patient.ethnicity,
              contactInfo: {
                email: patient.email,
                phone: patient.phone,
                address: {
                  street: patient.street,
                  city: patient.city,
                  state: patient.state,
                  zipCode: patient.zip_code,
                  country: patient.country
                }
              }
            },
            medicalHistory: patient.medical_history,
            createdAt: patient.created_at,
            updatedAt: patient.updated_at
          }))
        }
        return []
      },
      providesTags: ['Patient'],
    }),
    searchPatients: builder.query<PatientData[], string>({
      query: (searchTerm) => `/patients/search?q=${encodeURIComponent(searchTerm)}`,
      transformResponse: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data.map((patient: any) => ({
            id: patient.id,
            demographics: {
              firstName: patient.first_name,
              lastName: patient.last_name,
              dateOfBirth: patient.date_of_birth,
              gender: patient.gender,
              ethnicity: patient.ethnicity,
              contactInfo: {
                email: patient.email,
                phone: patient.phone,
                address: {
                  street: patient.street,
                  city: patient.city,
                  state: patient.state,
                  zipCode: patient.zip_code,
                  country: patient.country
                }
              }
            },
            medicalHistory: patient.medical_history,
            createdAt: patient.created_at,
            updatedAt: patient.updated_at
          }))
        }
        return []
      },
      providesTags: ['Patient'],
    }),
    getPatient: builder.query<PatientData, string>({
      query: (id) => `/patients/${id}/`,
      transformResponse: (response: any) => {
        if (response.success && response.data) {
          const patient = response.data
          return {
            id: patient.id,
            demographics: {
              firstName: patient.first_name,
              lastName: patient.last_name,
              dateOfBirth: patient.date_of_birth,
              gender: patient.gender,
              ethnicity: patient.ethnicity,
              contactInfo: {
                email: patient.email,
                phone: patient.phone,
                address: {
                  street: patient.street,
                  city: patient.city,
                  state: patient.state,
                  zipCode: patient.zip_code,
                  country: patient.country
                }
              }
            },
            medicalHistory: patient.medical_history,
            createdAt: patient.created_at,
            updatedAt: patient.updated_at
          }
        }
        return null
      },
      providesTags: (_result, _error, id) => [{ type: 'Patient', id }],
    }),
    createPatient: builder.mutation<PatientData, any>({
      query: (patientData) => ({
        url: '/patients/',
        method: 'POST',
        body: {
          first_name: patientData.firstName,
          last_name: patientData.lastName,
          date_of_birth: patientData.dateOfBirth,
          gender: patientData.gender,
          email: patientData.email,
          phone: patientData.phone,
          medical_history: patientData.medicalHistory || {}
        },
      }),
      transformResponse: (response: any) => {
        if (response.success && response.data) {
          const patient = response.data
          return {
            id: patient.id,
            demographics: {
              firstName: patient.first_name,
              lastName: patient.last_name,
              dateOfBirth: patient.date_of_birth,
              gender: patient.gender,
              ethnicity: patient.ethnicity,
              contactInfo: {
                email: patient.email,
                phone: patient.phone,
                address: {
                  street: patient.street,
                  city: patient.city,
                  state: patient.state,
                  zipCode: patient.zip_code,
                  country: patient.country
                }
              }
            },
            medicalHistory: patient.medical_history,
            createdAt: patient.created_at,
            updatedAt: patient.updated_at
          }
        }
        return null
      },
      invalidatesTags: ['Patient'],
    }),
    updatePatient: builder.mutation<PatientData, { id: string; data: Partial<PatientData> }>({
      query: ({ id, data }) => ({
        url: `/patients/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Patient', id }],
    }),

    // Kidney metrics endpoints
    getKidneyMetrics: builder.query<KidneyMetrics, string>({
      query: (patientId) => `/patients/${patientId}/metrics/`,
      transformResponse: (response: any) => {
        if (response.success && response.data) {
          return response.data
        }
        return null
      },
      providesTags: (_result, _error, patientId) => [{ type: 'KidneyMetrics', id: patientId }],
    }),
    getKidneyMetricsHistory: builder.query<KidneyMetrics[], string>({
      query: (patientId) => `/patients/${patientId}/metrics/history/`,
      transformResponse: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data
        }
        return []
      },
      providesTags: (_result, _error, patientId) => [{ type: 'KidneyMetrics', id: patientId }],
    }),
    addKidneyMetrics: builder.mutation<KidneyMetrics, { patientId: string; data: Partial<KidneyMetrics> }>({
      query: ({ patientId, data }) => ({
        url: `/patients/${patientId}/metrics/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { patientId }) => [{ type: 'KidneyMetrics', id: patientId }],
    }),

    // Lab results endpoints
    getLabResults: builder.query<any[], string>({
      query: (patientId) => `/patients/${patientId}/lab-results/`,
      transformResponse: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data.map((result: any) => ({
            id: result.id,
            testName: result.test_name,
            value: result.value,
            unit: result.unit,
            testDate: result.test_date,
            category: result.category,
            normalRange: result.normal_range,
            isAbnormal: result.is_abnormal
          }))
        }
        return []
      },
      providesTags: (_result, _error, patientId) => [{ type: 'LabResult', id: patientId }],
    }),
    addLabResult: builder.mutation<any, { patientId: string; data: any }>({
      query: ({ patientId, data }) => ({
        url: `/patients/${patientId}/lab-results/`,
        method: 'POST',
        body: {
          test_name: data.testName,
          value: data.value,
          unit: data.unit,
          test_date: data.testDate,
          category: data.category
        },
      }),
      invalidatesTags: (_result, _error, { patientId }) => [{ type: 'LabResult', id: patientId }],
    }),
    
    // Medications endpoints
    getMedications: builder.query<any[], string>({
      query: (patientId) => `/patients/${patientId}/medications/`,
      transformResponse: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data.map((med: any) => ({
            id: med.id,
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            startDate: med.start_date,
            endDate: med.end_date,
            isActive: med.is_active
          }))
        }
        return []
      },
      providesTags: (_result, _error, patientId) => [{ type: 'Medication', id: patientId }],
    }),
    addMedication: builder.mutation<any, { patientId: string; data: any }>({
      query: ({ patientId, data }) => ({
        url: `/patients/${patientId}/medications/`,
        method: 'POST',
        body: {
          name: data.name,
          dosage: data.dosage,
          frequency: data.frequency,
          start_date: data.startDate
        },
      }),
      invalidatesTags: (_result, _error, { patientId }) => [{ type: 'Medication', id: patientId }],
    }),

    // ML prediction endpoints
    getMLPrediction: builder.query<any, string>({
      query: (patientId) => `/patients/${patientId}/prediction/`,
      transformResponse: (response: any) => {
        if (response.success && response.data) {
          return response.data
        }
        return null
      },
      providesTags: (_result, _error, patientId) => [{ type: 'MLPrediction', id: patientId }],
    }),
    triggerMLAnalysis: builder.mutation<any, string>({
      query: (patientId) => ({
        url: `/patients/${patientId}/analyze/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, patientId) => [{ type: 'MLPrediction', id: patientId }],
    }),
    getRiskFactors: builder.query<any[], string>({
      query: (patientId) => `/patients/${patientId}/risk-factors/`,
      transformResponse: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data
        }
        return []
      },
    }),
    getTrends: builder.query<any[], string>({
      query: (patientId) => `/patients/${patientId}/trends/`,
      transformResponse: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data
        }
        return []
      },
    }),

    // Alerts endpoints
    getAlerts: builder.query<AlertData[], string>({
      query: (patientId) => `/patients/${patientId}/alerts/`,
      transformResponse: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data.map((alert: any) => ({
            id: alert.id,
            type: alert.type,
            title: alert.title,
            message: alert.message,
            priority: alert.priority,
            category: alert.category,
            acknowledged: alert.acknowledged,
            acknowledgedBy: alert.acknowledged_by,
            acknowledgedAt: alert.acknowledged_at,
            timestamp: alert.created_at,
            patientId: patientId
          }))
        }
        return []
      },
      providesTags: ['Alert'],
    }),
    createAlert: builder.mutation<AlertData, Partial<AlertData>>({
      query: (alert) => ({
        url: '/alerts/',
        method: 'POST',
        body: alert,
      }),
      invalidatesTags: ['Alert'],
    }),
    acknowledgeAlert: builder.mutation<AlertData, string>({
      query: (alertId) => ({
        url: `/alerts/${alertId}/acknowledge/`,
        method: 'PUT',
      }),
      invalidatesTags: ['Alert'],
    }),

    // 3D model data
    getKidneyGeometry: builder.query<any, void>({
      query: () => '/models/kidney-geometry/',
    }),
    getPatient3DData: builder.query<any, string>({
      query: (patientId) => `/patients/${patientId}/3d-data/`,
    }),
  }),
})

export const {
  useGetPatientsQuery,
  useSearchPatientsQuery,
  useGetPatientQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useGetKidneyMetricsQuery,
  useGetKidneyMetricsHistoryQuery,
  useAddKidneyMetricsMutation,
  useGetLabResultsQuery,
  useAddLabResultMutation,
  useGetMedicationsQuery,
  useAddMedicationMutation,
  useGetMLPredictionQuery,
  useTriggerMLAnalysisMutation,
  useGetRiskFactorsQuery,
  useGetTrendsQuery,
  useGetAlertsQuery,
  useCreateAlertMutation,
  useAcknowledgeAlertMutation,
  useGetKidneyGeometryQuery,
  useGetPatient3DDataQuery,
} = apiSlice