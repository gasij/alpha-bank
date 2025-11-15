using BusinessAssistant.Api.Models;
using BusinessAssistant.Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace BusinessAssistant.Api.Controllers;

[ApiController]
[Route("chat")]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;
    private readonly IUserService _userService;
    private readonly IHistoryService _historyService;
    private readonly ILogger<ChatController> _logger;

    public ChatController(
        IChatService chatService, 
        IUserService userService,
        IHistoryService historyService,
        ILogger<ChatController> logger)
    {
        _chatService = chatService;
        _userService = userService;
        _historyService = historyService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<ChatResponse>> Post([FromBody] ChatRequest request)
    {
        // Проверка авторизации
        var userId = GetUserIdFromToken();
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { detail = "Требуется авторизация для отправки сообщений" });
        }

        var user = await _userService.GetUserByIdAsync(userId);
        if (user == null)
        {
            return Unauthorized(new { detail = "Пользователь не найден" });
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var startTime = DateTime.UtcNow;

        try
        {
            _logger.LogInformation($"[Chat] Запрос от пользователя {user.Email}, категория: {request.Category}");

            // Добавляем userId в контекст
            if (request.Context == null)
            {
                request.Context = new Dictionary<string, object>();
            }
            request.Context["userId"] = userId;

            // Получаем или создаем чат
            string chatId;
            if (!string.IsNullOrEmpty(request.ChatId))
            {
                chatId = request.ChatId;
            }
            else
            {
                chatId = await _historyService.GetOrCreateChatSessionAsync(userId, request.Category);
            }

            var response = await _chatService.ProcessChatAsync(request);

            // Сохраняем сообщения в чат
            var userMessage = new ChatMessage
            {
                Id = Guid.NewGuid().ToString(),
                Role = "user",
                Text = request.Message,
                Timestamp = DateTime.UtcNow
            };

            var assistantMessage = new ChatMessage
            {
                Id = Guid.NewGuid().ToString(),
                Role = "assistant",
                Text = response.Response,
                Timestamp = DateTime.UtcNow,
                Suggestions = response.Suggestions
            };

            await _historyService.AddMessageToChatAsync(userId, chatId, userMessage);
            await _historyService.AddMessageToChatAsync(userId, chatId, assistantMessage);

            // Добавляем chatId в ответ
            response.ChatId = chatId;

            var totalTime = (DateTime.UtcNow - startTime).TotalSeconds;
            _logger.LogInformation($"[Chat] Запрос обработан за {totalTime:F1} сек");

            return Ok(response);
        }
        catch (Exception ex)
        {
            var totalTime = (DateTime.UtcNow - startTime).TotalSeconds;
            _logger.LogError(ex, $"[Chat] Ошибка после {totalTime:F1} сек");

            return StatusCode(503, new { detail = ex.Message });
        }
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
