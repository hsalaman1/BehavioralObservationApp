import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, copied: false };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (typeof console !== 'undefined') {
      console.error('App error:', error, info);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleCopy = async () => {
    const { error } = this.state;
    if (!error) return;
    const details = `${error.name || 'Error'}: ${error.message}\n\n${error.stack || ''}`;
    try {
      await navigator.clipboard.writeText(details);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch {
      // Clipboard API can fail in non-secure contexts; fall back to a prompt.
      window.prompt('Copy the error details below:', details);
    }
  };

  render() {
    const { error, copied } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
          <h1 className="text-lg font-semibold text-gray-800 mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            Your draft is still saved on this device. Reload the app to continue.
            If the problem persists, copy the details and share them with support.
          </p>
          <p className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded p-2 mb-4 break-words">
            {error.message || 'Unknown error'}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={this.handleReload}
              className="flex-1 min-h-[44px] rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700"
            >
              Reload app
            </button>
            <button
              type="button"
              onClick={this.handleCopy}
              className="flex-1 min-h-[44px] rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
            >
              {copied ? 'Copied!' : 'Copy details'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
