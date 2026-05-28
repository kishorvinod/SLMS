namespace slms.Models;

public class Cargo
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public decimal Weight { get; set; }
    public string Source { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
}
