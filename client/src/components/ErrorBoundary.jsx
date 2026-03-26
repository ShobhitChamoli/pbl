import React from 'react';
import { Button } from './UI';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                    <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 border border-red-100 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="text-red-600" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h1>
                        <p className="text-slate-500 mb-6">
                            The application encountered an unexpected error.
                        </p>

                        <div className="bg-slate-100 p-4 rounded-lg text-left mb-6 overflow-auto max-h-48 text-xs font-mono text-slate-700">
                            {this.state.error && this.state.error.toString()}
                        </div>

                        <div className="flex gap-3 justify-center">
                            <Button onClick={this.handleReload} variant="primary">
                                Reload Page
                            </Button>
                            <Button onClick={() => window.location.href = '/'} variant="outline">
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
