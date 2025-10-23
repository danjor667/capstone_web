import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  sidebarOpen: boolean
  selectedView: '3d' | 'charts' | 'table'
  theme: 'light' | 'dark'
  notifications: Notification[]
}

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  timestamp: string
}

const initialState: UIState = {
  sidebarOpen: true,
  selectedView: '3d',
  theme: 'dark',
  notifications: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSelectedView: (state, action: PayloadAction<'3d' | 'charts' | 'table'>) => {
      state.selectedView = action.payload
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
  },
})

export const { 
  toggleSidebar, 
  setSelectedView, 
  setTheme, 
  addNotification, 
  removeNotification 
} = uiSlice.actions
export default uiSlice.reducer