# Настройка PostgreSQL

## Установка PostgreSQL

### Windows
1. Скачайте PostgreSQL с официального сайта: https://www.postgresql.org/download/windows/
2. Установите PostgreSQL (по умолчанию порт 5432)
3. Запомните пароль для пользователя `postgres`

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### macOS
```bash
brew install postgresql
brew services start postgresql
```

## Создание базы данных

После установки PostgreSQL создайте базу данных:

```sql
-- Войдите в psql
psql -U postgres

-- Создайте базу данных
CREATE DATABASE business_assistant;

-- Выйдите
\q
```

Или через командную строку:
```bash
createdb -U postgres business_assistant
```

## Настройка Connection String

Откройте `appsettings.json` и обновите connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=business_assistant;Username=postgres;Password=ВАШ_ПАРОЛЬ"
  }
}
```

## Миграции

После настройки connection string выполните миграции:

```bash
cd backend-csharp
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Или просто запустите приложение - миграции применятся автоматически при старте.

## Проверка подключения

После запуска приложения проверьте логи:
- ✅ База данных мигрирована - все хорошо
- ⚠️ Ошибка миграции БД - проверьте connection string и что PostgreSQL запущен

## Полезные команды PostgreSQL

```bash
# Подключиться к базе
psql -U postgres -d business_assistant

# Показать все таблицы
\dt

# Показать структуру таблицы
\d users
\d "ChatHistory"

# Выйти
\q
```

