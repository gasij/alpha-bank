# Установка Ollama на Windows

## Шаг 1: Скачивание

1. Перейдите на официальный сайт Ollama: https://ollama.com/download/windows
2. Нажмите кнопку **"Download for Windows"**
3. Файл `OllamaSetup.exe` будет загружен в папку загрузок

## Шаг 2: Установка

1. Найдите файл `OllamaSetup.exe` в папке загрузок
2. Дважды щелкните по файлу для запуска установки
3. Следуйте инструкциям установщика
4. После установки Ollama автоматически запустится в фоновом режиме

## Шаг 3: Проверка установки

Ollama устанавливается в `%LOCALAPPDATA%\Programs\Ollama`, но может не быть добавлен в PATH.

### Вариант 1: Использовать полный путь
```powershell
& "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe" --version
```

### Вариант 2: Добавить в PATH для текущей сессии
```powershell
$env:Path += ";$env:LOCALAPPDATA\Programs\Ollama"
ollama --version
```

### Вариант 3: Добавить в PATH постоянно
Запустите скрипт `add-ollama-to-path.ps1` от имени администратора:
```powershell
.\add-ollama-to-path.ps1
```

Или вручную:
1. Откройте "Переменные среды" (Environment Variables)
2. В "Переменные пользователя" найдите `Path`
3. Добавьте: `%LOCALAPPDATA%\Programs\Ollama`
4. Перезапустите терминал

## Шаг 4: Загрузка модели

Для работы с бэкендом нужно загрузить модель. Рекомендуется модель `llama2`:

```powershell
ollama pull llama2
```

Или можно использовать другую модель:
```powershell
ollama pull mistral
ollama pull codellama
```

## Шаг 5: Проверка работы

Проверьте, что Ollama работает:

```powershell
ollama list
```

Эта команда покажет список установленных моделей.

Также можно проверить через браузер или curl:
```powershell
curl http://localhost:11434/api/tags
```

## Системные требования

- **Windows 10** версии 22H2 или новее (Home или Pro)
- **Windows 11** (любая версия)

### Для GPU ускорения (опционально):

- **NVIDIA GPU**: драйвер версии 452.39 или новее
- **AMD Radeon GPU**: последняя версия драйвера с поддержкой ROCm

## Запуск Ollama

После установки Ollama автоматически запускается при старте Windows. Если нужно запустить вручную:

1. Найдите "Ollama" в меню Пуск
2. Или используйте команду в PowerShell:
   ```powershell
   ollama serve
   ```

## Настройка для проекта

Убедитесь, что в `appsettings.json` указан правильный адрес:

```json
{
  "AppConfig": {
    "OllamaBaseUrl": "http://localhost:11434",
    "OllamaModel": "llama2"
  }
}
```

## Полезные команды

Если Ollama не в PATH, используйте полный путь или добавьте в PATH:
```powershell
# Добавить в PATH для текущей сессии
$env:Path += ";$env:LOCALAPPDATA\Programs\Ollama"

# Показать список моделей
ollama list

# Запустить интерактивный чат с моделью
ollama run llama2

# Удалить модель
ollama rm llama2

# Показать информацию о модели
ollama show llama2
```

## Решение проблем

### Ollama не запускается
- Проверьте, что порт 11434 не занят другим приложением
- Перезапустите Ollama через меню Пуск

### Модель не загружается
- Проверьте подключение к интернету (первая загрузка требует интернет)
- Убедитесь, что на диске достаточно места (модели занимают несколько GB)

### Ошибка подключения в бэкенде
- Убедитесь, что Ollama запущен: `ollama list`
- Проверьте адрес в `appsettings.json`: `http://localhost:11434`
- Проверьте, что модель загружена: `ollama list`

## Дополнительная информация

- Официальная документация: https://docs.ollama.com/windows
- Список доступных моделей: https://ollama.com/library

