using BusinessAssistant.Api.Models;

namespace BusinessAssistant.Api.Services;

public interface IConfigurationService
{
    AppConfig GetConfig();
}

