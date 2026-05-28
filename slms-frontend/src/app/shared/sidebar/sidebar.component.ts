import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, MatListModule, MatSidenavModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  adminLinks: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Ships', icon: 'directions_boat', route: '/admin/ships' },
    { label: 'Cargo', icon: 'inventory_2', route: '/admin/cargo' },
    { label: 'Shipments', icon: 'route', route: '/admin/shipments' }
  ];

  captainLinks: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/captain/dashboard' },
    { label: 'My Shipments', icon: 'assignment', route: '/captain/my-shipments' }
  ];

  constructor(private authService: AuthService) {}

  get links(): NavItem[] {
    return this.authService.getRole() === 'Admin' ? this.adminLinks : this.captainLinks;
  }
}
