import React from 'react'
import { Box, Typography, Card, CardContent, Chip, Divider } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

interface PredictionHistoryProps {
  patientId: string
}

interface HistoryItem {
  id: string
  timestamp: string
  stage: number
  risk_level: string
  confidence: number
}

const PredictionHistory: React.FC<PredictionHistoryProps> = ({ patientId }) => {
  const themeMode = useSelector((state: RootState) => state.ui.theme)
  
  // Mock data - replace with actual API call
  const predictions: HistoryItem[] = [
    {
      id: '1',
      timestamp: '2024-01-15T10:30:00Z',
      stage: 3,
      risk_level: 'high',
      confidence: 87.5
    },
    {
      id: '2', 
      timestamp: '2024-01-10T14:20:00Z',
      stage: 3,
      risk_level: 'medium',
      confidence: 82.1
    }
  ]

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
        
        {predictions.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {predictions.map((prediction, index) => (
              <Box key={prediction.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(prediction.timestamp).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={`Stage ${prediction.stage}`}
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
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Confidence: {prediction.confidence}%
                </Typography>
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