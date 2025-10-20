import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authUrl = 'https://api.example.com/auth';
  constructor(private http: HttpClient) {}
  register(credentials: {username:string, email: string; password: string }): Observable<any> {
    return this.http
      .post<{ token: string }>(`${this.authUrl}/register`, credentials)
      .pipe(tap((response) => localStorage.setItem('token', response.token)));
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post<{ token: string }>(`${this.authUrl}/login`, credentials)
      .pipe(tap((response) => localStorage.setItem('token', response.token)));
  }
  logout(): void {
    localStorage.removeItem('token');
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  hasRole(role: string): boolean {
  const token = this.getToken();
  if (!token) return false;
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.roles.includes(role);
}
}
