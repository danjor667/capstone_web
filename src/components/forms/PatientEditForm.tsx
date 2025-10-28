import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material'
import { useUpdatePatientMutation } from '../../services/api'
import { PatientData } from '../../types/patient'

interface PatientEditFormProps {
  open: boolean
  onClose: () => void
  patient: PatientData | null
  onSuccess: () => void
}

const PatientEditForm: React.FC<PatientEditFormProps> = ({ open, onClose, patient, onSuccess }) => {
  const [updatePatient, { isLoading, error }] = useUpdatePatientMutation()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: ''
  })

  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.demographics.firstName,
        lastName: patient.demographics.lastName,
        email: patient.demographics.contactInfo.email || '',
        phone: patient.demographics.contactInfo.phone || '',
        dateOfBirth: patient.demographics.dateOfBirth,
        gender: patient.demographics.gender,
        address: patient.demographics.contactInfo.address || '',
        emergencyContact: patient.demographics.contactInfo.emergencyContact || ''
      })
    }
  }, [patient])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patient) return

    try {
      await updatePatient({
        id: patient.id,
        data: {
          demographics: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            contactInfo: {
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              emergencyContact: formData.emergencyContact
            }
          }
        } as Partial<PatientData>
      }).unwrap()
      
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Failed to update patient:', err)
    }
  }

  const handleClose = () => {
    onClose()
    if (patient) {
      setFormData({
        firstName: patient.demographics.firstName,
        lastName: patient.demographics.lastName,
        email: patient.demographics.contactInfo.email || '',
        phone: patient.demographics.contactInfo.phone || '',
        dateOfBirth: patient.demographics.dateOfBirth,
        gender: patient.demographics.gender,
        address: patient.demographics.contactInfo.address || '',
        emergencyContact: patient.demographics.contactInfo.emergencyContact || ''
      })
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Patient Information</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to update patient. Please try again.
            </Alert>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="dateOfBirth"
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="gender"
                label="Gender"
                select
                value={formData.gender}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="emergencyContact"
                label="Emergency Contact"
                value={formData.emergencyContact}
                onChange={handleChange}
                fullWidth
                placeholder="Name - Phone Number"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isLoading}
            sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
          >
            {isLoading ? <CircularProgress size={20} /> : 'Update Patient'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default PatientEditForm