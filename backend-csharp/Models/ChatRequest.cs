using System.ComponentModel.DataAnnotations;

namespace BusinessAssistant.Api.Models;

public class ChatRequest
{
    [Required]
    [StringLength(2000, MinimumLength = 1)]
    public string Message { get; set; } = string.Empty;

    public string Category { get; set; } = "general";

    public Dictionary<string, object>? Context { get; set; }
    
    public string? ChatId { get; set; } // ID текущего чата для продолжения разговора
}

