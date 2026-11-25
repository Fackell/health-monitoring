import { useMemo, useState } from 'react';
import { Link } from 'react-router';

import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import Skeleton from '../components/common/Skeleton';
import { useActivities, useDeleteActivity } from '../hooks/useActivities';
import useDebounce from '../hooks/useDebounce';

import type { ActivityType } from '../types/activity';

const activityLabels: Record<ActivityType, string> = {
  WALKING: 'Ходьба',
  RUNNING: 'Біг',
  CYCLING: 'Велосипед',
  SWIMMING: 'Плавання',
  STRENGTH_TRAINING: 'Силове тренування',
  OTHER: 'Інше',
};

type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'duration-desc'
  | 'duration-asc'
  | 'distance-desc'
  | 'calories-desc'
  | 'type-asc';

const tableHeaders = ['Тип', 'Тривалість', 'Відстань', 'Калорії', 'Дата', 'Дії'];

export default function ActivitiesPage() {
  const [searchInput, setSearchInput] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const debouncedSearch = useDebounce(searchInput.trim(), 500);

  const { data, isLoading, isError, error } = useActivities({
    page,
    limit: 8,
    search: debouncedSearch,
    type,
  });

  const deleteMutation = useDeleteActivity();

  const sortedActivities = useMemo(() => {
    const activities = [...(data?.data ?? [])];

    activities.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
        case 'date-asc':
          return new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
        case 'duration-desc':
          return b.durationMinutes - a.durationMinutes;
        case 'duration-asc':
          return a.durationMinutes - b.durationMinutes;
        case 'distance-desc':
          return (b.distanceKm ?? 0) - (a.distanceKm ?? 0);
        case 'calories-desc':
          return (b.caloriesBurned ?? 0) - (a.caloriesBurned ?? 0);
        case 'type-asc':
          return activityLabels[a.type].localeCompare(activityLabels[b.type], 'uk');
        default:
          return 0;
      }
    });

    return activities;
  }, [data?.data, sortBy]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Ви дійсно хочете видалити цей запис?')) {
      return;
    }

    await deleteMutation.mutateAsync(id);

    if (data && data.data.length === 1 && page > 1) {
      setPage((current) => current - 1);
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    setType('');
    setPage(1);
    setSortBy('date-desc');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Мої активності</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Історія фізичних навантажень та тренувань
          </p>
        </div>

        <Link to="/activities/new">
          <Button>+ Додати активність</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row dark:border-gray-700 dark:bg-gray-900">
        <input
          type="search"
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
            setPage(1);
          }}
          placeholder="Пошук за примітками..."
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
        />

        <select
          value={type}
          onChange={(event) => {
            setType(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
        >
          <option value="">Усі типи</option>
          {Object.entries(activityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as SortOption)}
          aria-label="Сортування активностей"
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
        >
          <option value="date-desc">Спочатку новіші</option>
          <option value="date-asc">Спочатку старіші</option>
          <option value="duration-desc">За тривалістю</option>
          <option value="duration-asc">За тривалістю (зростання)</option>
          <option value="distance-desc">За відстанню</option>
          <option value="calories-desc">За калоріями</option>
          <option value="type-asc">За типом</option>
        </select>

        <Button type="button" variant="secondary" onClick={clearFilters}>
          Скинути
        </Button>
      </div>

      {isLoading && (
        <DataTable headers={tableHeaders}>
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index}>
              {Array.from({ length: 6 }).map((__, cellIndex) => (
                <td key={cellIndex} className="px-4 py-4">
                  <Skeleton className="h-4 w-full max-w-24" />
                </td>
              ))}
            </tr>
          ))}
        </DataTable>
      )}

      {isError && (
        <p className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-950/30">
          Не вдалося завантажити активності: {error.message}
        </p>
      )}

      {data && (
        <>
          {data.data.length === 0 ? (
            <div className="rounded-xl border border-gray-200 p-10 text-center dark:border-gray-700">
              <h2 className="text-lg font-semibold">Записів поки немає</h2>
              <p className="mt-2 text-sm text-gray-500">
                Спробуйте змінити параметри пошуку або додайте першу активність.
              </p>
              <Link to="/activities/new" className="mt-4 inline-block">
                <Button>Додати активність</Button>
              </Link>
            </div>
          ) : (
            <DataTable headers={tableHeaders}>
              {sortedActivities.map((activity) => (
                <tr key={activity.id} className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-3 font-medium">{activityLabels[activity.type]}</td>
                  <td className="px-4 py-3">{activity.durationMinutes} хв</td>
                  <td className="px-4 py-3">
                    {activity.distanceKm ?? '—'}
                    {activity.distanceKm !== null ? ' км' : ''}
                  </td>
                  <td className="px-4 py-3">{activity.caloriesBurned ?? '—'}</td>
                  <td className="px-4 py-3">
                    {new Date(activity.startedAt).toLocaleDateString('uk-UA')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/activities/${activity.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Деталі
                      </Link>

                      <Link
                        to={`/activities/${activity.id}/edit`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Змінити
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(activity.id)}
                        disabled={deleteMutation.isPending}
                        className="font-medium text-red-600 hover:underline disabled:opacity-50"
                      >
                        Видалити
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </DataTable>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">Усього записів: {data.pagination.total}</p>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((current) => current - 1)}
              >
                Попередня
              </Button>

              <span className="text-sm">
                Сторінка {data.pagination.page} з {Math.max(1, data.pagination.totalPages)}
              </span>

              <Button
                variant="secondary"
                disabled={page >= data.pagination.totalPages || isLoading}
                onClick={() => setPage((current) => current + 1)}
              >
                Наступна
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
