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

  Typography
} from '@mui/material'
import { useAddKidneyMetricsMutation } from '../../services/api'

interface KidneyMetricsFormProps {
  open: boolean
  onClose: () => void
  patientId: string
  currentMetrics?: any
  onSuccess?: () => void
}

const KidneyMetricsForm: React.FC<KidneyMetricsFormProps> = ({
  open,
  onClose,
  patientId,
  currentMetrics,
  onSuccess
}) => {
  const [addKidneyMetrics, { isLoading }] = useAddKidneyMetricsMutation()
  
  const [formData, setFormData] = useState({
    egfr: '',
    creatinine: '',
    bun: '',
    proteinuria: '',
    systolic_bp: '',
    diastolic_bp: '',
    stage: ''
  })

  useEffect(() => {
    if (currentMetrics && open) {
      setFormData({
        egfr: currentMetrics.eGFR?.toString() || '',
        creatinine: currentMetrics.creatinine?.toString() || '',
        bun: currentMetrics.bun?.toString() || '',
        proteinuria: currentMetrics.proteinuria?.toString() || '',
        systolic_bp: currentMetrics.bloodPressure?.systolic?.toString() || '',
        diastolic_bp: currentMetrics.bloodPressure?.diastolic?.toString() || '',
        stage: currentMetrics.stage?.toString() || ''
      })
    } else if (open && !currentMetrics) {
      setFormData({
        egfr: '',
        creatinine: '',
        bun: '',
        proteinuria: '',
        systolic_bp: '',
        diastolic_bp: '',
        stage: ''
      })
    }
  }, [currentMetrics, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addKidneyMetrics({
        patientId,
        data: {
          egfr: parseFloat(formData.egfr),
          creatinine: parseFloat(formData.creatinine),

          proteinuria: parseFloat(formData.proteinuria),
          systolic_bp: parseInt(formData.systolic_bp),
          diastolic_bp: parseInt(formData.diastolic_bp),
          stage: parseInt(formData.stage)
        }
      }).unwrap()
      
      onSuccess?.()
      onClose()
      setFormData({
        egfr: '',
        creatinine: '',
        bun: '',
        proteinuria: '',
        systolic_bp: '',
        diastolic_bp: '',
        stage: ''
      })
    } catch (error) {
      console.error('Failed to add kidney metrics:', error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{currentMetrics ? 'Update' : 'Add'} Kidney Metrics</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enter the latest kidney function measurements for this patient.
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="eGFR"
                type="number"
                value={formData.egfr}
                onChange={(e) => setFormData(prev => ({ ...prev, egfr: e.target.value }))}
                helperText="mL/min/1.73m²"
                inputProps={{ step: 0.1, min: 0 }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Creatinine"
                type="number"
                value={formData.creatinine}
                onChange={(e) => setFormData(prev => ({ ...prev, creatinine: e.target.value }))}
                helperText="mg/dL"
                inputProps={{ step: 0.1, min: 0 }}
                required
              />
            </Grid>
            

            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Proteinuria"
                type="number"
                value={formData.proteinuria}
                onChange={(e) => setFormData(prev => ({ ...prev, proteinuria: e.target.value }))}
                helperText="mg/g (Protein in urine)"
                inputProps={{ step: 0.1, min: 0 }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="CKD Stage"
                value={formData.stage}
                onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value }))}
                required
              >
                <MenuItem value={0}>Stage 0 (Normal - Healthy)</MenuItem>
                <MenuItem value={1}>Stage 1 (Normal/High)</MenuItem>
                <MenuItem value={2}>Stage 2 (Mild)</MenuItem>
                <MenuItem value={3}>Stage 3 (Moderate)</MenuItem>
                <MenuItem value={4}>Stage 4 (Severe)</MenuItem>
                <MenuItem value={5}>Stage 5 (Kidney Failure)</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Blood Pressure</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Systolic BP"
                type="number"
                value={formData.systolic_bp}
                onChange={(e) => setFormData(prev => ({ ...prev, systolic_bp: e.target.value }))}
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
                value={formData.diastolic_bp}
                onChange={(e) => setFormData(prev => ({ ...prev, diastolic_bp: e.target.value }))}
                helperText="mmHg"
                inputProps={{ min: 0, max: 200 }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? (currentMetrics ? 'Updating...' : 'Adding...') : (currentMetrics ? 'Update Metrics' : 'Add Metrics')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default KidneyMetricsForm