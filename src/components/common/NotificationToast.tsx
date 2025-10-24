import React, { useEffect, useState } from 'react'
import { Snackbar, Alert, AlertTitle, Box, Chip } from '@mui/material'
import { wsService } from '../../services/websocket'

interface NotificationData {
  id: string
  type: 'patient-update' | 'new-alert' | 'lab-result' | 'ml-prediction'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
}

const NotificationToast: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null)

  useEffect(() => {
    const handleWebSocketMessage = (data: any) => {
      if (data.type === 'notification') {
        const notification: NotificationData = {
          id: Date.now().toString(),
          type: data.notification_type || 'patient-update',
          title: data.title || 'New Update',
          message: data.message || 'A new update is available',
          priority: data.priority || 'medium',
          timestamp: new Date().toISOString()
        }
        
        setNotifications(prev => [...prev, notification])
        setCurrentNotification(notification)
      }
    }

    wsService.addMessageHandler(handleWebSocketMessage)

    return () => {
      wsService.removeMessageHandler(handleWebSocketMessage)
    }
  }, [])

  const handleClose = () => {
    setCurrentNotification(null)
    // Show next notification if any
    setTimeout(() => {
      setNotifications(prev => {
        const remaining = prev.slice(1)
        if (remaining.length > 0) {
          setCurrentNotification(remaining[0])
        }
        return remaining
      })
    }, 300)
  }

  const getSeverity = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error'
      case 'high': return 'warning'
      case 'medium': return 'info'
      case 'low': return 'success'
      default: return 'info'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ff3838'
      case 'high': return '#ff4757'
      case 'medium': return '#ffaa00'
      case 'low': return '#00ff88'
      default: return '#64748b'
    }
  }

  return (
    <Snackbar
      open={!!currentNotification}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {currentNotification && (
        <Alert 
          onClose={handleClose} 
          severity={getSeverity(currentNotification.priority)}
          sx={{ 
            minWidth: 350,
            '& .MuiAlert-message': { width: '100%' }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <AlertTitle sx={{ mb: 0 }}>{currentNotification.title}</AlertTitle>
            <Chip 
              label={currentNotification.priority.toUpperCase()} 
              size="small"
              sx={{
                bgcolor: `${getPriorityColor(currentNotification.priority)}20`,
                color: getPriorityColor(currentNotification.priority),
                border: `1px solid ${getPriorityColor(currentNotification.priority)}40`,
                fontSize: '0.7rem',
                height: 20
              }}
            />
          </Box>
          <Box>
            {currentNotification.message}
          </Box>
          <Box sx={{ mt: 1 }}>
            <Chip 
              label={currentNotification.type.replace('-', ' ').toUpperCase()} 
              size="small" 
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          </Box>
        </Alert>
      )}
    </Snackbar>
  )
}

export default NotificationToast