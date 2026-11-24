import Card from '../components/common/Card';

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Про проєкт</h1>

      <Card title="Призначення системи">
        <p className="leading-relaxed text-gray-600 dark:text-gray-300">
          Health Monitoring — вебзастосунок для обліку фізичної активності та моніторингу показників
          здоров'я. Проєкт створюється в межах навчальної роботи з використанням сучасних
          вебтехнологій.
        </p>
      </Card>

      <Card title="Технології">
        <ul className="list-inside list-disc space-y-2 text-gray-600 dark:text-gray-300">
          <li>React та TypeScript</li>
          <li>Vite</li>
          <li>Tailwind CSS</li>
          <li>React Router</li>
          <li>Axios</li>
          <li>Node.js та PostgreSQL</li>
        </ul>
      </Card>
    </div>
  );
}
