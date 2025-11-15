using Microsoft.AspNetCore.Mvc;

namespace BusinessAssistant.Api.Controllers;

[ApiController]
[Route("health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public ActionResult Get()
    {
        return Ok(new { status = "healthy" });
    }
}

