import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

/**
 * Top-level error boundary. Without this, a single render error anywhere in the
 * tree unmounts the whole React root — every route goes blank ("everything broke").
 * This keeps the app alive and shows a recoverable message instead.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("App crashed:", error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md w-full border border-red-500/40 bg-red-500/10 p-8 space-y-4 text-center">
            <div className="font-mono text-xs uppercase text-red-400">// Something went wrong</div>
            <p className="text-sm text-foreground break-words">{this.state.error.message}</p>
            <button
              onClick={this.handleReset}
              className="font-mono text-xs uppercase border border-primary/40 text-primary px-4 py-2 hover:bg-primary/10 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="block w-full font-mono text-xs uppercase text-muted-foreground hover:text-foreground mt-2"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}