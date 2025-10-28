import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { wsService } from '../services/websocket'

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to WebSocket when authenticated
      wsService.connect()
      
      // Store auth token for API calls
      getAccessTokenSilently()
        .then(token => {
          localStorage.setItem('auth_token', token)
        })
        .catch(console.error)
    }

    return () => {
      if (!isAuthenticated) {
        wsService.disconnect()
        localStorage.removeItem('auth_token')
      }
    }
  }, [isAuthenticated, user, getAccessTokenSilently])

  return {
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  }
}