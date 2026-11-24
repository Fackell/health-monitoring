import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      className={`rounded-lg px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Завантаження...' : children}
    </button>
  );
}
