import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatCardModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  loading = true;
  totalShips = 0;
  totalCargo = 0;
  totalShipments = 0;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    forkJoin({
      ships: this.apiService.getShips(),
      cargo: this.apiService.getCargo(),
      shipments: this.apiService.getShipments()
    }).subscribe({
      next: ({ ships, cargo, shipments }) => {
        this.totalShips = ships.length;
        this.totalCargo = cargo.length;
        this.totalShipments = shipments.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Unable to load dashboard data', 'Close', { duration: 3500 });
      }
    });
  }
}
