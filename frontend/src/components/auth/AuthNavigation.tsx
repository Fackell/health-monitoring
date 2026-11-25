import { Link, NavLink, useNavigate } from 'react-router';
import toast from 'react-hot-toast';

import Button from '../common/Button';
import { logout } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';

export default function AuthNavigation() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    const refreshToken = useAuthStore.getState().refreshToken;

    try {
      if (refreshToken) {
        await logout(refreshToken);
      }
    } catch {
      // Локальний вихід виконується навіть за відсутності зв'язку із сервером.
    } finally {
      clearAuth();
      toast.success('Ви вийшли з облікового запису');
      navigate('/login');
    }
  };

  if (user && accessToken) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `text-sm font-medium ${
              isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600 dark:text-gray-300'
            }`
          }
        >
          Кабінет
        </NavLink>

        <span className="hidden text-sm text-gray-500 sm:inline dark:text-gray-400">
          {user.fullName}
        </span>

        <Button variant="secondary" onClick={handleLogout}>
          Вийти
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        to="/login"
        className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300"
      >
        Увійти
      </Link>

      <Link to="/register">
        <Button>Реєстрація</Button>
      </Link>
    </div>
  );
}
