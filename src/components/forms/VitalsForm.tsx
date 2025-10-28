import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,

  Typography
} from '@mui/material'
import { useAddVitalsMutation } from '../../services/api'

interface VitalsFormProps {
  open: boolean
  onClose: () => void
  patientId: string
  onSuccess?: () => void
}

const VitalsForm: React.FC<VitalsFormProps> = ({
  open,
  onClose,
  patientId,
  onSuccess
}) => {
  const [addVitals, { isLoading }] = useAddVitalsMutation()
  
  const [formData, setFormData] = useState({
    systolicBp: '',
    diastolicBp: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addVitals({
        patientId,
        data: {
          systolicBp: formData.systolicBp ? parseInt(formData.systolicBp) : undefined,
          diastolicBp: formData.diastolicBp ? parseInt(formData.diastolicBp) : undefined,
          heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
          temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          height: formData.height ? parseFloat(formData.height) : undefined
        }
      }).unwrap()
      
      onSuccess?.()
      onClose()
      setFormData({
        systolicBp: '',
        diastolicBp: '',
        heartRate: '',
        temperature: '',
        weight: '',
        height: ''
      })
    } catch (error) {
      console.error('Failed to add vitals:', error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Vital Signs</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Blood Pressure</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Systolic BP"
                type="number"
                value={formData.systolicBp}
                onChange={(e) => setFormData(prev => ({ ...prev, systolicBp: e.target.value }))}
                helperText="mmHg"
                inputProps={{ min: 0, max: 300 }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Diastolic BP"
                type="number"
                value={formData.diastolicBp}
                onChange={(e) => setFormData(prev => ({ ...prev, diastolicBp: e.target.value }))}
                helperText="mmHg"
                inputProps={{ min: 0, max: 200 }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Heart Rate"
                type="number"
                value={formData.heartRate}
                onChange={(e) => setFormData(prev => ({ ...prev, heartRate: e.target.value }))}
                helperText="bpm"
                inputProps={{ min: 0, max: 300 }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Temperature"
                type="number"
                value={formData.temperature}
                onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                helperText="°F"
                inputProps={{ step: 0.1, min: 90, max: 110 }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight"
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                helperText="kg"
                inputProps={{ step: 0.1, min: 0 }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                helperText="cm"
                inputProps={{ step: 0.1, min: 0 }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Vitals'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default VitalsForm