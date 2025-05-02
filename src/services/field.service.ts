import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Ensure Observable and throwError are imported
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FieldService {
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

  getAllFields(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fields`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to fetch fields');
          console.error('GetAllFields error:', error);
          return throwError(() => new Error(message));
        })
      );
  }

  addField(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/fields`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to add field');
          console.error('AddField error:', error);
          return throwError(() => ({ message, error: error.error }));
        })
      );
  }

  updateField(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/fields/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to update field');
          console.error(`UpdateField error (ID: ${id}):`, error);
          return throwError(() => ({ message, error: error.error }));
        })
      );
  }

  deleteField(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/fields/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to delete field');
          console.error(`DeleteField error (ID: ${id}):`, error);
          return throwError(() => new Error(message));
        })
      );
  }
}