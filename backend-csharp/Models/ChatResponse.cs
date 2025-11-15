namespace BusinessAssistant.Api.Models;

public class ChatResponse
{
    public string Response { get; set; } = string.Empty;
    public string Category { get; set; } = "general";
    public List<string>? Suggestions { get; set; }
    public string? ChatId { get; set; } // ID текущего чата
}

