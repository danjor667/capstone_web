import React from 'react'
import { IconButton } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { setTheme } from '../store/slices/uiSlice'

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.ui.theme)

  const handleToggle = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <IconButton onClick={handleToggle} color="inherit">
      {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  )
}

export default ThemeToggle