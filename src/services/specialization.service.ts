import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Ensure Observable and throwError are imported
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {
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

  getAllSpecializations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/specializations`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to fetch specializations');
          console.error('GetAllSpecializations error:', error);
          return throwError(() => new Error(message));
        })
      );
  }

  addSpecialization(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/specializations`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to add specialization');
          console.error('AddSpecialization error:', error);
          return throwError(() => ({ message, error: error.error }));
        })
      );
  }

  updateSpecialization(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/specializations/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to update specialization');
          console.error(`UpdateSpecialization error (ID: ${id}):`, error);
          return throwError(() => ({ message, error: error.error }));
        })
      );
  }

  deleteSpecialization(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/specializations/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to delete specialization');
          console.error(`DeleteSpecialization error (ID: ${id}):`, error);
          return throwError(() => new Error(message));
        })
      );
  }
}