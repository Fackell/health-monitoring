import { BrowserRouter, Route, Routes, Navigate } from 'react-router';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ActivityFormPage from './pages/ActivityFormPage';
import ActivityDetailsPage from './pages/ActivityDetailsPage';

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
