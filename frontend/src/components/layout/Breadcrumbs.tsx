import { Link, useLocation } from 'react-router';

export default function Breadcrumbs() {
  const { pathname } = useLocation();

  const items = (() => {
    if (pathname === '/dashboard') {
      return [{ label: 'Панель керування', to: '/dashboard' }];
    }

    if (pathname === '/activities') {
      return [{ label: 'Панель керування', to: '/dashboard' }, { label: 'Мої активності' }];
    }

    if (pathname === '/activities/new') {
      return [
        { label: 'Панель керування', to: '/dashboard' },
        { label: 'Мої активності', to: '/activities' },
        { label: 'Нова активність' },
      ];
    }

    if (pathname.match(/^\/activities\/[^/]+\/edit$/)) {
      return [
        { label: 'Панель керування', to: '/dashboard' },
        { label: 'Мої активності', to: '/activities' },
        { label: 'Деталі активності', to: pathname.replace('/edit', '') },
        { label: 'Редагування' },
      ];
    }

    if (pathname.match(/^\/activities\/[^/]+$/)) {
      return [
        { label: 'Панель керування', to: '/dashboard' },
        { label: 'Мої активності', to: '/activities' },
        { label: 'Деталі активності' },
      ];
    }

    return [];
  })();

  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumbs" className="mb-5 flex flex-wrap items-center gap-2 text-sm">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-2">
          {index > 0 && <span className="text-gray-400">/</span>}

          {item.to && index !== items.length - 1 ? (
            <Link to={item.to} className="text-blue-600 hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
