namespace slms.Models;

public class Shipment
{
    public int Id { get; set; }

    public int ShipId { get; set; }
    public Ship? Ship { get; set; }

    public int CargoId { get; set; }
    public Cargo? Cargo { get; set; }

    public string Status { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
