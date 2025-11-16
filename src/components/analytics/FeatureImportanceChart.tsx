import React from 'react'
import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import { Science } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

interface FeatureImportanceChartProps {
  modelMetrics: any
}

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ modelMetrics }) => {
  const themeMode = useSelector((state: RootState) => state.ui.theme)

  const feature_importance = modelMetrics?.feature_importance || {}
  const chartData = Object.entries(feature_importance)
    .map(([feature, data]: [string, any]) => ({
      feature: feature.replace(/([A-Z])/g, ' $1').trim(),
      importance: (data.importance * 100).toFixed(1),
      relevance: data.clinical_relevance
    }))
    .sort((a, b) => parseFloat(b.importance) - parseFloat(a.importance))
    .slice(0, 8)

  const getRelevanceColor = (relevance: string) => {
    const baseColor = themeMode === 'dark' ? '#64748b' : '#475569'
    switch (relevance) {
      case 'Critical': return themeMode === 'dark' ? '#94a3b8' : '#334155'
      case 'High': return themeMode === 'dark' ? '#78716c' : '#57534e'
      case 'Medium': return themeMode === 'dark' ? '#6b7280' : '#4b5563'
      case 'Low': return baseColor
      default: return '#9e9e9e'
    }
  }

  return (
    <Card sx={{ 
      bgcolor: themeMode === 'dark' ? '#1e293b' : '#ffffff',
      border: themeMode === 'dark' 
        ? '1px solid rgba(148,163,184,0.2)' 
        : '1px solid rgba(226,232,240,1)',
      height: '400px'
    }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: themeMode === 'dark' ? '#e2e8f0' : '#334155', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Science /> Feature Importance
        </Typography>
        
        <Box sx={{ height: '280px', mb: 2 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                <XAxis 
                  dataKey="feature" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={10}
                  stroke={themeMode === 'dark' ? '#ffffff' : '#000000'}
                />
                <YAxis 
                  fontSize={10}
                  stroke={themeMode === 'dark' ? '#ffffff' : '#000000'}
                />
                <Bar dataKey="importance" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRelevanceColor(entry.relevance)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="body2" color="text.secondary">No feature importance data available</Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Critical" size="small" sx={{ bgcolor: themeMode === 'dark' ? '#94a3b8' : '#334155', color: 'white' }} />
          <Chip label="High" size="small" sx={{ bgcolor: themeMode === 'dark' ? '#78716c' : '#57534e', color: 'white' }} />
          <Chip label="Medium" size="small" sx={{ bgcolor: themeMode === 'dark' ? '#6b7280' : '#4b5563', color: 'white' }} />
          <Chip label="Low" size="small" sx={{ bgcolor: themeMode === 'dark' ? '#64748b' : '#475569', color: 'white' }} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default FeatureImportanceChart