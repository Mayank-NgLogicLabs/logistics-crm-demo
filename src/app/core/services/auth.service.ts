import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { User, LoginCredentials } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mockUser: User = {
    id: '1',
    email: 'admin@logistics.com',
    firstName: 'John',
    lastName: 'Manager',
    role: 'admin' as any,
    phone: '+1 555-0123',
    createdAt: new Date()
  };

  login(credentials: LoginCredentials): Observable<{ user: User; token: string }> {
    // Simulate API call
    if (credentials.email === 'admin@logistics.com' && credentials.password === 'admin123') {
      return of({
        user: this.mockUser,
        token: 'mock-jwt-token-' + Date.now()
      }).pipe(delay(800));
    }
    return throwError(() => new Error('Invalid email or password')).pipe(delay(800));
  }

  logout(): Observable<void> {
    return of(undefined).pipe(delay(300));
  }

  validateToken(token: string): Observable<boolean> {
    return of(!!token).pipe(delay(100));
  }

  getCurrentUser(): Observable<User | null> {
    const token = localStorage.getItem('auth_token');
    if (token) {
      return of(this.mockUser).pipe(delay(100));
    }
    return of(null);
  }
}