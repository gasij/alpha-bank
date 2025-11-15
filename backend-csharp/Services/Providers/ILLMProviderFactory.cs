namespace BusinessAssistant.Api.Services.Providers;

public interface ILLMProviderFactory
{
    ILLMProvider GetProvider();
}

