using BusinessAssistant.Api.Models;

namespace BusinessAssistant.Api.Services.Providers;

public abstract class BaseLLMProvider : ILLMProvider
{
    protected readonly AppConfig Config;

    protected BaseLLMProvider(AppConfig config)
    {
        Config = config;
    }

    public abstract Task<string> ChatAsync(List<Message> messages, ChatOptions? options = null);
    public abstract Task<bool> IsAvailableAsync();
}

