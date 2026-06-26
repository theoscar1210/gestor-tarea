import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5">
          <div className="alert alert-danger text-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Algo salió mal en esta sección.</strong>
            <div className="mt-3 d-flex gap-2 justify-content-center">
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => this.setState({ hasError: false })}
              >
                Reintentar
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => window.location.reload()}
              >
                Recargar página
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
