import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#07090e',
          color: '#f87171',
          padding: '40px',
          fontFamily: 'monospace'
        }}>
          <h2 style={{ fontSize: '20px', color: '#ef4444', marginBottom: '16px' }}>
            Application Error Encountered
          </h2>
          <pre style={{
            background: '#0f172a',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #334155',
            whiteSpace: 'pre-wrap',
            color: '#e2e8f0',
            fontSize: '13px'
          }}>
            {this.state.error?.stack || this.state.error?.message || 'Unknown render error'}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#00f2fe',
              color: '#000',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Reload Roadmap
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
