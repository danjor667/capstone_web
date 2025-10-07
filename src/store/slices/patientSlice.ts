import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PatientData } from '../../types/patient'

interface PatientState {
  selectedPatient: PatientData | null
  patientList: PatientData[]
  loading: boolean
  error: string | null
}

const initialState: PatientState = {
  selectedPatient: null,
  patientList: [],
  loading: false,
  error: null,
}

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setSelectedPatient: (state, action: PayloadAction<PatientData>) => {
      state.selectedPatient = action.payload
    },
    setPatientList: (state, action: PayloadAction<PatientData[]>) => {
      state.patientList = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setSelectedPatient, setPatientList, setLoading, setError } = patientSlice.actions
export default patientSlice.reducer