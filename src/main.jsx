import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { InterviewProvider } from './context/InterviewContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <InterviewProvider>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1e293b',
                    color: '#e2e8f0',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontFamily: "'Inter', system-ui, sans-serif",
                  },
                  success: {
                    iconTheme: { primary: '#7c3aed', secondary: '#e2e8f0' },
                  },
                  error: {
                    iconTheme: { primary: '#ef4444', secondary: '#e2e8f0' },
                  },
                }}
              />
            </InterviewProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>
  </ErrorBoundary>
)
