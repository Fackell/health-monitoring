export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Health Monitoring — система моніторингу фізичної активності та здоров'я.</p>
        <a
          href="https://github.com/Fackell/health-monitoring"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-blue-600 hover:underline"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
