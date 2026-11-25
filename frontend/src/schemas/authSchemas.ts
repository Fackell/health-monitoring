import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Введіть коректний email'),
  password: z.string().min(6, 'Пароль має містити щонайменше 6 символів'),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Ім’я має містити щонайменше 2 символи'),
    email: z.string().email('Введіть коректний email'),
    password: z.string().min(6, 'Пароль має містити щонайменше 6 символів'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролі не збігаються',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
