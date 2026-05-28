import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-captain-dashboard',
  standalone: true,
  imports: [MatCardModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './captain-dashboard.component.html',
  styleUrl: './captain-dashboard.component.css'
})
export class CaptainDashboardComponent implements OnInit {
  loading = true;
  assignedShipments = 0;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.apiService.getMyShipments().subscribe({
      next: (shipments) => {
        this.assignedShipments = shipments.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Unable to load assigned shipments', 'Close', { duration: 3500 });
      }
    });
  }
}
