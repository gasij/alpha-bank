using BusinessAssistant.Api.Models;

namespace BusinessAssistant.Api.Services.Providers;

public interface ILLMProvider
{
    Task<string> ChatAsync(List<Message> messages, ChatOptions? options = null);
    Task<bool> IsAvailableAsync();
}

public class ChatOptions
{
    public string? Model { get; set; }
    public double Temperature { get; set; } = 0.7;
    public int MaxTokens { get; set; } = 50;
}

