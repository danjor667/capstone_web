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
  Box,
  Typography,
  Chip
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
    medicalHistory: {
      conditions: [] as string[],
      allergies: [] as string[],
      familyHistory: [] as string[]
    }
  })

  const [newCondition, setNewCondition] = useState('')
  const [newAllergy, setNewAllergy] = useState('')
  const [newFamilyHistory, setNewFamilyHistory] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createPatient(formData).unwrap()
      onSuccess?.()
      onClose()
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        email: '',
        phone: '',
        medicalHistory: { conditions: [], allergies: [], familyHistory: [] }
      })
    } catch (error) {
      console.error('Failed to create patient:', error)
    }
  }

  const addToArray = (field: 'conditions' | 'allergies' | 'familyHistory', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          [field]: [...prev.medicalHistory[field], value.trim()]
        }
      }))
    }
  }

  const removeFromArray = (field: 'conditions' | 'allergies' | 'familyHistory', index: number) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: prev.medicalHistory[field].filter((_, i) => i !== index)
      }
    }))
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

            {/* Medical History */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Medical History</Typography>
            </Grid>

            {/* Conditions */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Medical Condition"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addToArray('conditions', newCondition)
                      setNewCondition('')
                    }
                  }}
                  placeholder="e.g., Hypertension, Diabetes"
                />
                <Button 
                  onClick={() => {
                    addToArray('conditions', newCondition)
                    setNewCondition('')
                  }}
                  sx={{ mt: 1 }}
                >
                  Add Condition
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.medicalHistory.conditions.map((condition, index) => (
                  <Chip
                    key={index}
                    label={condition}
                    onDelete={() => removeFromArray('conditions', index)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            {/* Allergies */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Allergy"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addToArray('allergies', newAllergy)
                      setNewAllergy('')
                    }
                  }}
                  placeholder="e.g., Penicillin, Shellfish"
                />
                <Button 
                  onClick={() => {
                    addToArray('allergies', newAllergy)
                    setNewAllergy('')
                  }}
                  sx={{ mt: 1 }}
                >
                  Add Allergy
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.medicalHistory.allergies.map((allergy, index) => (
                  <Chip
                    key={index}
                    label={allergy}
                    onDelete={() => removeFromArray('allergies', index)}
                    color="error"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            {/* Family History */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Family History"
                  value={newFamilyHistory}
                  onChange={(e) => setNewFamilyHistory(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addToArray('familyHistory', newFamilyHistory)
                      setNewFamilyHistory('')
                    }
                  }}
                  placeholder="e.g., Diabetes, Heart Disease"
                />
                <Button 
                  onClick={() => {
                    addToArray('familyHistory', newFamilyHistory)
                    setNewFamilyHistory('')
                  }}
                  sx={{ mt: 1 }}
                >
                  Add Family History
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.medicalHistory.familyHistory.map((history, index) => (
                  <Chip
                    key={index}
                    label={history}
                    onDelete={() => removeFromArray('familyHistory', index)}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
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