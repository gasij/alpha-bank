using BusinessAssistant.Api.Models;
using BusinessAssistant.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace BusinessAssistant.Api.Services;

public class HistoryService : IHistoryService
{
    private readonly ApplicationDbContext _context;

    public HistoryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> GetOrCreateChatSessionAsync(string userId, string category)
    {
        // Получаем последний активный чат пользователя в этой категории
        var lastChat = await _context.ChatHistory
            .Where(h => h.UserId == userId && h.Category == category)
            .OrderByDescending(h => h.UpdatedAt)
            .FirstOrDefaultAsync();

        // Если последний чат был обновлен менее 30 минут назад, используем его
        if (lastChat != null && (DateTime.UtcNow - lastChat.UpdatedAt).TotalMinutes < 30)
        {
            return lastChat.Id;
        }

        // Иначе создаем новый чат
        return await CreateNewChatAsync(userId, category);
    }

    public async Task<string> CreateNewChatAsync(string userId, string category)
    {
        var chat = new ChatHistoryItem
        {
            Id = Guid.NewGuid().ToString(),
            UserId = userId,
            Category = category,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Title = "Новый чат",
            Messages = new List<ChatMessage>()
        };

        _context.ChatHistory.Add(chat);
        await _context.SaveChangesAsync();

        return chat.Id;
    }

    public async Task AddMessageToChatAsync(string userId, string chatId, ChatMessage message)
    {
        var chat = await _context.ChatHistory
            .FirstOrDefaultAsync(h => h.Id == chatId && h.UserId == userId);

        if (chat == null)
        {
            throw new Exception("Чат не найден");
        }

        var messages = chat.Messages;
        messages.Add(message);
        chat.Messages = messages;
        chat.UpdatedAt = DateTime.UtcNow;

        // Обновляем заголовок, если это первое сообщение пользователя
        if (messages.Count == 1 && message.Role == "user")
        {
            chat.Title = message.Text.Length > 50 
                ? message.Text.Substring(0, 50) + "..." 
                : message.Text;
        }

        await _context.SaveChangesAsync();
    }

    public async Task<List<ChatHistoryItem>> GetUserHistoryAsync(string userId)
    {
        return await _context.ChatHistory
            .Where(h => h.UserId == userId)
            .OrderByDescending(h => h.UpdatedAt)
            .Take(50)
            .ToListAsync();
    }

    public async Task<ChatHistoryItem?> GetChatByIdAsync(string userId, string chatId)
    {
        return await _context.ChatHistory
            .FirstOrDefaultAsync(h => h.Id == chatId && h.UserId == userId);
    }

    public async Task DeleteHistoryAsync(string userId, string historyId)
    {
        var historyItem = await _context.ChatHistory
            .FirstOrDefaultAsync(h => h.Id == historyId && h.UserId == userId);

        if (historyItem != null)
        {
            _context.ChatHistory.Remove(historyItem);
            await _context.SaveChangesAsync();
        }
    }
}
