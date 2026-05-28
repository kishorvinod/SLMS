import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { finalize } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Ship } from '../../../shared/models/ship.model';

@Component({
  selector: 'app-ships',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    ReactiveFormsModule
  ],
  templateUrl: './ships.component.html',
  styleUrl: './ships.component.css'
})
export class ShipsComponent implements OnInit {
  ships: Ship[] = [];
  displayedColumns = ['name', 'capacity', 'status'];
  loading = false;
  saving = false;
  statuses = ['Available', 'In Service', 'Maintenance'];

  shipForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    capacity: [0, [Validators.required, Validators.min(1)]],
    status: ['Available', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadShips();
  }

  loadShips(): void {
    this.loading = true;
    this.apiService.getShips().pipe(finalize(() => (this.loading = false))).subscribe({
      next: (ships) => (this.ships = ships),
      error: () => this.snackBar.open('Unable to load ships', 'Close', { duration: 3500 })
    });
  }

  createShip(): void {
    if (this.shipForm.invalid) {
      this.shipForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.apiService.createShip(this.shipForm.getRawValue()).pipe(
      finalize(() => (this.saving = false))
    ).subscribe({
      next: () => {
        this.snackBar.open('Ship created', 'Close', { duration: 2500 });
        this.shipForm.reset({ name: '', capacity: 0, status: 'Available' });
        this.loadShips();
      },
      error: () => this.snackBar.open('Unable to create ship', 'Close', { duration: 3500 })
    });
  }
}
