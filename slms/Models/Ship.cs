namespace slms.Models;

public class Ship
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string Status { get; set; } = string.Empty;

    public int CaptainId { get; set; }
    public Captain? Captain { get; set; }

    public ICollection<Shipment> Shipments { get; set; } = new List<Shipment>();
}
