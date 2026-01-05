import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext' // ✅ EKLENDİ
import theme from './theme'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider> {/* ✅ EKLENDİ */}
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider> {/* ✅ EKLENDİ */}
    </ThemeProvider>
  </StrictMode>,
)