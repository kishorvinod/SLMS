import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../shared/models/user.model';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['role'] as UserRole;

  if (authService.getRole() === expectedRole) {
    return true;
  }

  return router.createUrlTree([authService.getHomeRoute()]);
};
