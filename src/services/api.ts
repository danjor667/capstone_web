import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { PatientData } from '../types/patient'
import { KidneyMetrics, AlertData } from '../types/medical'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api',
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
              id: patient.id,
              firstName: patient.first_name,
              lastName: patient.last_name,
              dateOfBirth: patient.date_of_birth,
              gender: patient.gender,
              contactInfo: {
                email: patient.email,
                phone: patient.phone,
                address: typeof patient.address === 'string' ? patient.address : '',
                emergencyContact: patient.emergency_contact
              }
            },
            createdAt: patient.created_at,
            updatedAt: patient.updated_at
          }))
        }
        return []
      },
      providesTags: ['Patient'],
    }),
    searchPatients: builder.query<PatientData[], string>({
      query: (searchTerm) => `/patients/search/?q=${encodeURIComponent(searchTerm)}`,
      transformResponse: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data.map((patient: any) => ({
            id: patient.id,
            demographics: {
              id: patient.id,
              firstName: patient.first_name,
              lastName: patient.last_name,
              dateOfBirth: patient.date_of_birth,
              gender: patient.gender,
              contactInfo: {
                email: patient.email,
                phone: patient.phone,
                address: patient.address,
                emergencyContact: patient.emergency_contact
              }
            },
            createdAt: patient.created_at,
            updatedAt: patient.updated_at
          }))
        }
        return []
      },
      providesTags: ['Patient'],
    }),
    getPatient: builder.query<PatientData | undefined, string>({
      query: (id) => `/patients/${id}/`,
      transformResponse: (response: any): PatientData | undefined => {
        if (response.success && response.data) {
          const patient = response.data
          return {
            id: patient.id,
            demographics: {
              id: patient.id,
              firstName: patient.first_name,
              lastName: patient.last_name,
              dateOfBirth: patient.date_of_birth,
              gender: patient.gender,
              contactInfo: {
                email: patient.email,
                phone: patient.phone,
                address: patient.address,
                emergencyContact: patient.emergency_contact
              }
            },
            dietQuality: patient.diet_quality,
            familyHistoryKidneyDisease: patient.family_history_kidney_disease,
            createdAt: patient.created_at,
            updatedAt: patient.updated_at
          } as any
        }
        return undefined
      },
      providesTags: (_result, _error, id) => [{ type: 'Patient', id }],
    }),
    createPatient: builder.mutation<PatientData | undefined, any>({
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
          address: patientData.address,
          emergency_contact: patientData.emergencyContact
        },
      }),
      transformResponse: (response: any): PatientData | undefined => {
        if (response.success && response.data) {
          const patient = response.data
          return {
            id: patient.id,
            demographics: {
              id: patient.id,
              firstName: patient.first_name,
              lastName: patient.last_name,
              dateOfBirth: patient.date_of_birth,
              gender: patient.gender,
              contactInfo: {
                email: patient.email,
                phone: patient.phone,
                address: patient.address,
                emergencyContact: patient.emergency_contact
              }
            },
            createdAt: patient.created_at,
            updatedAt: patient.updated_at
          }
        }
        return undefined
      },
      invalidatesTags: ['Patient'],
    }),
    updatePatient: builder.mutation<PatientData, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/patients/${id}/`,
        method: 'PUT',
        body: {
          first_name: data.firstName,
          last_name: data.lastName,
          date_of_birth: data.dateOfBirth,
          gender: data.gender,
          email: data.email,
          phone: data.phone,
          street: data.address || data.street || '',
          diet_quality: data.dietQuality,
          family_history_kidney_disease: data.familyHistoryKidneyDisease
        },
      }),
    }),

    // Kidney metrics endpoints
    getKidneyMetrics: builder.query<KidneyMetrics | undefined, string>({
      query: (patientId) => `/patients/${patientId}/metrics/`,
      transformResponse: (response: any): KidneyMetrics | undefined => {
        if (response.success && response.data) {
          return {
            eGFR: response.data.egfr,
            creatinine: response.data.creatinine,
            bun: response.data.bun,
            proteinuria: response.data.proteinuria || 0,
            bloodPressure: {
              systolic: response.data.systolic_bp || 120,
              diastolic: response.data.diastolic_bp || 80
            },
            stage: response.data.stage,
            progression: {
              trend: response.data.trend,
              rateOfChange: response.data.rate_of_change,
              predictedStage: response.data.stage,
              riskFactors: []
            },
            lastUpdated: response.data.timestamp
          }
        }
        return undefined
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
    addKidneyMetrics: builder.mutation<KidneyMetrics, { patientId: string; data: any }>({
      query: ({ patientId, data }) => ({
        url: `/patients/${patientId}/metrics/`,
        method: 'POST',
        body: {
          egfr: data.egfr,
          creatinine: data.creatinine,

          proteinuria: data.proteinuria,
          systolic_bp: data.systolic_bp,
          diastolic_bp: data.diastolic_bp,
          stage: data.stage,
          timestamp: new Date().toISOString()
        },
      }),
      invalidatesTags: (_result, _error, { patientId }) => [{ type: 'KidneyMetrics', id: patientId }],
    }),

    // Lab results endpoints
    getLabResults: builder.query<any[], string>({
      query: (patientId) => `/patients/${patientId}/lab-results/`,
      transformResponse: (response: any) => {
        console.log('Lab Results API Response:', response)
        
        // Handle different response formats
        if (response?.success && Array.isArray(response.data)) {
          return response.data.map((result: any) => ({
            id: result.id,
            testName: result.test_name,
            value: result.test_value || result.value,
            unit: result.unit,
            testDate: result.test_date,
            referenceRange: result.reference_range,
            notes: result.notes
          }))
        }
        
        // Handle direct array response
        if (Array.isArray(response)) {
          return response.map((result: any) => ({
            id: result.id,
            testName: result.test_name,
            value: result.test_value || result.value,
            unit: result.unit,
            testDate: result.test_date,
            referenceRange: result.reference_range,
            notes: result.notes
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
        body: Array.isArray(data) ? data : {
          test_name: data.testName,
          test_value: data.value,
          unit: data.unit,
          test_date: data.testDate,
          reference_range: data.referenceRange,
          notes: data.notes
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
    validatePatientData: builder.query<any, string>({
      query: (patientId) => `/ml/patients/${patientId}/validate/`,
      transformResponse: (response: any) => {
        if (response?.success && response?.data) {
          return response.data
        }
        return null
      },
      transformErrorResponse: (response: any) => {
        console.warn('ML validation service unavailable:', response)
        return {
          is_ready_for_prediction: false,
          completeness_score: 0,
          status: 'ML service unavailable',
          missing_data: ['ML prediction service is currently unavailable'],
          recommendations: ['Please try again later or contact support']
        }
      },
    }),
    getMLPrediction: builder.query<any, string>({
      query: (patientId) => `/ml/patients/${patientId}/prediction/`,
      transformResponse: (response: any) => {
        if (response?.success && response?.data) {
          return response.data
        }
        return null
      },
      transformErrorResponse: (response: any) => {
        console.warn('ML prediction service unavailable:', response)
        return null
      },
      providesTags: (_result, _error, patientId) => [{ type: 'MLPrediction', id: patientId }],
    }),
    triggerMLAnalysis: builder.mutation<any, string>({
      query: (patientId) => ({
        url: `/ml/patients/${patientId}/analyze/`,
        method: 'POST',
        body: {}, // Empty body as per API guide
      }),
      transformResponse: (response: any) => {
        if (response.success && response.data) {
          return response.data
        }
        return null
      },
      invalidatesTags: (_result, _error, patientId) => [{ type: 'MLPrediction', id: patientId }],
    }),
    getMedicalHistory: builder.query<any, string>({
      query: (patientId) => `/patients/${patientId}/medical-history/`,
      transformResponse: (response: any) => {
        if (response.success && response.data) {
          return {
            edema: response.data.edema,
            muscleCramps: response.data.muscle_cramps,
            itching: response.data.itching
          }
        }
        return null
      },
    }),
    updateMedicalHistory: builder.mutation<any, { patientId: string; data: any }>({
      query: ({ patientId, data }) => ({
        url: `/patients/${patientId}/medical-history/`,
        method: 'PUT',
        body: {
          edema: data.edema,
          muscle_cramps: data.muscleCramps,
          itching: data.itching
        },
      }),
    }),

    getMLModelMetrics: builder.query<any, void>({
      query: () => '/ml/model/metrics/',
      transformResponse: (response: any) => {
        if (response.success && response.data) {
          return response.data
        }
        return null
      },
    }),
    getMLPredictionHistory: builder.query<any[], string>({
      query: (patientId) => `/ml/patients/${patientId}/predictions/history/`,
      transformResponse: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data
        }
        return []
      },
      providesTags: (_result, _error, patientId) => [{ type: 'MLPrediction', id: `${patientId}-history` }],
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
      transformResponse: (response: any, _meta, patientId) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data.map((alert: any) => ({
            id: alert.id,
            type: alert.alert_type,
            title: alert.title,
            message: alert.message,
            priority: alert.priority,
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

    // Vitals endpoints
    getVitals: builder.query<any[], string>({
      query: (patientId) => `/patients/${patientId}/vitals/`,
      transformResponse: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          return response.data
        }
        return []
      },
    }),
    addVitals: builder.mutation<any, { patientId: string; data: any }>({
      query: ({ patientId, data }) => ({
        url: `/patients/${patientId}/vitals/`,
        method: 'POST',
        body: {
          systolic_bp: data.systolicBp,
          diastolic_bp: data.diastolicBp,
          heart_rate: data.heartRate,
          temperature: data.temperature,
          weight: data.weight,
          height: data.height,
          timestamp: new Date().toISOString()
        },
      }),
      invalidatesTags: (_result, _error, { patientId }) => [{ type: 'Patient', id: patientId }],
    }),
    
    // 3D model data
    getKidneyGeometry: builder.query<any, void>({
      query: () => '/models/kidney-geometry/',
    }),
    getPatient3DData: builder.query<any, string>({
      query: (patientId) => `/models/patients/${patientId}/3d-data/`,
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
  useGetVitalsQuery,
  useAddVitalsMutation,
  useValidatePatientDataQuery,
  useGetMLPredictionQuery,
  useTriggerMLAnalysisMutation,
  useGetMLModelMetricsQuery,
  useGetMLPredictionHistoryQuery,
  useGetRiskFactorsQuery,
  useGetTrendsQuery,
  useGetAlertsQuery,
  useCreateAlertMutation,
  useAcknowledgeAlertMutation,
  useGetMedicalHistoryQuery,
  useUpdateMedicalHistoryMutation,
  useGetKidneyGeometryQuery,
  useGetPatient3DDataQuery,
} = apiSlice