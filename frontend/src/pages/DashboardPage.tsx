import { useMemo, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router';

import Button from '../components/common/Button';
import DataList from '../components/common/DataList';
import Tabs from '../components/common/Tabs';
import { useActivities } from '../hooks/useActivities';
import { useAuthStore } from '../stores/authStore';

const tabs = [
  { label: 'Огляд', value: 'overview' },
  { label: 'Профіль', value: 'profile' },
];

interface StatCardData {
  id: string;
  title: string;
  value: string;
  description: string;
}

function SortableStatCard({ card }: { card: StatCardData }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
      className={`cursor-grab touch-none rounded-xl border border-gray-200 bg-white p-5 shadow-sm active:cursor-grabbing dark:border-gray-700 dark:bg-gray-900 ${
        isDragging ? 'z-10 opacity-60 shadow-lg' : ''
      }`}
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
      <p className="mt-2 text-2xl font-bold">{card.value}</p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{card.description}</p>
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState('overview');

  const [cardOrder, setCardOrder] = useState(['count', 'duration', 'calories']);

  const { data, isLoading, isError } = useActivities({
    page: 1,
    limit: 100,
  });

  const activities = useMemo(() => data?.data ?? [], [data?.data]);

  const statistics = useMemo(() => {
    return {
      count: activities.length,
      duration: activities.reduce((total, activity) => total + activity.durationMinutes, 0),
      calories: activities.reduce((total, activity) => total + (activity.caloriesBurned ?? 0), 0),
    };
  }, [activities]);

  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));

      return {
        date,
        key: date.toDateString(),
        label: date.toLocaleDateString('uk-UA', {
          weekday: 'short',
        }),
        duration: 0,
      };
    });

    activities.forEach((activity) => {
      const activityDate = new Date(activity.startedAt);
      activityDate.setHours(0, 0, 0, 0);

      const day = days.find((item) => item.key === activityDate.toDateString());

      if (day) {
        day.duration += activity.durationMinutes;
      }
    });

    return days;
  }, [activities]);

  const cards: StatCardData[] = [
    {
      id: 'count',
      title: 'Кількість активностей',
      value: String(statistics.count),
      description: 'Завантажені записи',
    },
    {
      id: 'duration',
      title: 'Загальна тривалість',
      value: `${statistics.duration} хв`,
      description: 'Сумарний час активностей',
    },
    {
      id: 'calories',
      title: 'Витрачені калорії',
      value: `${statistics.calories} ккал`,
      description: 'За завантаженими записами',
    },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCardOrder((currentOrder) => {
        const oldIndex = currentOrder.indexOf(String(active.id));
        const newIndex = currentOrder.indexOf(String(over.id));

        return arrayMove(currentOrder, oldIndex, newIndex);
      });
    }
  };

  const orderedCards = cardOrder
    .map((id) => cards.find((card) => card.id === id))
    .filter((card): card is StatCardData => Boolean(card));

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-blue-600">Особистий кабінет</p>

        <h1 className="mt-2 text-3xl font-bold">Вітаємо, {user?.fullName}!</h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Керуйте фізичною активністю та відстежуйте свої показники здоров'я.
        </p>
      </section>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold">Моя статистика</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Перетягуйте картки, щоб змінити їхній порядок
              </p>
            </div>

            {isLoading ? (
              <p className="text-sm text-gray-500">Завантаження статистики...</p>
            ) : isError ? (
              <p className="text-sm text-red-500">Не вдалося завантажити статистику</p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={cardOrder} strategy={horizontalListSortingStrategy}>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {orderedCards.map((card) => (
                      <SortableStatCard key={card.id} card={card} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-lg font-semibold">Активність за останні 7 днів</h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Тривалість активностей у хвилинах
            </p>

            {isLoading ? (
              <p className="py-12 text-center text-sm text-gray-500">Завантаження графіка...</p>
            ) : isError ? (
              <p className="py-12 text-center text-sm text-red-500">
                Не вдалося завантажити графік
              </p>
            ) : activities.length === 0 ? (
              <p className="py-12 text-center text-sm text-gray-500">
                Поки немає активностей для відображення
              </p>
            ) : (
              <div className="mt-5 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value) => [`${value} хв`, 'Тривалість']} />
                    <Bar
                      dataKey="duration"
                      name="Тривалість"
                      fill="#2563eb"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
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
          </section>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold">Обліковий запис</h2>

          <DataList
            items={[
              { label: "Ім'я", value: user?.fullName ?? '—' },
              { label: 'Email', value: user?.email ?? '—' },
              {
                label: 'Роль',
                value: user?.role === 'ADMIN' ? 'Адміністратор' : 'Користувач',
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
