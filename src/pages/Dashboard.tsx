import React from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material'
import Scene from '../components/3d/Scene'
import { useGetPatientsQuery } from '../services/api'

const Dashboard: React.FC = () => {
  const { data: patients, isLoading } = useGetPatientsQuery()

  // Mock patient data for demonstration
  const mockPatientData = {
    kidneyMetrics: {
      eGFR: 45,
      creatinine: 2.1,
      proteinuria: 150,
      bloodPressure: { systolic: 140, diastolic: 90 },
      stage: 3 as const,
      progression: {
        trend: 'declining' as const,
        rateOfChange: -2.5,
        predictedStage: 4 as const,
        timeToNextStage: 18,
        riskFactors: []
      },
      lastUpdated: new Date().toISOString()
    }
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Typography>Loading dashboard...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4, position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              width: 4, 
              height: 40, 
              backgroundColor: '#00d4ff',
              mr: 2,
              boxShadow: '0 0 10px #00d4ff',
            }}
          />
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.05em',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
              }}
            >
              PATIENT ANALYSIS
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#94a3b8',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              }}
            >
              // Real-time nephrology monitoring system
            </Typography>
          </Box>
        </Box>
        
        {/* Status Bar */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 3,
            p: 2,
            backgroundColor: 'rgba(0, 212, 255, 0.05)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00ff88', mr: 1, boxShadow: '0 0 10px #00ff88' }} />
            <Typography variant="caption" sx={{ color: '#00ff88', fontFamily: 'monospace' }}>SYSTEM ACTIVE</Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace' }}>PATIENT ID: CKD-2024-001</Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace' }}>LAST UPDATE: {new Date().toLocaleTimeString()}</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Patient Metrics */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {/* eGFR Card */}
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)',
                  border: '1px solid rgba(255, 170, 0, 0.3)',
                  boxShadow: '0 0 20px rgba(255, 170, 0, 0.1)',
                }}
              >
                <CardContent sx={{ p: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ width: 2, height: 12, backgroundColor: '#ffaa00', mr: 0.75, boxShadow: '0 0 6px #ffaa00' }} />
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#ffaa00', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                      EGFR
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#ffffff', mb: 0.25 }}>
                    {mockPatientData.kidneyMetrics.eGFR}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.65rem' }}>
                    mL/min/1.73m²
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)', border: '1px solid rgba(255, 71, 87, 0.3)', boxShadow: '0 0 20px rgba(255, 71, 87, 0.1)' }}>
                <CardContent sx={{ p: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ width: 2, height: 12, backgroundColor: '#ff4757', mr: 0.75, boxShadow: '0 0 6px #ff4757' }} />
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#ff4757', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                      STAGE
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#ffffff', mb: 0.25 }}>
                    {mockPatientData.kidneyMetrics.stage}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.65rem' }}>
                    CKD Stage
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)', border: '1px solid rgba(0, 212, 255, 0.3)', boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)' }}>
                <CardContent sx={{ p: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ width: 2, height: 12, backgroundColor: '#00d4ff', mr: 0.75, boxShadow: '0 0 6px #00d4ff' }} />
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#00d4ff', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                      BP
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#ffffff', mb: 0.25 }}>
                    {mockPatientData.kidneyMetrics.bloodPressure.systolic}/{mockPatientData.kidneyMetrics.bloodPressure.diastolic}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.65rem' }}>
                    mmHg
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* 3D Visualization - Full Width */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 0,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              boxShadow: '0 0 30px rgba(0, 212, 255, 0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box 
              sx={{ 
                p: 2, 
                borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
                background: 'linear-gradient(90deg, rgba(0, 212, 255, 0.1) 0%, transparent 100%)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: '#00d4ff',
                      fontSize: '0.875rem',
                      letterSpacing: '0.1em',
                    }}
                  >
                    3D NEPHRO SCAN
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00ff88', boxShadow: '0 0 8px #00ff88' }} />
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ffaa00', boxShadow: '0 0 8px #ffaa00' }} />
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ff4757', boxShadow: '0 0 8px #ff4757' }} />
                </Box>
              </Box>
            </Box>
            
            {/* 3D Scene */}
            <Box sx={{ height: '600px' }}>
              <Scene patientData={mockPatientData} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard