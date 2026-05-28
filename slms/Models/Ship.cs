namespace slms.Models;

public class Ship
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public int Capacity { get; set; }
    public string Status { get; set; } //Available, InTransit, Maintenance

}