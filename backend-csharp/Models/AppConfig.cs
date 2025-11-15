namespace BusinessAssistant.Api.Models;

public class AppConfig
{
    public int Port { get; set; } = 8000;
    public string LlmProvider { get; set; } = "ollama";
    public string? OpenAiApiKey { get; set; }
    public string? OpenAiBaseUrl { get; set; }
    public string OllamaBaseUrl { get; set; } = "http://localhost:11434";
    public string OllamaModel { get; set; } = "llama2";
    public string? OpenRouterApiKey { get; set; }
    public string OpenRouterModel { get; set; } = "openai/gpt-4-turbo";
    public string LocalAiBaseUrl { get; set; } = "http://localhost:8080";
    public string LocalAiModel { get; set; } = "gpt-4";
    public string DefaultModel { get; set; } = "";
    public string FallbackModel { get; set; } = "";
    public int MaxTokens { get; set; } = 1000;
    public double Temperature { get; set; } = 0.7;
    public string ApiTitle { get; set; } = "Бизнес-Помощник API";
    public string ApiVersion { get; set; } = "1.0.0";
}

