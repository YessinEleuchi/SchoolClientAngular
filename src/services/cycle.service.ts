import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Ensure Observable and throwError are imported
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CycleService {
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

  getAllCycles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cycles`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to fetch cycles');
          console.error('GetAllCycles error:', error);
          return throwError(() => new Error(message));
        })
      );
  }

  addCycle(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cycles`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to add cycle');
          console.error('AddCycle error:', error);
          return throwError(() => ({ message, error: error.error }));
        })
      );
  }

  updateCycle(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cycles/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to update cycle');
          console.error(`UpdateCycle error (ID: ${id}):`, error);
          return throwError(() => ({ message, error: error.error }));
        })
      );
  }

  deleteCycle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cycles/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to delete cycle');
          console.error(`DeleteCycle error (ID: ${id}):`, error);
          return throwError(() => new Error(message));
        })
      );
  }
}