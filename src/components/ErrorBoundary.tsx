'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.label ? ` - ${this.props.label}` : ''}]`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-800/50 border border-slate-700 text-center min-h-[200px]">
          <span className="text-4xl mb-3">⚠️</span>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">
            {this.props.label ? `Error en ${this.props.label}` : 'Algo salió mal'}
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Este componente tuvo un problema. Intenta recargar la página.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            🔄 Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
