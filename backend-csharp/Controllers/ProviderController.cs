using BusinessAssistant.Api.Models;
using BusinessAssistant.Api.Services;
using BusinessAssistant.Api.Services.Providers;
using Microsoft.AspNetCore.Mvc;

namespace BusinessAssistant.Api.Controllers;

[ApiController]
[Route("provider")]
public class ProviderController : ControllerBase
{
    private readonly IConfigurationService _configService;
    private readonly ILLMProviderFactory _providerFactory;

    public ProviderController(IConfigurationService configService, ILLMProviderFactory providerFactory)
    {
        _configService = configService;
        _providerFactory = providerFactory;
    }

    [HttpGet("info")]
    public ActionResult<ProviderInfo> GetInfo()
    {
        var config = _configService.GetConfig();
        return Ok(new ProviderInfo
        {
            Provider = config.LlmProvider,
            Model = config.DefaultModel,
            FallbackModel = config.FallbackModel
        });
    }

    [HttpGet("status")]
    public async Task<ActionResult<ProviderInfo>> GetStatus()
    {
        var config = _configService.GetConfig();
        try
        {
            var provider = _providerFactory.GetProvider();
            var isAvailable = await provider.IsAvailableAsync();

            return Ok(new ProviderInfo
            {
                Provider = config.LlmProvider,
                Model = config.DefaultModel,
                Available = isAvailable
            });
        }
        catch (Exception ex)
        {
            return Ok(new ProviderInfo
            {
                Provider = config.LlmProvider,
                Model = config.DefaultModel,
                Available = false,
                Error = ex.Message
            });
        }
    }
}

