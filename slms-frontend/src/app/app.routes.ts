import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { CargoComponent } from './features/admin/cargo/cargo.component';
import { ShipmentsComponent } from './features/admin/shipments/shipments.component';
import { ShipsComponent } from './features/admin/ships/ships.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { CaptainDashboardComponent } from './features/captain/dashboard/captain-dashboard.component';
import { MyShipmentsComponent } from './features/captain/my-shipments/my-shipments.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' },
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'ships', component: ShipsComponent },
      { path: 'cargo', component: CargoComponent },
      { path: 'shipments', component: ShipmentsComponent },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  {
    path: 'captain',
    canActivate: [authGuard, roleGuard],
    data: { role: 'Captain' },
    children: [
      { path: 'dashboard', component: CaptainDashboardComponent },
      { path: 'my-shipments', component: MyShipmentsComponent },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];
