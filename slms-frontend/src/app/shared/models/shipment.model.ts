import { Cargo } from './cargo.model';
import { Ship } from './ship.model';

export type ShipmentStatus = 'Pending' | 'Picked' | 'In Transit' | 'Delivered';

export interface Shipment {
  id?: number;
  shipId: number;
  cargoId: number;
  captainId?: number;
  status: ShipmentStatus | string;
  ship?: Ship;
  cargo?: Cargo;
}
