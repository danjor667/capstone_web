import React, { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, Typography
} from '@mui/material'
import { useAddLabResultMutation } from '../../services/api'

interface LabResultsFormProps {
  open: boolean
  onClose: () => void
  patientId: string
  onSuccess?: () => void
}

const LabResultsForm: React.FC<LabResultsFormProps> = ({ open, onClose, patientId, onSuccess }) => {
  const [addLabResult, { isLoading }] = useAddLabResultMutation()
  
  const [formData, setFormData] = useState({
    hemoglobin: '',
    bun: '',
    hba1c: '',
    hdlCholesterol: '',
    fastingGlucose: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const labResults = [
        { test_name: 'Hemoglobin', value: parseFloat(formData.hemoglobin), unit: 'g/dL', category: 'blood' },
        { test_name: 'BUN', value: parseFloat(formData.bun), unit: 'mg/dL', category: 'blood' },
        { test_name: 'HbA1c', value: parseFloat(formData.hba1c), unit: '%', category: 'blood' },
        { test_name: 'HDL Cholesterol', value: parseFloat(formData.hdlCholesterol), unit: 'mg/dL', category: 'blood' },
        { test_name: 'Fasting Glucose', value: parseFloat(formData.fastingGlucose), unit: 'mg/dL', category: 'blood' }
      ].filter(lab => !isNaN(lab.value)).map(lab => ({
        ...lab,
        test_date: new Date().toISOString()
      }))

      await addLabResult({ patientId, data: labResults }).unwrap()
      
      onSuccess?.()
      onClose()
      setFormData({ hemoglobin: '', bun: '', hba1c: '', hdlCholesterol: '', fastingGlucose: '' })
    } catch (error) {
      console.error('Failed to add lab results:', error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Lab Results</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Required lab tests for ML prediction analysis
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hemoglobin"
                type="number"
                value={formData.hemoglobin}
                onChange={(e) => setFormData(prev => ({ ...prev, hemoglobin: e.target.value }))}
                helperText="g/dL (Normal: 12-16)"
                inputProps={{ step: 0.1, min: 0 }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="BUN (Blood Urea Nitrogen)"
                type="number"
                value={formData.bun}
                onChange={(e) => setFormData(prev => ({ ...prev, bun: e.target.value }))}
                helperText="mg/dL (Normal: 7-20)"
                inputProps={{ step: 0.1, min: 0 }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="HbA1c"
                type="number"
                value={formData.hba1c}
                onChange={(e) => setFormData(prev => ({ ...prev, hba1c: e.target.value }))}
                helperText="% (Normal: <5.7%)"
                inputProps={{ step: 0.1, min: 0 }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="HDL Cholesterol"
                type="number"
                value={formData.hdlCholesterol}
                onChange={(e) => setFormData(prev => ({ ...prev, hdlCholesterol: e.target.value }))}
                helperText="mg/dL (Normal: >40)"
                inputProps={{ step: 0.1, min: 0 }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fasting Glucose"
                type="number"
                value={formData.fastingGlucose}
                onChange={(e) => setFormData(prev => ({ ...prev, fastingGlucose: e.target.value }))}
                helperText="mg/dL (Normal: 70-100)"
                inputProps={{ step: 0.1, min: 0 }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Lab Results'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default LabResultsForm