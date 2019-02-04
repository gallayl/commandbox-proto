import Typography from '@material-ui/core/Typography'
import React from 'react'

export interface ErrorBoundaryState {
  hasError: boolean
  error?: any
  info?: any
}

export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false }

  constructor(props: ErrorBoundary['props']) {
    super(props)
  }

  public static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  public componentDidCatch(error: any, info: any) {
    // You can also log the error to an error reporting service
    console.log(error, info)
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: '4em' }}>
          <Typography variant="h3" color="error">
            Something went wrong :(
          </Typography>
          <Typography variant="body1" color="textPrimary">
            {this.state.error && this.state.error.message}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {this.state.info}
          </Typography>
        </div>
      )
    }

    return this.props.children
  }
}
