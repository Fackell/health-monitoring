import { Outlet } from 'react-router';

import ErrorBoundary from '../common/ErrorBoundary';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';
import useSocketConnection from '../../hooks/useSocketConnection';

export default function Layout() {
  useSocketConnection();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:flex-row">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <Breadcrumbs />

          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      <Footer />
    </div>
  );
}
