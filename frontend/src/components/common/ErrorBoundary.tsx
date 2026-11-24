import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl bg-red-50 p-6 text-center text-red-700 dark:bg-red-950 dark:text-red-300">
          <h2 className="text-xl font-semibold">Щось пішло не так</h2>
          <p className="mt-2">Спробуйте перезавантажити сторінку.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Перезавантажити
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
