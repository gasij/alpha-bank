using BusinessAssistant.Api.Models;
using BusinessAssistant.Api.Services.Providers;

namespace BusinessAssistant.Api.Services;

public class SuggestionsService : ISuggestionsService
{
    private readonly IConfigurationService _configService;

    public SuggestionsService(IConfigurationService configService)
    {
        _configService = configService;
    }

    public async Task<List<string>> GenerateSuggestionsAsync(string category, string userMessage, ILLMProvider provider)
    {
        try
        {
            var config = _configService.GetConfig();
            var prompt = $"На основе вопроса пользователя: \"{userMessage}\"\n" +
                        $"Предложи 3 коротких (до 5 слов) вопроса на РУССКОМ ЯЗЫКЕ, которые могут быть полезны владельцу малого бизнеса в категории \"{category}\".\n" +
                        $"ВАЖНО: Все вопросы должны быть ТОЛЬКО на русском языке, без английских слов.\n" +
                        $"Верни только вопросы, каждый с новой строки, без нумерации, без дефисов, без точек в начале.";

            var messages = new List<Message>
            {
                new() { Role = "system", Content = "Ты помощник, который предлагает релевантные вопросы на русском языке. Всегда отвечай ТОЛЬКО на русском языке." },
                new() { Role = "user", Content = prompt }
            };

            var options = new Providers.ChatOptions
            {
                Model = config.DefaultModel,
                Temperature = 0.8,
                MaxTokens = 150
            };

            var suggestionsText = await provider.ChatAsync(messages, options);

            var suggestions = suggestionsText
                .Split(new[] { '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .Where(s => s.Length > 0)
                // Убираем нумерацию и маркеры
                .Select(s => s.TrimStart('-', '•', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ' '))
                .Where(s => s.Length > 0 && s.Length < 100) // Фильтруем слишком длинные
                .Take(3)
                .ToList();

            return suggestions;
        }
        catch
        {
            return new List<string>();
        }
    }
}
