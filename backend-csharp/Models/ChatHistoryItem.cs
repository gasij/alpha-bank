using System.Text.Json;

namespace BusinessAssistant.Api.Models;

public class ChatHistoryItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string Title { get; set; } = string.Empty;
    
    // JSON строка с массивом сообщений
    public string MessagesJson { get; set; } = "[]";
    
    // Вспомогательное свойство для работы с сообщениями
    public List<ChatMessage> Messages
    {
        get
        {
            if (string.IsNullOrEmpty(MessagesJson))
                return new List<ChatMessage>();
            
            try
            {
                return JsonSerializer.Deserialize<List<ChatMessage>>(MessagesJson) ?? new List<ChatMessage>();
            }
            catch
            {
                return new List<ChatMessage>();
            }
        }
        set
        {
            MessagesJson = JsonSerializer.Serialize(value ?? new List<ChatMessage>());
        }
    }
}

public class ChatMessage
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Role { get; set; } = string.Empty; // "user", "assistant", "system"
    public string Text { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public List<string>? Suggestions { get; set; }
}
