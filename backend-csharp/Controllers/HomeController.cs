using BusinessAssistant.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BusinessAssistant.Api.Controllers;

[ApiController]
[Route("")]
public class HomeController : ControllerBase
{
    private readonly IConfigurationService _configService;

    public HomeController(IConfigurationService configService)
    {
        _configService = configService;
    }

    [HttpGet]
    public ActionResult Get()
    {
        var config = _configService.GetConfig();
        return Ok(new
        {
            message = config.ApiTitle,
            version = config.ApiVersion
        });
    }
}

