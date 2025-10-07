import React from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material'
import { useGetPatientQuery, useGetKidneyMetricsQuery } from '../services/api'
import Scene from '../components/3d/Scene'

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: patient, isLoading: patientLoading } = useGetPatientQuery(id!)
  const { data: kidneyMetrics, isLoading: metricsLoading } = useGetKidneyMetricsQuery(id!)

  if (patientLoading || metricsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Typography>Loading patient data...</Typography>
      </Box>
    )
  }

  if (!patient) {
    return (
      <Box>
        <Typography variant="h5" color="error">
          Patient not found
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {patient.demographics.firstName} {patient.demographics.lastName}
      </Typography>

      <Grid container spacing={3}>
        {/* Patient Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Patient Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Date of Birth
              </Typography>
              <Typography variant="body1">
                {new Date(patient.demographics.dateOfBirth).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Gender
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                {patient.demographics.gender}
              </Typography>
            </Box>
            {kidneyMetrics && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  CKD Stage
                </Typography>
                <Chip
                  label={`Stage ${kidneyMetrics.stage}`}
                  color={kidneyMetrics.stage <= 2 ? 'success' : kidneyMetrics.stage <= 3 ? 'warning' : 'error'}
                />
              </Box>
            )}
          </Paper>
        </Grid>

        {/* 3D Visualization */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              3D Kidney Model
            </Typography>
            <Scene patientData={{ kidneyMetrics }} />
          </Paper>
        </Grid>

        {/* Lab Results */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Lab Results
            </Typography>
            <Grid container spacing={2}>
              {patient.labResults.slice(0, 4).map((result) => (
                <Grid item xs={12} sm={6} md={3} key={result.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {result.testName}
                      </Typography>
                      <Typography variant="h6" color={result.isAbnormal ? 'error.main' : 'text.primary'}>
                        {result.value} {result.unit}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(result.date).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PatientDetail