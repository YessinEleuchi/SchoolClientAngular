import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Ensure Observable and throwError are imported
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  private extractErrorMessage(error: any, defaultMessage: string): string {
    return error.error?.message || error.message || defaultMessage;
  }

  getAllLevels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/levels`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to fetch levels');
          console.error('GetAllLevels error:', error);
          return throwError(() => new Error(message));
        })
      );
  }

  addLevel(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/levels`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to add level');
          console.error('AddLevel error:', error);
          return throwError(() => ({ message, error: error.error }));
        })
      );
  }

  updateLevel(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/levels/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to update level');
          console.error(`UpdateLevel error (ID: ${id}):`, error);
          return throwError(() => ({ message, error: error.error }));
        })
      );
  }

  deleteLevel(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/levels/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to delete level');
          console.error(`DeleteLevel error (ID: ${id}):`, error);
          return throwError(() => new Error(message));
        })
      );
  }
}