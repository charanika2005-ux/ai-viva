import { Component } from 'react'
import { Zap, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#020617',
          color: '#e2e8f0',
          fontFamily: "'Inter', system-ui, sans-serif",
          padding: '2rem',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '420px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <Zap color="white" size={28} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              The app failed to load. Check the console for errors.
            </p>
            {this.state.error && (
              <pre style={{
                fontSize: '0.75rem',
                color: '#ef4444',
                backgroundColor: '#1e293b',
                borderRadius: '12px',
                padding: '1rem',
                marginTop: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'left',
                overflow: 'auto',
                maxHeight: '160px',
                border: '1px solid #334155',
              }}>
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.5rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                color: 'white',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={16} />
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
