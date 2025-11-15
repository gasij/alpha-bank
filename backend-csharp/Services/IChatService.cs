using BusinessAssistant.Api.Models;

namespace BusinessAssistant.Api.Services;

public interface IChatService
{
    Task<ChatResponse> ProcessChatAsync(ChatRequest request);
}

