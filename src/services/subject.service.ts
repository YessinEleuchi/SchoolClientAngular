import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Ensure Observable and throwError are imported
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
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

  getAllSubjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/subjects`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to fetch subjects');
          console.error('GetAllSubjects error:', error);
          return throwError(() => new Error(message));
        })
      );
  }

  addSubject(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/subjects`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to add subject');
          console.error('AddSubject error:', error);
          return throwError(() => ({ message, error: error.error }));
        })
      );
  }

  updateSubject(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/subjects/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to update subject');
          console.error(`UpdateSubject error (ID: ${id}):`, error);
          return throwError(() => ({ message, error: error.error }));
        })
      );
  }

  deleteSubject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/subjects/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to delete subject');
          console.error(`DeleteSubject error (ID: ${id}):`, error);
          return throwError(() => new Error(message));
        })
      );
  }
}