import React from 'react'
import { Box, Typography, Card, CardContent, Chip, Divider, CircularProgress } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useGetMLPredictionHistoryQuery } from '../../services/api'

interface PredictionHistoryProps {
  patientId: string
}



const PredictionHistory: React.FC<PredictionHistoryProps> = ({ patientId }) => {
  const themeMode = useSelector((state: RootState) => state.ui.theme)
  const { data: predictions = [], isLoading, error } = useGetMLPredictionHistoryQuery(patientId)

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return '#00ff88'
      case 'medium': return '#ffaa00'
      case 'high': return '#ff4757'
      case 'critical': return '#ff3838'
      default: return '#64748b'
    }
  }

  return (
    <Card sx={{
      background: themeMode === 'dark' 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
        : '#ffffff',
      border: themeMode === 'dark' 
        ? '1px solid rgba(147,51,234,0.3)' 
        : '1px solid rgba(147,51,234,0.2)'
    }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#9333ea', mb: 2 }}>
          Analysis History
        </Typography>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography variant="body2" color="text.secondary">
            Unable to load prediction history
          </Typography>
        ) : predictions.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {predictions.slice(0, 3).map((prediction, index) => (
              <Box key={prediction.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(prediction.created_at).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                      {prediction.prediction_result}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={`Stage ${prediction.predicted_stage}`}
                        size="small"
                        sx={{
                          bgcolor: themeMode === 'dark' ? 'rgba(147,51,234,0.2)' : 'rgba(147,51,234,0.1)',
                          color: '#9333ea'
                        }}
                      />
                      <Chip
                        label={prediction.risk_level.toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor: `${getRiskColor(prediction.risk_level)}20`,
                          color: getRiskColor(prediction.risk_level),
                          border: `1px solid ${getRiskColor(prediction.risk_level)}40`
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {prediction.confidence}% confidence
                    </Typography>
                  </Box>
                </Box>
                {index < predictions.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No analysis history available
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default PredictionHistory