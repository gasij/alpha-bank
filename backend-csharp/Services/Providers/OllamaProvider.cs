using System.Text;
using System.Text.Json;
using BusinessAssistant.Api.Models;

namespace BusinessAssistant.Api.Services.Providers;

public class OllamaProvider : BaseLLMProvider
{
    private readonly string _baseUrl;

    public OllamaProvider(AppConfig config) : base(config)
    {
        _baseUrl = config.OllamaBaseUrl;
    }

    public override async Task<string> ChatAsync(List<Message> messages, ChatOptions? options = null)
    {
        var model = options?.Model ?? Config.DefaultModel;
        var temperature = options?.Temperature ?? Config.Temperature;
        var maxTokens = options?.MaxTokens ?? Config.MaxTokens;

        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(60));
        
        var requestBody = new
        {
            model = model,
            messages = messages,
            stream = false,
            options = new
            {
                temperature = temperature,
                num_predict = maxTokens
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var httpClient = new HttpClient();
        httpClient.Timeout = TimeSpan.FromSeconds(60);

        try
        {
            // Используем 127.0.0.1 вместо localhost для избежания проблем с IPv6
            var url = $"{_baseUrl}/api/chat";
            if (url.Contains("localhost"))
            {
                url = url.Replace("localhost", "127.0.0.1");
            }
            
            var response = await httpClient.PostAsync(url, content, cts.Token);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            var jsonDoc = JsonDocument.Parse(responseContent);
            
            if (jsonDoc.RootElement.TryGetProperty("message", out var messageElement) &&
                messageElement.TryGetProperty("content", out var contentElement))
            {
                return contentElement.GetString() ?? string.Empty;
            }
            
            if (jsonDoc.RootElement.TryGetProperty("response", out var responseElement))
            {
                return responseElement.GetString() ?? string.Empty;
            }

            return string.Empty;
        }
        catch (TaskCanceledException)
        {
            throw new Exception("Запрос к Ollama превысил время ожидания (60 секунд). Модель слишком медленная. Попробуйте предзагрузить модель командой: ollama run llama2");
        }
    }

    public override async Task<bool> IsAvailableAsync()
    {
        try
        {
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));
            
            // Используем HttpClientHandler для лучшей совместимости
            var handler = new HttpClientHandler();
            using var httpClient = new HttpClient(handler)
            {
                Timeout = TimeSpan.FromSeconds(3)
            };
            
            // Убеждаемся, что используем правильный URL
            var url = $"{_baseUrl}/api/tags";
            if (url.Contains("localhost"))
            {
                // Принудительно используем 127.0.0.1 вместо localhost для избежания проблем с IPv6
                url = url.Replace("localhost", "127.0.0.1");
            }
            
            var response = await httpClient.GetAsync(url, cts.Token);
            return response.IsSuccessStatusCode;
        }
        catch (TaskCanceledException ex)
        {
            // Timeout - Ollama не отвечает
            Console.WriteLine($"Ollama timeout по адресу {_baseUrl}: {ex.Message}");
            return false;
        }
        catch (HttpRequestException ex)
        {
            // Connection error - Ollama не запущен или недоступен
            Console.WriteLine($"Ollama недоступен по адресу {_baseUrl}: {ex.Message}");
            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка проверки доступности Ollama: {ex.Message}");
            return false;
        }
    }
}

