import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { RootState } from '../store/store'
import { setSelectedPatient, setPatientList } from '../store/slices/patientSlice'
import { useGetPatientsQuery, useGetPatientQuery } from '../services/api'
import { PatientData } from '../types/patient'

export const usePatientData = (patientId?: string) => {
  const dispatch = useDispatch()
  const selectedPatient = useSelector((state: RootState) => state.patient.selectedPatient)
  const patientList = useSelector((state: RootState) => state.patient.patientList)

  // Fetch all patients
  const { 
    data: patients, 
    isLoading: patientsLoading, 
    error: patientsError 
  } = useGetPatientsQuery()

  // Fetch specific patient if ID provided
  const { 
    data: patient, 
    isLoading: patientLoading, 
    error: patientError 
  } = useGetPatientQuery(patientId!, { skip: !patientId })

  const selectPatient = useCallback((patient: PatientData) => {
    dispatch(setSelectedPatient(patient))
  }, [dispatch])

  const updatePatientList = useCallback((patients: PatientData[]) => {
    dispatch(setPatientList(patients))
  }, [dispatch])

  return {
    selectedPatient,
    patientList,
    patients,
    patient,
    selectPatient,
    updatePatientList,
    isLoading: patientsLoading || patientLoading,
    error: patientsError || patientError,
  }
}