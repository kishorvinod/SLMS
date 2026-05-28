import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cargo } from '../../shared/models/cargo.model';
import { Ship } from '../../shared/models/ship.model';
import { Shipment, ShipmentStatus } from '../../shared/models/shipment.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getShips(): Observable<Ship[]> {
    return this.http.get<Ship[]>(`${this.baseUrl}/ships`);
  }

  createShip(ship: Ship): Observable<Ship> {
    return this.http.post<Ship>(`${this.baseUrl}/ships`, ship);
  }

  getCargo(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(`${this.baseUrl}/cargo`);
  }

  createCargo(cargo: Cargo): Observable<Cargo> {
    return this.http.post<Cargo>(`${this.baseUrl}/cargo`, cargo);
  }

  getShipments(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(`${this.baseUrl}/shipment`);
  }

  createShipment(shipment: Shipment): Observable<Shipment> {
    return this.http.post<Shipment>(`${this.baseUrl}/shipment`, shipment);
  }

  getMyShipments(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(`${this.baseUrl}/shipment/my`);
  }

  updateShipmentStatus(id: number, status: ShipmentStatus): Observable<Shipment> {
    return this.http.put<Shipment>(`${this.baseUrl}/shipment/${id}/status`, { status });
  }
}
