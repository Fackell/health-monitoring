import { Link, NavLink } from 'react-router';
import useTheme from '../../hooks/useTheme';
import AuthNavigation from '../auth/AuthNavigation';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Health Monitoring
        </Link>

        <nav className="flex flex-wrap items-center gap-4 sm:gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'font-semibold text-blue-600' : 'text-gray-600 dark:text-gray-300'
            }
          >
            Головна
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'font-semibold text-blue-600' : 'text-gray-600 dark:text-gray-300'
            }
          >
            Про проєкт
          </NavLink>

          <AuthNavigation />

          <button
            onClick={toggleTheme}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600"
            aria-label="Перемкнути тему"
          >
            {theme === 'light' ? 'Темна тема' : 'Світла тема'}
          </button>
        </nav>
      </div>
    </header>
  );
}
