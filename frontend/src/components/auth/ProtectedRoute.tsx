import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '../../stores/authStore';

export default function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!accessToken || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
