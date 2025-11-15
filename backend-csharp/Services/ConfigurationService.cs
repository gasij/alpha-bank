using BusinessAssistant.Api.Models;
using Microsoft.Extensions.Options;

namespace BusinessAssistant.Api.Services;

public class ConfigurationService : IConfigurationService
{
    private readonly AppConfig _config;

    public ConfigurationService(IOptions<AppConfig> config)
    {
        _config = config.Value;
        
        // Set default/fallback models based on provider
        if (string.IsNullOrEmpty(_config.DefaultModel))
        {
            _config.DefaultModel = GetDefaultModel();
        }
        
        if (string.IsNullOrEmpty(_config.FallbackModel))
        {
            _config.FallbackModel = GetFallbackModel();
        }
    }

    public AppConfig GetConfig() => _config;

    private string GetDefaultModel()
    {
        return _config.LlmProvider switch
        {
            "ollama" => _config.OllamaModel,
            "openrouter" => _config.OpenRouterModel,
            "localai" => _config.LocalAiModel,
            _ => _config.OllamaModel
        };
    }

    private string GetFallbackModel()
    {
        return _config.LlmProvider switch
        {
            "ollama" => "qwen",
            "openrouter" => "openai/gpt-3.5-turbo",
            "localai" => _config.LocalAiModel,
            _ => "qwen"
        };
    }
}

