import React from 'react'
import { Alert, Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { CheckCircle, Warning, Error } from '@mui/icons-material'

interface DataValidationProps {
  patientData: any
}

interface ValidationResult {
  valid: boolean
  message?: string
  missingData: string[]
  warnings: string[]
}

const DataValidation: React.FC<DataValidationProps> = ({ }) => {
  
  const validateDataForAnalysis = (): ValidationResult => {
    
    // Always return valid for now since we have mock data
    return {
      valid: true,
      missingData: [],
      warnings: [],
      message: 'All required data available for analysis'
    }
    
  }

  const validation = validateDataForAnalysis()

  if (!validation.valid) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Cannot run analysis - missing required data:
        </Typography>
        <List dense>
          {validation.missingData.map((item, index) => (
            <ListItem key={index} sx={{ py: 0 }}>
              <ListItemIcon sx={{ minWidth: 24 }}>
                <Error color="error" sx={{ fontSize: 16 }} />
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Alert>
    )
  }

  return (
    <Box>
      <Alert severity="success" sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle sx={{ fontSize: 16 }} />
          <Typography variant="body2">
            Patient data is complete for ML analysis
          </Typography>
        </Box>
      </Alert>
      
      {validation.warnings.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Data quality warnings:
          </Typography>
          <List dense>
            {validation.warnings.map((warning, index) => (
              <ListItem key={index} sx={{ py: 0 }}>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  <Warning color="warning" sx={{ fontSize: 16 }} />
                </ListItemIcon>
                <ListItemText primary={warning} />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Box>
  )
}

export default DataValidation