import React, { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, Typography, FormControlLabel, Checkbox, TextField, MenuItem
} from '@mui/material'
import { useUpdateMedicalHistoryMutation } from '../../services/api'

interface MedicalHistoryFormProps {
  open: boolean
  onClose: () => void
  patientId: string
  onSuccess?: () => void
}

const MedicalHistoryForm: React.FC<MedicalHistoryFormProps> = ({ open, onClose, patientId, onSuccess }) => {
  const [updateMedicalHistory, { isLoading }] = useUpdateMedicalHistoryMutation()
  
  const [formData, setFormData] = useState({
    edema: false,
    muscleCramps: false,
    itching: false,
    familyHistoryKidneyDisease: false,
    dietQuality: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Update medical history/symptoms
      await updateMedicalHistory({
        patientId,
        data: {
          edema: formData.edema,
          muscleCramps: formData.muscleCramps,
          itching: formData.itching
        }
      }).unwrap()
      
      onSuccess?.()
      onClose()
      setFormData({
        edema: false,
        muscleCramps: false,
        itching: false,
        familyHistoryKidneyDisease: false,
        dietQuality: ''
      })
    } catch (error) {
      console.error('Failed to add medical history:', error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Medical History & Symptoms</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Required information for ML prediction analysis
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>Current Symptoms</Typography>
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.edema}
                    onChange={(e) => setFormData(prev => ({ ...prev, edema: e.target.checked }))}
                  />
                }
                label="Edema (swelling in legs, ankles, or feet)"
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.muscleCramps}
                    onChange={(e) => setFormData(prev => ({ ...prev, muscleCramps: e.target.checked }))}
                  />
                }
                label="Muscle cramps"
                sx={{ display: 'block' }}
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.itching}
                    onChange={(e) => setFormData(prev => ({ ...prev, itching: e.target.checked }))}
                  />
                }
                label="Persistent itching"
                sx={{ display: 'block' }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>Family History</Typography>
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.familyHistoryKidneyDisease}
                    onChange={(e) => setFormData(prev => ({ ...prev, familyHistoryKidneyDisease: e.target.checked }))}
                  />
                }
                label="Family history of kidney disease"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Diet Quality Assessment"
                value={formData.dietQuality}
                onChange={(e) => setFormData(prev => ({ ...prev, dietQuality: e.target.value }))}
                helperText="Overall dietary habits and nutrition quality"
                required
              >
                <MenuItem value="1">1 - Poor (high processed foods, low fruits/vegetables)</MenuItem>
                <MenuItem value="2">2 - Fair (some healthy choices, room for improvement)</MenuItem>
                <MenuItem value="3">3 - Good (balanced diet, moderate healthy choices)</MenuItem>
                <MenuItem value="4">4 - Very Good (mostly healthy, occasional treats)</MenuItem>
                <MenuItem value="5">5 - Excellent (consistently healthy, well-balanced)</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Medical History'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default MedicalHistoryForm