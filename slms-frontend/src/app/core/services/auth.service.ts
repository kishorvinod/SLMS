import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, UserRole } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000/api/auth';
  private readonly tokenKey = 'slms_token';
  private readonly roleKey = 'slms_role';

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => this.saveSession(response))
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap((response) => {
        if (response.token) {
          this.saveSession(response);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): UserRole | null {
    const savedRole = localStorage.getItem(this.roleKey) as UserRole | null;
    return savedRole ?? this.readRoleFromToken();
  }

  getHomeRoute(): string {
    return this.getRole() === 'Admin' ? '/admin/dashboard' : '/captain/dashboard';
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);

    const role = response.user?.role ?? this.readRoleFromToken(response.token);
    if (role) {
      localStorage.setItem(this.roleKey, role);
    }
  }

  private readRoleFromToken(token = this.getToken()): UserRole | null {
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as Record<string, string>;
      const role =
        payload['role'] ??
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return role === 'Admin' || role === 'Captain' ? role : null;
    } catch {
      return null;
    }
  }
}
