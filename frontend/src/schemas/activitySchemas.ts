import { z } from 'zod';

const optionalDistance = z
  .string()
  .transform((value) => (value.trim() === '' ? null : Number(value)))
  .refine(
    (value) => value === null || (Number.isFinite(value) && value >= 0),
    'Відстань має бути невід’ємним числом'
  );

const optionalCalories = z
  .string()
  .transform((value) => (value.trim() === '' ? null : Number(value)))
  .refine(
    (value) => value === null || (Number.isInteger(value) && Number.isFinite(value) && value >= 0),
    'Калорії мають бути невід’ємним цілим числом'
  );

export const activitySchema = z.object({
  type: z.enum(['WALKING', 'RUNNING', 'CYCLING', 'SWIMMING', 'STRENGTH_TRAINING', 'OTHER']),
  durationMinutes: z.coerce
    .number()
    .int('Тривалість має бути цілим числом')
    .positive('Тривалість має бути більшою за 0'),
  distanceKm: optionalDistance,
  caloriesBurned: optionalCalories,
  notes: z.string().max(1000, 'Максимум 1000 символів'),
  startedAt: z.string().min(1, 'Вкажіть дату та час'),
});

export type ActivityFormInput = z.input<typeof activitySchema>;
export type ActivityFormData = z.output<typeof activitySchema>;
