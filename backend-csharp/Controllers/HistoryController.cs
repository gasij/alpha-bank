using BusinessAssistant.Api.Models;
using BusinessAssistant.Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace BusinessAssistant.Api.Controllers;

[ApiController]
[Route("history")]
public class HistoryController : ControllerBase
{
    private readonly IHistoryService _historyService;
    private readonly IUserService _userService;
    private readonly ILogger<HistoryController> _logger;

    public HistoryController(
        IHistoryService historyService,
        IUserService userService,
        ILogger<HistoryController> logger)
    {
        _historyService = historyService;
        _userService = userService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<List<ChatHistoryResponse>>> GetHistory()
    {
        var userId = GetUserIdFromToken();
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { detail = "Требуется авторизация" });
        }

        var historyItems = await _historyService.GetUserHistoryAsync(userId);
        var history = historyItems.Select(item => new ChatHistoryResponse
        {
            Id = item.Id,
            Category = item.Category,
            CreatedAt = item.CreatedAt,
            Title = item.Title,
            Messages = item.Messages.Select(m => new MessageResponse
            {
                Id = m.Id,
                Role = m.Role,
                Text = m.Text,
                Timestamp = m.Timestamp,
                Suggestions = m.Suggestions
            }).ToList()
        }).ToList();

        return Ok(history);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ChatHistoryResponse>> GetChatById(string id)
    {
        var userId = GetUserIdFromToken();
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { detail = "Требуется авторизация" });
        }

        var chat = await _historyService.GetChatByIdAsync(userId, id);
        if (chat == null)
        {
            return NotFound(new { detail = "Чат не найден" });
        }

        var response = new ChatHistoryResponse
        {
            Id = chat.Id,
            Category = chat.Category,
            CreatedAt = chat.CreatedAt,
            Title = chat.Title,
            Messages = chat.Messages.Select(m => new MessageResponse
            {
                Id = m.Id,
                Role = m.Role,
                Text = m.Text,
                Timestamp = m.Timestamp,
                Suggestions = m.Suggestions
            }).ToList()
        };

        return Ok(response);
    }

    [HttpPost("new")]
    public async Task<ActionResult<ChatHistoryResponse>> CreateNewChat([FromBody] CreateChatRequest request)
    {
        var userId = GetUserIdFromToken();
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { detail = "Требуется авторизация" });
        }

        var chatId = await _historyService.CreateNewChatAsync(userId, request.Category);
        var chat = await _historyService.GetChatByIdAsync(userId, chatId);
        
        if (chat == null)
        {
            return NotFound(new { detail = "Чат не найден" });
        }

        var response = new ChatHistoryResponse
        {
            Id = chat.Id,
            Category = chat.Category,
            CreatedAt = chat.CreatedAt,
            Title = chat.Title,
            Messages = new List<MessageResponse>()
        };

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteHistory(string id)
    {
        var userId = GetUserIdFromToken();
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { detail = "Требуется авторизация" });
        }

        await _historyService.DeleteHistoryAsync(userId, id);
        return NoContent();
    }

    private string? GetUserIdFromToken()
    {
        if (!Request.Headers.TryGetValue("Authorization", out var authHeader))
        {
            return null;
        }

        var token = authHeader.ToString().Replace("Bearer ", "", StringComparison.OrdinalIgnoreCase);
        if (string.IsNullOrEmpty(token))
        {
            return null;
        }

        try
        {
            var bytes = Convert.FromBase64String(token);
            var userId = Encoding.UTF8.GetString(bytes);
            return userId;
        }
        catch
        {
            return null;
        }
    }
}

public class ChatHistoryResponse
{
    public string Id { get; set; } = string.Empty;
    public List<MessageResponse> Messages { get; set; } = new();
    public string Category { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string Title { get; set; } = string.Empty;
}

public class MessageResponse
{
    public string Id { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public List<string>? Suggestions { get; set; }
}

public class CreateChatRequest
{
    public string Category { get; set; } = "general";
}

