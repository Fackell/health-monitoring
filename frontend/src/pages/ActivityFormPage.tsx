import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '../components/common/Button';
import Input from '../components/common/Input';

import {
  activitySchema,
  type ActivityFormInput,
  type ActivityFormData,
} from '../schemas/activitySchemas';

import { useActivity, useCreateActivity, useUpdateActivity } from '../hooks/useActivities';

import type { ActivityType } from '../types/activity';

const activityTypes: { value: ActivityType; label: string }[] = [
  { value: 'WALKING', label: 'Ходьба' },
  { value: 'RUNNING', label: 'Біг' },
  { value: 'CYCLING', label: 'Велосипед' },
  { value: 'SWIMMING', label: 'Плавання' },
  { value: 'STRENGTH_TRAINING', label: 'Силове тренування' },
  { value: 'OTHER', label: 'Інше' },
];

function toLocalDateTime(value?: string) {
  const date = value ? new Date(value) : new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return localDate.toISOString().slice(0, 16);
}

export default function ActivityFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const { data: activity, isLoading } = useActivity(id ?? '');
  const createMutation = useCreateActivity();
  const updateMutation = useUpdateActivity();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormInput, unknown, ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      type: 'WALKING',
      durationMinutes: 30,
      distanceKm: '',
      caloriesBurned: '',
      notes: '',
      startedAt: toLocalDateTime(),
    },
  });

  useEffect(() => {
    if (activity) {
      reset({
        type: activity.type,
        durationMinutes: activity.durationMinutes,
        distanceKm: activity.distanceKm?.toString() ?? '',
        caloriesBurned: activity.caloriesBurned?.toString() ?? '',
        notes: activity.notes ?? '',
        startedAt: toLocalDateTime(activity.startedAt),
      });
    }
  }, [activity, reset]);

  const onSubmit = async (data: ActivityFormData) => {
    const payload = {
      type: data.type,
      durationMinutes: data.durationMinutes,
      distanceKm: data.distanceKm,
      caloriesBurned: data.caloriesBurned,
      notes: data.notes.trim() || null,
      startedAt: new Date(data.startedAt).toISOString(),
    };

    if (isEditing && id) {
      await updateMutation.mutateAsync({ id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    navigate('/activities');
  };

  if (isEditing && isLoading) {
    return <p>Завантаження активності...</p>;
  }

  if (isEditing && !activity) {
    return (
      <div>
        <p>Активність не знайдено.</p>
        <Link to="/activities" className="text-blue-600 hover:underline">
          Повернутися до списку
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link to="/activities" className="text-sm text-blue-600 hover:underline">
          ← До списку активностей
        </Link>

        <h1 className="mt-3 text-3xl font-bold">
          {isEditing ? 'Редагування активності' : 'Нова активність'}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Тип активності</label>
          <select
            {...register('type')}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
          >
            {activityTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
        </div>

        <div>
          <Input
            label="Тривалість (хвилини)"
            type="number"
            min="1"
            {...register('durationMinutes')}
          />
          {errors.durationMinutes && (
            <p className="mt-1 text-sm text-red-500">{errors.durationMinutes.message}</p>
          )}
        </div>

        <div>
          <Input
            label="Відстань (км)"
            type="number"
            min="0"
            step="0.01"
            placeholder="Необов’язково"
            {...register('distanceKm')}
          />
          {errors.distanceKm && (
            <p className="mt-1 text-sm text-red-500">{errors.distanceKm.message}</p>
          )}
        </div>

        <div>
          <Input
            label="Витрачені калорії"
            type="number"
            min="0"
            step="1"
            placeholder="Необов’язково"
            {...register('caloriesBurned')}
          />
          {errors.caloriesBurned && (
            <p className="mt-1 text-sm text-red-500">{errors.caloriesBurned.message}</p>
          )}
        </div>

        <div>
          <Input label="Дата та час" type="datetime-local" {...register('startedAt')} />
          {errors.startedAt && (
            <p className="mt-1 text-sm text-red-500">{errors.startedAt.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Примітки</label>
          <textarea
            {...register('notes')}
            rows={4}
            maxLength={1000}
            placeholder="Додаткова інформація про активність..."
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          {errors.notes && <p className="text-sm text-red-500">{errors.notes.message}</p>}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            isLoading={isSubmitting || createMutation.isPending || updateMutation.isPending}
          >
            {isEditing ? 'Зберегти зміни' : 'Створити активність'}
          </Button>

          <Link to="/activities">
            <Button type="button" variant="secondary">
              Скасувати
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
