import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Coquette error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, textAlign: 'center', fontFamily: 'monospace' }}>
          <h2 style={{ color: '#FFB5C2', marginBottom: 12 }}>something went wrong!</h2>
          <pre style={{ fontSize: 12, color: '#5D4E4E', background: '#FFE8E8', padding: 16, borderRadius: 8, maxWidth: 500, margin: '0 auto', whiteSpace: 'pre-wrap' }}>
            {this.state.error.toString()}
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
