using BusinessAssistant.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace BusinessAssistant.Api.Controllers;

[ApiController]
[Route("categories")]
public class CategoriesController : ControllerBase
{
    [HttpGet]
    public ActionResult<CategoriesResponse> Get()
    {
        var categories = new List<Category>
        {
            new() { Id = "general", Name = "Общие вопросы", Icon = "💼" },
            new() { Id = "legal", Name = "Юридические вопросы", Icon = "⚖️" },
            new() { Id = "marketing", Name = "Маркетинг", Icon = "📈" },
            new() { Id = "finance", Name = "Финансы", Icon = "💰" },
            new() { Id = "documents", Name = "Документы", Icon = "📝" }
        };

        return Ok(new CategoriesResponse { Categories = categories });
    }
}

public class CategoriesResponse
{
    public List<Category> Categories { get; set; } = new();
}

