import React from 'react'
import { Box, Typography, Card, CardContent, Grid, Chip, LinearProgress, Avatar, CircularProgress } from '@mui/material'
import { TrendingUp, TrendingDown, Assessment, Timeline, Warning, CheckCircle } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { useGetPatientsQuery, useGetMLPredictionQuery, useGetRiskFactorsQuery, useGetTrendsQuery, useValidatePatientDataQuery } from '../services/api'

const Analytics: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.ui.theme)
  
  // Fetch real data from backend
  const { data: patients } = useGetPatientsQuery()
  const currentPatient = patients?.[0]
  const { data: validationData } = useValidatePatientDataQuery(
    currentPatient?.id || '', 
    { skip: !currentPatient?.id }
  )
  const { data: mlPrediction, isLoading: predictionLoading } = useGetMLPredictionQuery(
    currentPatient?.id || '', 
    { skip: !currentPatient?.id }
  )
  const { data: riskFactors } = useGetRiskFactorsQuery(
    currentPatient?.id || '', 
    { skip: !currentPatient?.id }
  )
  const { data: trends } = useGetTrendsQuery(
    currentPatient?.id || '', 
    { skip: !currentPatient?.id }
  )

  if (predictionLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!mlPrediction) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">No analytics data available</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      p: 3, 
      height: '100vh', 
      overflow: 'auto', 
      background: themeMode === 'dark' 
        ? 'linear-gradient(135deg, rgba(0,212,255,0.02) 0%, rgba(255,107,53,0.02) 100%)' 
        : 'linear-gradient(135deg, rgba(248,250,252,1) 0%, rgba(241,245,249,1) 100%)'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Assessment sx={{ color: '#00d4ff' }} />
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">AI-powered kidney health analysis and predictions</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* ML Prediction */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: themeMode === 'dark' 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
              : '#ffffff',
            border: themeMode === 'dark' 
              ? '1px solid rgba(255,71,87,0.3)' 
              : '1px solid rgba(255,71,87,0.2)',
            height: '100%' 
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar sx={{ width: 60, height: 60, bgcolor: '#ff4757', mx: 'auto', mb: 2 }}>
                <Assessment sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h6" sx={{ color: '#ff4757', mb: 1 }}>ML Prediction</Typography>
              <Chip label={mlPrediction?.result || 'No Prediction'} sx={{ 
                bgcolor: themeMode === 'dark' ? 'rgba(255,71,87,0.2)' : 'rgba(255,71,87,0.1)', 
                color: '#ff4757', 
                mb: 2 
              }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="h3" sx={{ color: '#ff4757', fontWeight: 700 }}>
                  {Math.round((mlPrediction?.confidence || 0) * 100)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">Confidence Level</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(mlPrediction?.confidence || 0) * 100} 
                sx={{ 
                  bgcolor: themeMode === 'dark' ? 'rgba(255,71,87,0.1)' : 'rgba(255,71,87,0.08)', 
                  '& .MuiLinearProgress-bar': { bgcolor: '#ff4757' } 
                }} 
              />
              {validationData && !validationData.is_ready_for_prediction && (
                <Typography variant="caption" sx={{ color: '#ffaa00', mt: 1, display: 'block' }}>
                  Data incomplete ({Math.round(validationData.completeness_score)}%)
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Key Trends */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            background: themeMode === 'dark' 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
              : '#ffffff',
            border: themeMode === 'dark' 
              ? '1px solid rgba(0,212,255,0.3)' 
              : '1px solid rgba(0,212,255,0.2)'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#00d4ff', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Timeline /> Key Trends (Last 6 Months)
              </Typography>
              <Grid container spacing={2}>
                {trends?.map((trend, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: themeMode === 'dark' 
                        ? `rgba(${trend.color?.slice(1).match(/.{2}/g)?.map((x: string) => parseInt(x, 16)).join(',')}, 0.1)` 
                        : `rgba(${trend.color?.slice(1).match(/.{2}/g)?.map((x: string) => parseInt(x, 16)).join(',')}, 0.05)`,
                      borderRadius: 1, 
                      border: `1px solid ${trend.color}30` 
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                          {trend.metric}
                        </Typography>
                        {trend.trend === 'up' ? 
                          <TrendingUp sx={{ color: trend.color, fontSize: 16 }} /> : 
                          <TrendingDown sx={{ color: trend.color, fontSize: 16 }} />
                        }
                      </Box>
                      <Typography variant="h6" sx={{ color: trend.color, fontWeight: 700 }}>
                        {trend.value}
                      </Typography>
                      <Typography variant="caption" sx={{ color: trend.color }}>
                        {trend.change > 0 ? '+' : ''}{trend.change}% change
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Factors */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: themeMode === 'dark' 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
              : '#ffffff',
            border: themeMode === 'dark' 
              ? '1px solid rgba(255,170,0,0.3)' 
              : '1px solid rgba(255,170,0,0.2)'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ffaa00', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning /> Risk Factors
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {riskFactors?.map((factor, index) => (
                  <Box key={index} sx={{ 
                    p: 2, 
                    bgcolor: themeMode === 'dark' ? 'rgba(255,170,0,0.05)' : 'rgba(255,170,0,0.03)', 
                    borderRadius: 1, 
                    border: themeMode === 'dark' ? '1px solid rgba(255,170,0,0.1)' : '1px solid rgba(255,170,0,0.08)'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{factor.name}</Typography>
                      <Chip 
                        label={factor.modifiable ? 'Modifiable' : 'Non-modifiable'} 
                        size="small" 
                        sx={{ 
                          bgcolor: factor.modifiable 
                            ? (themeMode === 'dark' ? 'rgba(0,255,136,0.2)' : 'rgba(0,255,136,0.1)') 
                            : (themeMode === 'dark' ? 'rgba(148,163,184,0.2)' : 'rgba(148,163,184,0.1)'),
                          color: factor.modifiable ? '#00ff88' : '#94a3b8' 
                        }} 
                      />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={factor.impact} 
                      sx={{ 
                        mb: 1, 
                        bgcolor: themeMode === 'dark' ? 'rgba(255,170,0,0.1)' : 'rgba(255,170,0,0.08)', 
                        '& .MuiLinearProgress-bar': { bgcolor: '#ffaa00' } 
                      }} 
                    />
                    <Typography variant="caption" color="text.secondary">Impact: {factor.impact}%</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: themeMode === 'dark' 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
              : '#ffffff',
            border: themeMode === 'dark' 
              ? '1px solid rgba(0,255,136,0.3)' 
              : '1px solid rgba(0,255,136,0.2)'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#00ff88', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle /> Recommendations
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {mlPrediction.recommendations?.map((rec: string, index: number) => (
                  <Box key={index} sx={{ 
                    p: 2, 
                    bgcolor: themeMode === 'dark' ? 'rgba(0,255,136,0.05)' : 'rgba(0,255,136,0.03)', 
                    borderRadius: 1, 
                    border: themeMode === 'dark' ? '1px solid rgba(0,255,136,0.1)' : '1px solid rgba(0,255,136,0.08)',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2 
                  }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: '#00ff88',
                      boxShadow: '0 0 8px #00ff88'
                    }} />
                    <Typography variant="body2">{rec}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Model Information */}
        <Grid item xs={12}>
          <Card sx={{ 
            background: themeMode === 'dark' 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
              : '#ffffff',
            border: themeMode === 'dark' 
              ? '1px solid rgba(0,212,255,0.3)' 
              : '1px solid rgba(0,212,255,0.2)'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#00d4ff', mb: 3 }}>Model Information</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#00d4ff', fontWeight: 700 }}>
                      {mlPrediction.modelVersion}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Model Version</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#00ff88', fontWeight: 700 }}>
                      {new Date(mlPrediction.timestamp).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Analysis Date</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#ffaa00', fontWeight: 700 }}>
                      {Object.keys(mlPrediction.inputMetrics).length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Input Parameters</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Analytics