import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { PatientData } from '../types/patient'
import { KidneyMetrics, AlertData } from '../types/medical'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      // Add auth token if available
      const token = localStorage.getItem('auth_token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Patient', 'KidneyMetrics', 'Alert'],
  endpoints: (builder) => ({
    getPatients: builder.query<PatientData[], void>({
      query: () => '/patients',
      providesTags: ['Patient'],
    }),
    getPatient: builder.query<PatientData, string>({
      query: (id) => `/patients/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Patient', id }],
    }),
    getKidneyMetrics: builder.query<KidneyMetrics, string>({
      query: (patientId) => `/patients/${patientId}/kidney-metrics`,
      providesTags: (_result, _error, patientId) => [{ type: 'KidneyMetrics', id: patientId }],
    }),
    getAlerts: builder.query<AlertData[], string>({
      query: (patientId) => `/patients/${patientId}/alerts`,
      providesTags: ['Alert'],
    }),
    updatePatient: builder.mutation<PatientData, Partial<PatientData> & Pick<PatientData, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/patients/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Patient', id }],
    }),
  }),
})

export const {
  useGetPatientsQuery,
  useGetPatientQuery,
  useGetKidneyMetricsQuery,
  useGetAlertsQuery,
  useUpdatePatientMutation,
} = apiSlice