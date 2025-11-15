using BusinessAssistant.Api.Models;
using BusinessAssistant.Api.Services.Providers;

namespace BusinessAssistant.Api.Services;

public interface ISuggestionsService
{
    Task<List<string>> GenerateSuggestionsAsync(string category, string userMessage, ILLMProvider provider);
}

