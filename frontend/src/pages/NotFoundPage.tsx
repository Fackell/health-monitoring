import { Link } from 'react-router';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="mt-4 text-xl">Сторінку не знайдено</p>
      <p className="mt-2 text-gray-500 dark:text-gray-400">Можливо, адресу введено неправильно.</p>
      <Link to="/" className="mt-6">
        <Button>На головну</Button>
      </Link>
    </div>
  );
}
