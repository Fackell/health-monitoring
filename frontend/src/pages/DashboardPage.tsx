import { Link } from 'react-router';

import Button from '../components/common/Button';
import DataGrid from '../components/common/DataGrid';
import DataList from '../components/common/DataList';
import { useAuthStore } from '../stores/authStore';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-blue-600">Особистий кабінет</p>

        <h1 className="mt-2 text-3xl font-bold">Вітаємо, {user?.fullName}!</h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Керуйте фізичною активністю та відстежуйте свої показники здоров’я.
        </p>
      </section>

      <DataGrid>
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-lg font-semibold">Мої активності</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Переглядайте історію тренувань, додавайте нові записи та редагуйте наявні.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/activities">
              <Button>Переглянути</Button>
            </Link>

            <Link to="/activities/new">
              <Button variant="secondary">Додати запис</Button>
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-lg font-semibold">Обліковий запис</h2>

          <DataList
            items={[
              { label: 'Ім’я', value: user?.fullName ?? '—' },
              { label: 'Email', value: user?.email ?? '—' },
              {
                label: 'Роль',
                value: user?.role === 'ADMIN' ? 'Адміністратор' : 'Користувач',
              },
            ]}
          />
        </div>
      </DataGrid>
    </div>
  );
}
