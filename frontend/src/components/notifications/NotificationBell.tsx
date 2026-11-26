import { useEffect, useState } from 'react';
import { Bell, CheckCheck, Trash2, X } from 'lucide-react';

import { useNotificationStore } from '../../stores/notificationStore';

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const clearAll = useNotificationStore((state) => state.clearAll);

  const unreadCount = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="relative rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        aria-label={`Сповіщення: ${unreadCount} непрочитаних`}
        aria-expanded={isOpen}
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900 sm:w-96">
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
            <div>
              <h2 className="font-semibold">Сповіщення</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Непрочитаних: {unreadCount}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Закрити сповіщення"
            >
              <X size={18} />
            </button>
          </div>

          {notifications.length > 0 && (
            <div className="flex justify-end gap-3 border-b border-gray-200 px-4 py-2 text-xs dark:border-gray-700">
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <CheckCheck size={14} />
                Прочитати всі
              </button>

              <button
                type="button"
                onClick={clearAll}
                className="flex items-center gap-1 text-red-600 hover:underline"
              >
                <Trash2 size={14} />
                Очистити
              </button>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Поки що сповіщень немає
              </p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => markAsRead(notification.id)}
                  className={`w-full border-b border-gray-100 p-4 text-left transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 ${
                    notification.read ? 'opacity-60' : 'bg-blue-50/50 dark:bg-blue-950/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                        notification.read ? 'bg-gray-300' : 'bg-blue-500'
                      }`}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{notification.title}</p>
                      <p className="mt-1 break-words text-sm text-gray-600 dark:text-gray-300">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
