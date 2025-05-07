import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<{ token: string, user: User }> {
    return this.http.post<{ success: boolean, token: string, user: User }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map(response => {
          if (response.success) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            return { token: response.token, user: response.user };
          }
          throw new Error('Login failed');
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  redirectBasedOnRole(): void {
    const user = this.getUser();
    if (user) {
      switch (user.role.toLowerCase()) {
        case 'admin':
          this.router.navigate(['/admin']);
          break;
        case 'teacher':
          this.router.navigate(['/teacher']);
          break;
        case 'student':
          this.router.navigate(['/student']);
          break;
        case 'parent':
          this.router.navigate(['/parent']);
          break;
        default:
          this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
