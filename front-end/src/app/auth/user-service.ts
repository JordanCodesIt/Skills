import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private platformId = inject(PLATFORM_ID);
  private accessToken: string | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.accessToken = sessionStorage.getItem('accessToken');
    }
  }

  setToken(token: string): void {
    this.accessToken = token;
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('accessToken', token);
    }
  }

  getToken(): string | null {
    return this.accessToken;
  }

  clearToken(): void {
    this.accessToken = null;
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('accessToken');
    }
  }

  hasToken(): boolean {
    return this.accessToken !== null;
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  logout(): void {
    this.clearToken();
  }
}
