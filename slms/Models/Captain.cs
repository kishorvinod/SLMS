namespace slms.Models;

public class Captain
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public ICollection<Ship> Ships { get; set; } = new List<Ship>();
}
