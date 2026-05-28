import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { finalize, forkJoin } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Cargo } from '../../../shared/models/cargo.model';
import { Ship } from '../../../shared/models/ship.model';
import { Shipment } from '../../../shared/models/shipment.model';

@Component({
  selector: 'app-shipments',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    ReactiveFormsModule
  ],
  templateUrl: './shipments.component.html',
  styleUrl: './shipments.component.css'
})
export class ShipmentsComponent implements OnInit {
  ships: Ship[] = [];
  cargo: Cargo[] = [];
  shipments: Shipment[] = [];
  displayedColumns = ['ship', 'cargo', 'status'];
  loading = false;
  saving = false;

  shipmentForm = this.fb.nonNullable.group({
    shipId: [0, [Validators.required, Validators.min(1)]],
    cargoId: [0, [Validators.required, Validators.min(1)]],
    status: ['Pending']
  });

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPageData();
  }

  loadPageData(): void {
    this.loading = true;
    forkJoin({
      ships: this.apiService.getShips(),
      cargo: this.apiService.getCargo(),
      shipments: this.apiService.getShipments()
    }).pipe(finalize(() => (this.loading = false))).subscribe({
      next: ({ ships, cargo, shipments }) => {
        this.ships = ships;
        this.cargo = cargo;
        this.shipments = shipments;
      },
      error: () => this.snackBar.open('Unable to load shipments', 'Close', { duration: 3500 })
    });
  }

  createShipment(): void {
    if (this.shipmentForm.invalid) {
      this.shipmentForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.apiService.createShipment(this.shipmentForm.getRawValue()).pipe(
      finalize(() => (this.saving = false))
    ).subscribe({
      next: () => {
        this.snackBar.open('Shipment created', 'Close', { duration: 2500 });
        this.shipmentForm.reset({ shipId: 0, cargoId: 0, status: 'Pending' });
        this.loadPageData();
      },
      error: () => this.snackBar.open('Unable to create shipment', 'Close', { duration: 3500 })
    });
  }

  getShipName(shipment: Shipment): string {
    return shipment.ship?.name ?? this.ships.find((ship) => ship.id === shipment.shipId)?.name ?? 'Unknown ship';
  }

  getCargoName(shipment: Shipment): string {
    return shipment.cargo?.name ?? this.cargo.find((item) => item.id === shipment.cargoId)?.name ?? 'Unknown cargo';
  }
}
