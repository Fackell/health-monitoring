# Health Monitoring API

Серверна частина вебзастосунку для моніторингу фізичної активності та показників здоров'я.

## Технології

- Node.js та Express.js
- PostgreSQL
- Prisma ORM
- JWT для автентифікації
- Argon2id для хешування паролів
- Socket.IO для обміну даними в реальному часі
- Multer для завантаження файлів
- Swagger / OpenAPI для документації API
- Helmet та express-rate-limit для базового захисту

## Реалізовані можливості

- Реєстрація, вхід, оновлення та відкликання токенів.
- Розмежування доступу за ролями USER та ADMIN.
- CRUD-операції для користувачів та активностей.
- Пагінація, фільтрація та пошук активностей.
- Завантаження, перегляд списку та видалення файлів.
- Перевірка типу та розміру файлів.
- JWT-авторизація Socket.IO-з'єднань.
- Персональні кімнати користувачів та події активностей у реальному часі.
- Індекси PostgreSQL для оптимізації запитів до активностей.
- Swagger-документація, захисні HTTP-заголовки та обмеження частоти запитів авторизації.

## Посилання

- **Production API:** https://health-monitoring-grk9.onrender.com
- **Swagger:** https://health-monitoring-grk9.onrender.com/api-docs
- **Health check:** https://health-monitoring-grk9.onrender.com/api/health

## Локальний запуск

### Вимоги

- Node.js
- npm
- PostgreSQL

### Встановлення

```bash
git clone https://github.com/Fackell/health-monitoring.git
cd health-monitoring
npm ci
```

Створіть файл `.env` на основі `.env.example` та вкажіть власні значення змінних середовища. Не використовуйте тестові або production-секрети з чужого середовища.

Основні змінні:

| Змінна | Призначення |
|---|---|
| DATABASE_URL | Рядок підключення до PostgreSQL |
| JWT_SECRET | Секрет access-токенів |
| JWT_EXPIRES_IN | Термін дії access-токена |
| REFRESH_TOKEN_SECRET | Секрет refresh-токенів |
| REFRESH_TOKEN_EXPIRES_IN | Термін дії refresh-токена |
| UPLOAD_DIR | Каталог завантажених файлів |
| MAX_FILE_SIZE | Максимальний розмір файлу в байтах |
| FRONTEND_URL | Дозволене джерело клієнтської частини |
| PORT | Порт сервера |

Згенеруйте Prisma Client та застосуйте міграції:

```bash
npx prisma generate
npx prisma migrate deploy
```

Запуск у режимі розробки:

```bash
npm run dev
```

Звичайний запуск:

```bash
npm start
```

Після запуску API доступне за адресою `http://localhost:3000`, документація — `http://localhost:3000/api-docs`.

## Тестування

Запустити автоматичні тести:

```bash
npm test
```

Тести перевіряють валідацію реєстрації та входу, захисні HTTP-заголовки, JWT-авторизацію Socket.IO та доставку подій у персональну кімнату.

## Основні маршрути

| Маршрут | Призначення |
|---|---|
| `/api/health` | Перевірка стану сервера |
| `/api/auth` | Реєстрація, вхід, оновлення та завершення сесії |
| `/api/users` | Операції з користувачами |
| `/api/activities` | Операції з фізичними активностями |
| `/api/files` | Завантаження та керування файлами |
| `/api-docs` | Swagger UI |

Точні методи, параметри та структури запитів наведені у Swagger.

## WebSocket

Для обміну даними використовується Socket.IO. Клієнт передає access JWT під час підключення через `auth.token`. Після успішної перевірки сервер приєднує з'єднання до персональної кімнати `user:<userId>`.

Події активностей:

- `activity:created`
- `activity:updated`
- `activity:deleted`

Докладніше: [docs/websocket.md](docs/websocket.md).

## Розгортання

Застосунок розгорнуто на Render, база даних PostgreSQL розміщена на Neon.

Build command:

```bash
npm ci && npx prisma generate && npx prisma migrate deploy
```

Start command:

```bash
npm start
```

На Render потрібно налаштувати змінні середовища, зокрема `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `REFRESH_TOKEN_SECRET`, `REFRESH_TOKEN_EXPIRES_IN`, `UPLOAD_DIR`, `MAX_FILE_SIZE` та `FRONTEND_URL`. Значення секретів не зберігаються в репозиторії.

Платформа Render самостійно передає порт через `PORT`.

### Обмеження розгортання

Безкоштовний вебсервіс Render може переходити в режим сну після періоду бездіяльності. Перший запит після цього може виконуватися довше. WebSocket-клієнтам потрібно коректно обробляти розриви з'єднання.

Файлова система без постійного диска є тимчасовою. Тому завантажені на локальний диск файли не слід вважати постійно збереженими після перезапуску чи повторного розгортання. Для production потрібне зовнішнє файлове сховище.

Умови безкоштовних тарифів Render та Neon можуть змінюватися. Перед тривалим використанням необхідно перевіряти актуальні обмеження провайдерів.

## Додаткова документація

- [WebSocket API](docs/websocket.md)
- [Звіт лабораторної роботи №3](docs/lab-03-report.md)
