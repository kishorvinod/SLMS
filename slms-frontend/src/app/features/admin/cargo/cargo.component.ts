import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { finalize } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Cargo } from '../../../shared/models/cargo.model';

@Component({
  selector: 'app-cargo',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    ReactiveFormsModule
  ],
  templateUrl: './cargo.component.html',
  styleUrl: './cargo.component.css'
})
export class CargoComponent implements OnInit {
  cargo: Cargo[] = [];
  displayedColumns = ['name', 'weight', 'description'];
  loading = false;
  saving = false;

  cargoForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    weight: [0, [Validators.required, Validators.min(1)]],
    description: ['']
  });

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCargo();
  }

  loadCargo(): void {
    this.loading = true;
    this.apiService.getCargo().pipe(finalize(() => (this.loading = false))).subscribe({
      next: (cargo) => (this.cargo = cargo),
      error: () => this.snackBar.open('Unable to load cargo', 'Close', { duration: 3500 })
    });
  }

  createCargo(): void {
    if (this.cargoForm.invalid) {
      this.cargoForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.apiService.createCargo(this.cargoForm.getRawValue()).pipe(
      finalize(() => (this.saving = false))
    ).subscribe({
      next: () => {
        this.snackBar.open('Cargo created', 'Close', { duration: 2500 });
        this.cargoForm.reset({ name: '', weight: 0, description: '' });
        this.loadCargo();
      },
      error: () => this.snackBar.open('Unable to create cargo', 'Close', { duration: 3500 })
    });
  }
}
