import Badge from '../components/common/Badge';
import Card from '../components/common/Card';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="py-8 text-center">
        <Badge variant="success">Навчальний проєкт</Badge>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Health Monitoring</h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
          Система для відстеження фізичної активності та моніторингу показників здоров'я.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <Card title="Фізична активність">
          <p className="text-gray-600 dark:text-gray-300">
            Облік тренувань, тривалості та типів фізичної активності.
          </p>
        </Card>

        <Card title="Моніторинг здоров'я">
          <p className="text-gray-600 dark:text-gray-300">
            Можливість відстежувати важливі показники здоров'я.
          </p>
        </Card>

        <Card title="Аналіз даних">
          <p className="text-gray-600 dark:text-gray-300">
            Зручне представлення інформації про активність користувача.
          </p>
        </Card>
      </section>
    </div>
  );
}
