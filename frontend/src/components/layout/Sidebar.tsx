import { useState } from 'react';
import { NavLink, useLocation } from 'react-router';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const isAppPage = pathname === '/dashboard' || pathname.startsWith('/activities');

  if (!isAppPage) return null;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-4 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    }`;

  return (
    <div className="w-full shrink-0 md:w-56">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mb-3 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-left font-medium dark:border-gray-700 dark:bg-gray-900 md:hidden"
        aria-expanded={isOpen}
      >
        {isOpen ? 'Закрити меню ▲' : 'Навігація ▼'}
      </button>

      <aside
        className={`rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900 ${
          isOpen ? 'block' : 'hidden'
        } md:block`}
      >
        <p className="mb-3 px-4 text-xs font-semibold uppercase text-gray-400">Особистий кабінет</p>

        <nav className="space-y-1">
          <NavLink to="/dashboard" className={linkClass} onClick={() => setIsOpen(false)}>
            Панель керування
          </NavLink>

          <NavLink to="/activities" end className={linkClass} onClick={() => setIsOpen(false)}>
            Мої активності
          </NavLink>

          <NavLink to="/activities/new" className={linkClass} onClick={() => setIsOpen(false)}>
            Додати активність
          </NavLink>
        </nav>
      </aside>
    </div>
  );
}
