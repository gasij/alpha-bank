# Скрипт для добавления Ollama в PATH Windows
# Запустите от имени администратора для постоянного добавления

$ollamaPath = "$env:LOCALAPPDATA\Programs\Ollama"

if (Test-Path $ollamaPath) {
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    
    if ($currentPath -notlike "*$ollamaPath*") {
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$ollamaPath", "User")
        Write-Host "✅ Ollama добавлен в PATH пользователя" -ForegroundColor Green
        Write-Host "Перезапустите терминал, чтобы изменения вступили в силу." -ForegroundColor Yellow
    } else {
        Write-Host "✅ Ollama уже в PATH" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Ollama не найден по пути: $ollamaPath" -ForegroundColor Red
    Write-Host "Убедитесь, что Ollama установлен." -ForegroundColor Yellow
}

# Для текущей сессии
$env:Path += ";$ollamaPath"
Write-Host "✅ Ollama добавлен в PATH текущей сессии" -ForegroundColor Green

