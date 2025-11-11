import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography
} from '@mui/material'
import { useCreatePatientMutation } from '../../services/api'

interface PatientRegistrationFormProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

const PatientRegistrationForm: React.FC<PatientRegistrationFormProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const [createPatient, { isLoading }] = useCreatePatientMutation()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    familyHistoryKidneyDisease: false,
    dietQuality: '',
    edema: false,
    muscleCramps: false,
    itching: false
  })



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createPatient({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        family_history_kidney_disease: formData.familyHistoryKidneyDisease,
        diet_quality: parseInt(formData.dietQuality) || 3
      }).unwrap()
      onSuccess?.()
      onClose()
      setFormData({
        firstName: '', lastName: '', dateOfBirth: '', gender: '', email: '', phone: '',
        address: '', emergencyContact: '', familyHistoryKidneyDisease: false, dietQuality: '',
        edema: false, muscleCramps: false, itching: false
      })
    } catch (error) {
      console.error('Failed to create patient:', error)
    }
  }



  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Register New Patient</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Gender"
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                required
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Emergency Contact"
                value={formData.emergencyContact}
                onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                placeholder="Name - Phone Number"
              />
            </Grid>

            {/* ML Prediction Data */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Health Assessment</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Diet Quality"
                value={formData.dietQuality}
                onChange={(e) => setFormData(prev => ({ ...prev, dietQuality: e.target.value }))}
                helperText="Overall dietary habits"
                required
              >
                <MenuItem value="1">1 - Poor</MenuItem>
                <MenuItem value="2">2 - Fair</MenuItem>
                <MenuItem value="3">3 - Good</MenuItem>
                <MenuItem value="4">4 - Very Good</MenuItem>
                <MenuItem value="5">5 - Excellent</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Family History of Kidney Disease"
                value={formData.familyHistoryKidneyDisease ? 'yes' : 'no'}
                onChange={(e) => setFormData(prev => ({ ...prev, familyHistoryKidneyDisease: e.target.value === 'yes' }))}
                required
              >
                <MenuItem value="no">No</MenuItem>
                <MenuItem value="yes">Yes</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Register Patient'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default PatientRegistrationForm