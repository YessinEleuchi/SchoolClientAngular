import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
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

  getAllParents(): Observable<any[]> {
    return this.http.get<{ parents: any[] }>(`${this.apiUrl}/parents`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.parents),
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to fetch parents');
          console.error('GetAllParents error:', error);
          return throwError(() => new Error(message));
        })
      );
  }

  getParentById(id: number): Observable<any> {
    return this.http.get<{ parent: any }>(`${this.apiUrl}/parents/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.parent),
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to fetch parent');
          console.error(`GetParentById error (ID: ${id}):`, error);
          return throwError(() => new Error(message));
        })
      );
  }

  addParent(data: any): Observable<any> {
    console.log('Add parent request data:', data);
    return this.http.post(`${this.apiUrl}/add-parents`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('AddParent error:', error);
          const message = this.extractErrorMessage(error, 'Failed to add parent');
          return throwError(() => ({
            message,
            error: error.error // Pass full error for field-specific errors
          }));
        })
      );
  }

  updateParent(id: number, data: any): Observable<any> {
    console.log('Update parent request data:', data);
    return this.http.put(`${this.apiUrl}/parents/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error(`UpdateParent error (ID: ${id}):`, error);
          const message = this.extractErrorMessage(error, 'Failed to update parent');
          return throwError(() => ({
            message,
            error: error.error
          }));
        })
      );
  }

  deleteParent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/parents/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to delete parent');
          console.error(`DeleteParent error (ID: ${id}):`, error);
          return throwError(() => new Error(message));
        })
      );
  }
}