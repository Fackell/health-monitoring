interface LoadingProps {
  text?: string;
}

export default function Loading({ text = 'Завантаження...' }: LoadingProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-8" role="status">
      <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      <span className="text-gray-600 dark:text-gray-300">{text}</span>
    </div>
  );
}
