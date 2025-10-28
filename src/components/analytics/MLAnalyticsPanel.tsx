import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material'
import { Psychology, Warning, Refresh } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useGetMLPredictionQuery, useTriggerMLAnalysisMutation, useGetPatientQuery } from '../../services/api'
import DataValidation from './DataValidation'
import PredictionHistory from './PredictionHistory'

interface MLAnalyticsPanelProps {
  patientId: string
}

const MLAnalyticsPanel: React.FC<MLAnalyticsPanelProps> = ({ patientId }) => {
  const themeMode = useSelector((state: RootState) => state.ui.theme)
  const { data: prediction, isLoading, error: predictionError, refetch } = useGetMLPredictionQuery(patientId)
  const { data: patientData } = useGetPatientQuery(patientId)
  const [triggerAnalysis, { isLoading: isAnalyzing }] = useTriggerMLAnalysisMutation()
  const [lastAnalysis, setLastAnalysis] = useState<string | null>(null)

  const handleRunAnalysis = async () => {
    try {
      await triggerAnalysis(patientId).unwrap()
      setLastAnalysis(new Date().toLocaleString())
      refetch()
    } catch (error) {
      console.error('Failed to run ML analysis:', error)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return '#00ff88'
      case 'medium': return '#ffaa00'
      case 'high': return '#ff4757'
      case 'critical': return '#ff3838'
      default: return '#64748b'
    }
  }

  const getStageColor = (stage: number) => {
    if (stage <= 2) return '#00ff88'
    if (stage === 3) return '#ffaa00'
    return '#ff4757'
  }

  if (isLoading) {
    return (
      <Card sx={{ 
        background: themeMode === 'dark' 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
          : '#ffffff',
        border: themeMode === 'dark' 
          ? '1px solid rgba(147,51,234,0.3)' 
          : '1px solid rgba(147,51,234,0.2)'
      }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    )
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ 
          background: themeMode === 'dark' 
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
            : '#ffffff',
          border: themeMode === 'dark' 
            ? '1px solid rgba(147,51,234,0.3)' 
            : '1px solid rgba(147,51,234,0.2)'
        }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ 
            color: '#9333ea', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontWeight: 600 
          }}>
            <Psychology /> ML Analysis
          </Typography>
          <Button
            variant="contained"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            sx={{
              bgcolor: '#9333ea',
              '&:hover': { bgcolor: '#7c3aed' }
            }}
          >
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </Box>

        {predictionError ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            ML prediction service is currently unavailable. Please try again later.
          </Alert>
        ) : prediction ? (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Latest Prediction
              </Typography>
              <Button
                size="small"
                startIcon={<Refresh />}
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                sx={{ color: '#9333ea' }}
              >
                Re-run
              </Button>
            </Box>
            <Box sx={{ mb: 3 }}>
              
              {/* Analysis Info */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Typography variant="caption" color="text.secondary">
                  {new Date(prediction.created_at).toLocaleString()} • Model: {prediction.model_version}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={prediction.prediction_result || 'No Result'}
                  sx={{
                    bgcolor: `${getStageColor(prediction.predicted_stage || 1)}20`,
                    color: getStageColor(prediction.predicted_stage || 1),
                    border: `1px solid ${getStageColor(prediction.predicted_stage || 1)}40`,
                    fontWeight: 600
                  }}
                />
                <Chip
                  label={`${prediction.confidence || 0}% Confidence`}
                  variant="outlined"
                  sx={{ color: themeMode === 'dark' ? '#94a3b8' : '#64748b' }}
                />
                <Chip
                  label={`${prediction.risk_level || 'Unknown'} Risk`}
                  sx={{
                    bgcolor: `${getRiskColor(prediction.risk_level)}20`,
                    color: getRiskColor(prediction.risk_level),
                    border: `1px solid ${getRiskColor(prediction.risk_level)}40`,
                    fontWeight: 600
                  }}
                />
              </Box>
              
              {/* Input Metrics Display */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Input Metrics Used</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4}>
                    <Box sx={{ p: 2, bgcolor: themeMode === 'dark' ? 'rgba(255,170,0,0.1)' : 'rgba(255,170,0,0.05)', borderRadius: 1 }}>
                      <Typography variant="h6" sx={{ color: '#ffaa00' }}>{prediction.input_data?.eGFR || 'N/A'}</Typography>
                      <Typography variant="caption">eGFR</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Box sx={{ p: 2, bgcolor: themeMode === 'dark' ? 'rgba(255,71,87,0.1)' : 'rgba(255,71,87,0.05)', borderRadius: 1 }}>
                      <Typography variant="h6" sx={{ color: '#ff4757' }}>{prediction.input_data?.serumCreatinine || 'N/A'}</Typography>
                      <Typography variant="caption">Creatinine</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Box sx={{ p: 2, bgcolor: themeMode === 'dark' ? 'rgba(0,212,255,0.1)' : 'rgba(0,212,255,0.05)', borderRadius: 1 }}>
                      <Typography variant="h6" sx={{ color: '#00d4ff' }}>{prediction.input_data?.bloodPressure || 'N/A'}</Typography>
                      <Typography variant="caption">Blood Pressure</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Box sx={{ p: 2, bgcolor: themeMode === 'dark' ? 'rgba(147,51,234,0.1)' : 'rgba(147,51,234,0.05)', borderRadius: 1 }}>
                      <Typography variant="h6" sx={{ color: '#9333ea' }}>{prediction.input_data?.age || 'N/A'}</Typography>
                      <Typography variant="caption">Age</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Box sx={{ p: 2, bgcolor: themeMode === 'dark' ? 'rgba(255,107,53,0.1)' : 'rgba(255,107,53,0.05)', borderRadius: 1 }}>
                      <Typography variant="h6" sx={{ color: '#ff6b35' }}>{prediction.input_data?.bloodUrea || 'N/A'}</Typography>
                      <Typography variant="caption">Blood Urea</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Box sx={{ p: 2, bgcolor: themeMode === 'dark' ? 'rgba(0,255,136,0.1)' : 'rgba(0,255,136,0.05)', borderRadius: 1 }}>
                      <Typography variant="h6" sx={{ color: '#00ff88' }}>{prediction.input_data?.hemoglobin || 'N/A'}</Typography>
                      <Typography variant="caption">Hemoglobin</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Model Confidence
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={prediction.confidence || 0}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: themeMode === 'dark' ? 'rgba(147,51,234,0.1)' : 'rgba(147,51,234,0.08)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#9333ea',
                      borderRadius: 4
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {prediction.confidence || 0}%
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                AI Recommendations
              </Typography>
              <List dense>
                {prediction.recommendations?.map((recommendation: string, index: number) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={`• ${recommendation}`}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: '0.875rem',
                          color: themeMode === 'dark' ? '#e2e8f0' : '#374151'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Key Risk Factors
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {(prediction.risk_factors || ['High Creatinine', 'Proteinuria']).map((factor: string, index: number) => (
                  <Chip
                    key={index}
                    label={factor}
                    size="small"
                    icon={<Warning sx={{ fontSize: 16 }} />}
                    sx={{
                      bgcolor: themeMode === 'dark' ? 'rgba(255,71,87,0.1)' : 'rgba(255,71,87,0.05)',
                      color: '#ff4757',
                      border: themeMode === 'dark' ? '1px solid rgba(255,71,87,0.2)' : '1px solid rgba(255,71,87,0.1)'
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              No ML analysis available for this patient. Click "Run Analysis" to generate AI predictions based on current medical data.
            </Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Required data for analysis:</strong>
            </Typography>
            <List dense sx={{ mb: 2 }}>
              <ListItem sx={{ px: 0 }}>
                <ListItemText primary="• Latest kidney metrics (eGFR, creatinine)" />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText primary="• Recent vital signs (blood pressure)" />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText primary="• Patient demographics (age, gender)" />
              </ListItem>
            </List>
          </Box>
        )}

        {isAnalyzing && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Analyzing patient data with AI model...
            </Typography>
          </Box>
        )}
        
        {lastAnalysis && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Last analysis: {lastAnalysis}
          </Typography>
        )}
        </CardContent>
      </Card>
    </Grid>
    
    <Grid item xs={12} md={6}>
      <DataValidation patientData={patientData} />
    </Grid>
    
    <Grid item xs={12} md={6}>
      <PredictionHistory patientId={patientId} />
    </Grid>
  </Grid>
  )
}

export default MLAnalyticsPanel