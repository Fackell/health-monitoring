import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export default function Card({ title, children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${className}`}
      {...props}
    >
      {title && <h2 className="mb-3 text-lg font-semibold">{title}</h2>}
      {children}
    </div>
  );
}
