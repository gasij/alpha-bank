using BusinessAssistant.Api.Models;

namespace BusinessAssistant.Api.Services;

public interface IHistoryService
{
    Task<string> GetOrCreateChatSessionAsync(string userId, string category);
    Task AddMessageToChatAsync(string userId, string chatId, ChatMessage message);
    Task<List<ChatHistoryItem>> GetUserHistoryAsync(string userId);
    Task<ChatHistoryItem?> GetChatByIdAsync(string userId, string chatId);
    Task DeleteHistoryAsync(string userId, string historyId);
    Task<string> CreateNewChatAsync(string userId, string category);
}
