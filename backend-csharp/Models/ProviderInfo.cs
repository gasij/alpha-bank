namespace BusinessAssistant.Api.Models;

public class ProviderInfo
{
    public string Provider { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string? FallbackModel { get; set; }
    public bool? Available { get; set; }
    public string? Error { get; set; }
}

