import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Ensure Observable and throwError are imported
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
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

  getAllGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/groups`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to fetch groups');
          console.error('GetAllGroups error:', error);
          return throwError(() => new Error(message));
        })
      );
  }

  addGroup(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/groups`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to add group');
          console.error('AddGroup error:', error);
          return throwError(() => ({ message, error: error.error }));
        })
      );
  }

  updateGroup(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/groups/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to update group');
          console.error(`UpdateGroup error (ID: ${id}):`, error);
          return throwError(() => ({ message, error: error.error }));
        })
      );
  }

  deleteGroup(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/groups/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to delete group');
          console.error(`DeleteGroup error (ID: ${id}):`, error);
          return throwError(() => new Error(message));
        })
      );
  }
}