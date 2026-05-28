import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { finalize } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Shipment, ShipmentStatus } from '../../../shared/models/shipment.model';

@Component({
  selector: 'app-my-shipments',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule
  ],
  templateUrl: './my-shipments.component.html',
  styleUrl: './my-shipments.component.css'
})
export class MyShipmentsComponent implements OnInit {
  shipments: Shipment[] = [];
  statuses: ShipmentStatus[] = ['Picked', 'In Transit', 'Delivered'];
  displayedColumns = ['ship', 'cargo', 'status', 'update'];
  loading = false;
  updatingId: number | null = null;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadShipments();
  }

  loadShipments(): void {
    this.loading = true;
    this.apiService.getMyShipments().pipe(finalize(() => (this.loading = false))).subscribe({
      next: (shipments) => (this.shipments = shipments),
      error: () => this.snackBar.open('Unable to load your shipments', 'Close', { duration: 3500 })
    });
  }

  updateStatus(shipment: Shipment, status: ShipmentStatus): void {
    if (!shipment.id) {
      this.snackBar.open('Shipment id is missing', 'Close', { duration: 3500 });
      return;
    }

    this.updatingId = shipment.id;
    this.apiService.updateShipmentStatus(shipment.id, status).pipe(
      finalize(() => (this.updatingId = null))
    ).subscribe({
      next: () => {
        this.snackBar.open('Shipment status updated', 'Close', { duration: 2500 });
        this.loadShipments();
      },
      error: () => this.snackBar.open('Unable to update status', 'Close', { duration: 3500 })
    });
  }

  getShipName(shipment: Shipment): string {
    return shipment.ship?.name ?? `Ship #${shipment.shipId}`;
  }

  getCargoName(shipment: Shipment): string {
    return shipment.cargo?.name ?? `Cargo #${shipment.cargoId}`;
  }
}
