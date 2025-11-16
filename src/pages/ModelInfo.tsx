import React from 'react'
import { Box, Typography, Grid, CircularProgress } from '@mui/material'
import { Psychology } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { useGetMLModelMetricsQuery } from '../services/api'
import ModelMetricsCard from '../components/analytics/ModelMetricsCard'
import PerformanceMetricsCard from '../components/analytics/PerformanceMetricsCard'
import FeatureEngineeringCard from '../components/analytics/FeatureEngineeringCard'
import FeatureImportanceChart from '../components/analytics/FeatureImportanceChart'
import ConfidenceThresholds from '../components/analytics/ConfidenceThresholds'

const ModelInfo: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.ui.theme)
  
  const { data: modelMetrics, isLoading: metricsLoading, error } = useGetMLModelMetricsQuery()

  if (metricsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    console.warn('ML Model Metrics API Error:', error)
  }

  return (
    <Box sx={{ 
      p: 3, 
      height: '100vh', 
      overflow: 'auto', 
      bgcolor: themeMode === 'dark' ? '#0f1419' : '#f8fafc'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Psychology sx={{ color: themeMode === 'dark' ? '#94a3b8' : '#64748b' }} />
          ML Model Information
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive model performance metrics and technical specifications
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Model Info */}
        <Grid item xs={12} md={4}>
          <ModelMetricsCard modelMetrics={modelMetrics} />
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={4}>
          <PerformanceMetricsCard modelMetrics={modelMetrics} />
        </Grid>

        {/* Feature Engineering */}
        <Grid item xs={12} md={4}>
          <FeatureEngineeringCard modelMetrics={modelMetrics} />
        </Grid>

        {/* Confidence Thresholds */}
        <Grid item xs={12} md={6}>
          <ConfidenceThresholds modelMetrics={modelMetrics} />
        </Grid>

        {/* Feature Importance Chart */}
        <Grid item xs={12} md={6}>
          <FeatureImportanceChart modelMetrics={modelMetrics} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default ModelInfo