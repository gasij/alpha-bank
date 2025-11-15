using BusinessAssistant.Api.Models;
using BusinessAssistant.Api.Services;

namespace BusinessAssistant.Api.Services.Providers;

public class LLMProviderFactory : ILLMProviderFactory
{
    private readonly AppConfig _config;
    private ILLMProvider? _providerInstance;

    public LLMProviderFactory(IConfigurationService configService)
    {
        _config = configService.GetConfig();
    }

    public ILLMProvider GetProvider()
    {
        if (_providerInstance != null)
        {
            return _providerInstance;
        }

        _providerInstance = _config.LlmProvider switch
        {
            "ollama" => new OllamaProvider(_config),
            "openrouter" => throw new NotImplementedException("OpenRouter provider not yet implemented"),
            "localai" => throw new NotImplementedException("LocalAI provider not yet implemented"),
            "openai" => throw new NotImplementedException("OpenAI provider not yet implemented"),
            _ => new OllamaProvider(_config)
        };

        return _providerInstance;
    }
}

