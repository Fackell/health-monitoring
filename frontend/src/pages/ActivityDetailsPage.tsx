import { Link, useParams } from 'react-router';

import Button from '../components/common/Button';
import { useActivity } from '../hooks/useActivities';
import type { ActivityType } from '../types/activity';

const activityLabels: Record<ActivityType, string> = {
  WALKING: 'Ходьба',
  RUNNING: 'Біг',
  CYCLING: 'Велосипед',
  SWIMMING: 'Плавання',
  STRENGTH_TRAINING: 'Силове тренування',
  OTHER: 'Інше',
};

export default function ActivityDetailsPage() {
  const { id } = useParams();
  const { data: activity, isLoading, isError } = useActivity(id ?? '');

  if (isLoading) {
    return <p>Завантаження...</p>;
  }

  if (isError || !activity) {
    return (
      <div className="space-y-4">
        <p>Не вдалося знайти активність.</p>
        <Link to="/activities">
          <Button variant="secondary">Назад до списку</Button>
        </Link>
      </div>
    );
  }

  const details = [
    ['Тип активності', activityLabels[activity.type]],
    ['Тривалість', `${activity.durationMinutes} хв`],
    ['Відстань', activity.distanceKm !== null ? `${activity.distanceKm} км` : 'Не вказано'],
    [
      'Витрачені калорії',
      activity.caloriesBurned !== null ? `${activity.caloriesBurned} ккал` : 'Не вказано',
    ],
    ['Дата та час', new Date(activity.startedAt).toLocaleString('uk-UA')],
    ['Дата створення запису', new Date(activity.createdAt).toLocaleString('uk-UA')],
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link to="/activities" className="text-sm text-blue-600 hover:underline">
          ← До списку активностей
        </Link>

        <h1 className="mt-3 text-3xl font-bold">Деталі активності</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <dl className="divide-y divide-gray-200 dark:divide-gray-700">
          {details.map(([label, value]) => (
            <div key={label} className="flex flex-wrap justify-between gap-2 py-4">
              <dt className="font-medium text-gray-600 dark:text-gray-400">{label}</dt>
              <dd className="text-right">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5">
          <h2 className="font-semibold">Примітки</h2>
          <p className="mt-2 whitespace-pre-wrap text-gray-600 dark:text-gray-400">
            {activity.notes || 'Примітки відсутні'}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={`/activities/${activity.id}/edit`}>
            <Button>Редагувати</Button>
          </Link>

          <Link to="/activities">
            <Button variant="secondary">Назад</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
