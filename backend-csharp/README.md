# Business Assistant API - ASP.NET Core

Backend API для Бизнес-Помощника на ASP.NET Core 8.0.

## Требования

- .NET 8.0 SDK или выше
- Ollama (для локальных моделей) или другой LLM провайдер

### Установка Ollama на Windows

См. подробную инструкцию в файле [OLLAMA_INSTALL_WINDOWS.md](./OLLAMA_INSTALL_WINDOWS.md)

Кратко:
1. Скачайте с https://ollama.com/download/windows
2. Установите `OllamaSetup.exe`
3. Загрузите модель: `ollama pull llama2`
4. Проверьте: `ollama list`

## Настройка

1. Скопируйте `appsettings.json` и настройте параметры:
   - `LlmProvider`: выберите провайдер (`ollama`, `openrouter`, `localai`, `openai`)
   - Настройте URL и модели для выбранного провайдера

2. Запустите проект:
   ```bash
   dotnet run
   ```

   Или для разработки:
   ```bash
   dotnet watch run
   ```

## API Endpoints

- `GET /` - Информация об API
- `GET /health` - Проверка здоровья сервиса
- `GET /categories` - Список категорий
- `POST /chat` - Отправка сообщения в чат
- `GET /provider/info` - Информация о провайдере
- `GET /provider/status` - Статус провайдера

## Структура проекта

- `Controllers/` - API контроллеры
- `Models/` - Модели данных (DTOs)
- `Services/` - Бизнес-логика и сервисы
- `Services/Providers/` - Провайдеры LLM (Ollama, LocalAI, и т.д.)
- `Constants/` - Константы (системные промпты)

## Конфигурация

Настройки находятся в `appsettings.json`:

```json
{
  "AppConfig": {
    "LlmProvider": "ollama",
    "OllamaBaseUrl": "http://localhost:11434",
    "OllamaModel": "llama2",
    "MaxTokens": 50,
    "Temperature": 0.7
  }
}
```

## Провайдеры LLM

### Ollama (по умолчанию)
Локальный провайдер для работы с моделями через Ollama.

### Другие провайдеры
OpenRouter, LocalAI, OpenAI - требуют дополнительной реализации.

