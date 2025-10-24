import React, { useEffect, useState } from 'react'
import { Box, Chip, Tooltip } from '@mui/material'
import { Wifi, WifiOff, Sync } from '@mui/icons-material'
import { wsService } from '../../services/websocket'

type ConnectionState = 'connected' | 'disconnected' | 'connecting'

const ConnectionStatus: React.FC = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected')

  useEffect(() => {
    const checkConnection = () => {
      // Check if WebSocket is available and connected
      if (wsService && (wsService as any).socket) {
        const ws = (wsService as any).socket
        switch (ws.readyState) {
          case WebSocket.CONNECTING:
            setConnectionState('connecting')
            break
          case WebSocket.OPEN:
            setConnectionState('connected')
            break
          case WebSocket.CLOSING:
          case WebSocket.CLOSED:
            setConnectionState('disconnected')
            break
          default:
            setConnectionState('disconnected')
        }
      } else {
        setConnectionState('disconnected')
      }
    }

    // Check connection status every 2 seconds
    const interval = setInterval(checkConnection, 2000)
    checkConnection() // Initial check

    return () => clearInterval(interval)
  }, [])

  const getStatusConfig = () => {
    switch (connectionState) {
      case 'connected':
        return {
          icon: <Wifi sx={{ fontSize: 16 }} />,
          label: 'Connected',
          color: '#00ff88',
          tooltip: 'Real-time connection active'
        }
      case 'connecting':
        return {
          icon: <Sync sx={{ fontSize: 16, animation: 'spin 1s linear infinite' }} />,
          label: 'Connecting',
          color: '#ffaa00',
          tooltip: 'Establishing connection...'
        }
      case 'disconnected':
        return {
          icon: <WifiOff sx={{ fontSize: 16 }} />,
          label: 'Offline',
          color: '#ff4757',
          tooltip: 'Real-time connection unavailable'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Tooltip title={config.tooltip}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Chip
          icon={config.icon}
          label={config.label}
          size="small"
          sx={{
            bgcolor: `${config.color}20`,
            color: config.color,
            border: `1px solid ${config.color}40`,
            fontSize: '0.75rem',
            height: 24,
            '& .MuiChip-icon': {
              color: config.color
            }
          }}
        />
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </Box>
    </Tooltip>
  )
}

export default ConnectionStatus