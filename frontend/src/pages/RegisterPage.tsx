import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { register as registerUser } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { registerSchema, type RegisterFormData } from '../schemas/authSchemas';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('');

    try {
      const response = await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      setAuth(response.user, response.accessToken, response.refreshToken);
      navigate('/dashboard');
    } catch (error) {
      setServerError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Не вдалося зареєструватися'
          : 'Сталася невідома помилка'
      );
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h1 className="mb-2 text-2xl font-bold">Реєстрація</h1>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Створіть обліковий запис для моніторингу активності
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <Input
              label="Повне ім’я"
              type="text"
              autoComplete="name"
              placeholder="Ваше ім’я"
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="example@email.com"
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <Input
              label="Пароль"
              type="password"
              autoComplete="new-password"
              placeholder="Мінімум 6 символів"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Input
              label="Підтвердження пароля"
              type="password"
              autoComplete="new-password"
              placeholder="Повторіть пароль"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {serverError && <p className="text-sm text-red-500">{serverError}</p>}

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Зареєструватися
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Уже маєте акаунт?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}
