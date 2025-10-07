import { io, Socket } from 'socket.io-client'
import { store } from '../store/store'
import { addNotification } from '../store/slices/uiSlice'

class WebSocketService {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  connect(userId: string) {
    if (this.socket?.connected) return

    this.socket = io((import.meta.env.VITE_WS_URL as string) || 'ws://localhost:3001', {
      auth: {
        userId,
        token: localStorage.getItem('auth_token')
      },
      transports: ['websocket']
    })

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
      this.handleReconnect()
    })

    this.socket.on('patient_data_update', (data) => {
      // Handle real-time patient data updates
      console.log('Patient data updated:', data)
    })

    this.socket.on('alert', (alert) => {
      store.dispatch(addNotification({
        id: Date.now().toString(),
        message: alert.message,
        type: alert.type,
        timestamp: new Date().toISOString()
      }))
    })

    this.socket.on('kidney_metrics_update', (metrics) => {
      // Handle real-time kidney metrics updates
      console.log('Kidney metrics updated:', metrics)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.socket?.connect()
      }, 1000 * this.reconnectAttempts)
    }
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    }
  }
}

export const wsService = new WebSocketService()