import axios from 'axios'

class AuthService {
  private static baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

  static getToken(): string | null {
    return localStorage.getItem('token')
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  }

  static setTokens(access: string, refresh: string): void {
    localStorage.setItem('token', access)
    localStorage.setItem('refreshToken', refresh)
    this.setAuthHeader()
  }

  static setAuthHeader(): void {
    const token = this.getToken()
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }

  static async login(email: string, password: string): Promise<any> {
    const response = await axios.post(`${this.baseURL}/auth/login/`, {
      email,
      password
    })
    
    if (response.data.success) {
      this.setTokens(response.data.data.access, response.data.data.refresh)
      return response.data
    }
    throw new Error('Login failed')
  }

  static async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) throw new Error('No refresh token')

    const response = await axios.post(`${this.baseURL}/auth/refresh/`, {
      refresh: refreshToken
    })
    
    const newToken = response.data.data.access
    localStorage.setItem('token', newToken)
    this.setAuthHeader()
    return newToken
  }

  static logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    delete axios.defaults.headers.common['Authorization']
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

// Set up axios interceptor for token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && AuthService.getRefreshToken()) {
      try {
        await AuthService.refreshToken()
        return axios.request(error.config)
      } catch (refreshError) {
        AuthService.logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default AuthService