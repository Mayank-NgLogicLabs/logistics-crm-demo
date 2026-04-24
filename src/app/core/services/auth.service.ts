import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Morgan', email: 'admin@freightflow.com', role: 'admin', avatar: 'AM', department: 'Operations' },
  { id: 'u2', name: 'Sara Chen', email: 'manager@freightflow.com', role: 'manager', avatar: 'SC', department: 'Logistics' },
];

const CREDENTIALS: Record<string, string> = {
  'admin@freightflow.com': 'Password@123',
  'manager@freightflow.com': 'Password@123',
};

const STORAGE_KEY = 'ff_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(email: string, password: string): Observable<User> {
    if (CREDENTIALS[email] && CREDENTIALS[email] === password) {
      const user = MOCK_USERS.find(u => u.email === email)!;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return of(user).pipe(delay(900));
    }
    return throwError(() => new Error('Invalid email or password')).pipe(delay(900));
  }

  logout(): Observable<void> {
    localStorage.removeItem(STORAGE_KEY);
    return of(void 0);
  }

  getStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
