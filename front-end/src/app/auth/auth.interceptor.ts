import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('🔍 Interceptor fired for URL:', req.url);

    const token = localStorage.getItem('token');
    console.log('🔑 Token from localStorage:', token ? 'EXISTS' : 'NULL');

    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Authorization header added');
      console.log('📋 All headers:', req.headers.keys());
    } else {
      console.log('❌ No token found, skipping header');
    }

    return next.handle(req);
  }
}
