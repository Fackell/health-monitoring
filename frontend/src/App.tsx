import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Loading from './components/common/Loading';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ActivitiesPage = lazy(() => import('./pages/ActivitiesPage'));
const ActivityFormPage = lazy(() => import('./pages/ActivityFormPage'));
const ActivityDetailsPage = lazy(() => import('./pages/ActivityDetailsPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />

              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/activities/new" element={<ActivityFormPage />} />
              <Route path="/activities/:id" element={<ActivityDetailsPage />} />
              <Route path="/activities/:id/edit" element={<ActivityFormPage />} />
            </Route>

            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
