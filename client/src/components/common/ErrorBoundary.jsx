import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-5">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
              An unexpected error occurred while rendering this view. Please try reloading the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-sm shadow-md transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
