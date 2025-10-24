import { store } from '../store/store'
import { addNotification } from '../store/slices/uiSlice'

class WebSocketService {
  private socket: WebSocket | null = null
  private currentPatientId: string | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private messageHandlers: ((data: any) => void)[] = []

  addMessageHandler(handler: (data: any) => void) {
    this.messageHandlers.push(handler)
  }

  removeMessageHandler(handler: (data: any) => void) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler)
  }

  private notifyHandlers(data: any) {
    this.messageHandlers.forEach(handler => {
      try {
        handler(data)
      } catch (error) {
        console.error('Error in message handler:', error)
      }
    })
  }

  connect() {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/'
    const token = localStorage.getItem('token')
    
    if (!token) {
      console.log('No token available, skipping WebSocket connection')
      return
    }
    
    this.socket = new WebSocket(`${wsUrl}?token=${token}`)

    this.socket.onopen = () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
    }

    this.socket.onclose = () => {
      console.log('WebSocket disconnected')
      this.handleReconnect()
    }

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.handleMessage(data)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
  }

  private handleMessage(data: any) {
    // Notify all handlers first
    this.notifyHandlers(data)
    
    switch (data.type) {
      case 'patient_update':
        store.dispatch(
          store.getState().api.util.invalidateTags([{ type: 'KidneyMetrics', id: data.patient_id }])
        )
        break
      
      case 'new_alert':
        store.dispatch(addNotification({
          id: data.alert.id,
          message: data.alert.message,
          type: data.alert.type === 'critical' ? 'error' : data.alert.type === 'warning' ? 'warning' : 'info',
          timestamp: data.alert.timestamp
        }))
        
        store.dispatch(
          store.getState().api.util.invalidateTags(['Alert'])
        )
        break
      
      case 'lab_result':
        store.dispatch(
          store.getState().api.util.invalidateTags([{ type: 'LabResult', id: data.patient_id }])
        )
        break
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect()
      }, 1000 * this.reconnectAttempts)
    }
  }

  subscribeToPatient(patientId: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN && patientId !== this.currentPatientId) {
      if (this.currentPatientId) {
        this.socket.send(JSON.stringify({
          type: 'unsubscribe',
          patient_id: this.currentPatientId
        }))
      }
      
      this.socket.send(JSON.stringify({
        type: 'subscribe',
        patient_id: patientId
      }))
      this.currentPatientId = patientId
    }
  }

  unsubscribeFromPatient() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN && this.currentPatientId) {
      this.socket.send(JSON.stringify({
        type: 'unsubscribe',
        patient_id: this.currentPatientId
      }))
      this.currentPatientId = null
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
      this.currentPatientId = null
    }
  }
}

export const wsService = new WebSocketService()