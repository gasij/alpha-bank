using BusinessAssistant.Api.Constants;
using BusinessAssistant.Api.Models;
using BusinessAssistant.Api.Services.Providers;

namespace BusinessAssistant.Api.Services;

public class ChatService : IChatService
{
    private readonly ILLMProviderFactory _providerFactory;
    private readonly ISuggestionsService _suggestionsService;
    private readonly IConfigurationService _configService;

    public ChatService(
        ILLMProviderFactory providerFactory,
        ISuggestionsService suggestionsService,
        IConfigurationService configService)
    {
        _providerFactory = providerFactory;
        _suggestionsService = suggestionsService;
        _configService = configService;
    }

    public async Task<ChatResponse> ProcessChatAsync(ChatRequest request)
    {
        var config = _configService.GetConfig();
        var provider = _providerFactory.GetProvider();

        // Check provider availability (with timeout to avoid long waits)
        try
        {
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));
            var isAvailable = await Task.Run(async () => await provider.IsAvailableAsync(), cts.Token);
            if (!isAvailable)
            {
                throw new Exception($"Провайдер {config.LlmProvider} недоступен. Проверьте настройки и убедитесь, что сервис запущен по адресу {config.OllamaBaseUrl}.");
            }
        }
        catch (TaskCanceledException)
        {
            throw new Exception($"Провайдер {config.LlmProvider} не отвечает. Проверьте, что Ollama запущен по адресу {config.OllamaBaseUrl}.");
        }

        var selectedCategory = SystemPrompts.Prompts.ContainsKey(request.Category) 
            ? request.Category 
            : "general";

        var systemPrompt = SystemPrompts.Prompts[selectedCategory] + "\n\nПомни: отвечай ТОЛЬКО на русском языке.";

        // Build user message with context if provided
        var userMessage = request.Message;
        if (request.Context != null && request.Context.Count > 0)
        {
            var contextStr = System.Text.Json.JsonSerializer.Serialize(request.Context, new System.Text.Json.JsonSerializerOptions 
            { 
                WriteIndented = true 
            });
            userMessage = $"Контекст: {contextStr}\n\nВопрос: {request.Message}";
        }

        var messages = new List<Message>
        {
            new() { Role = "system", Content = systemPrompt },
            new() { Role = "user", Content = userMessage }
        };

        // Try main model, fallback to fallback model if needed
        string aiResponse;
        try
        {
            var options = new Providers.ChatOptions
            {
                Model = config.DefaultModel,
                Temperature = config.Temperature,
                MaxTokens = config.MaxTokens
            };

            aiResponse = await provider.ChatAsync(messages, options);
        }
        catch (Exception ex)
        {
            // Try fallback model
            try
            {
                var fallbackOptions = new Providers.ChatOptions
                {
                    Model = config.FallbackModel,
                    Temperature = config.Temperature,
                    MaxTokens = config.MaxTokens
                };

                aiResponse = await provider.ChatAsync(messages, fallbackOptions);
            }
            catch (Exception fallbackEx)
            {
                throw new Exception($"Сервис временно недоступен: {fallbackEx.Message}");
            }
        }

        // Generate suggestions
        var suggestions = await _suggestionsService.GenerateSuggestionsAsync(
            selectedCategory, 
            request.Message, 
            provider);

        return new ChatResponse
        {
            Response = aiResponse,
            Category = selectedCategory,
            Suggestions = suggestions
        };
    }
}

