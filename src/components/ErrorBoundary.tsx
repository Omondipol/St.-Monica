import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App uncaught rendering error:', error, errorInfo);
  }

  public handleReload = () => {
    try {
      localStorage.removeItem('st_monica_songs_data_v5');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#0C2340] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#0C2340]/15 p-6 sm:p-8 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#1058A8]/10 text-[#1058A8] flex items-center justify-center mx-auto text-2xl font-bold font-serif">
              M
            </div>
            <h2 className="text-xl font-bold text-[#0C2340] font-serif">
              St. Monica Catholic Choir
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We encountered a temporary interface loading issue. Click below to refresh the choir portal.
            </p>
            <div className="pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-6 rounded-xl bg-[#1058A8] hover:bg-[#0E56A6] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Reload Website
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
