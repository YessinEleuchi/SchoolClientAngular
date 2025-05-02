import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
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

  getAllTeachers(): Observable<any[]> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/teachers`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data),
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to fetch teachers');
          console.error('GetAllTeachers error:', error);
          return throwError(() => new Error(message));
        })
      );
  }

  getTeacherById(id: number): Observable<any> {
    return this.http.get<{ data: any }>(`${this.apiUrl}/teachers/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data),
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to fetch teacher');
          console.error(`GetTeacherById error (ID: ${id}):`, error);
          return throwError(() => new Error(message));
        })
      );
  }

  addTeacher(data: any): Observable<any> {
    console.log('Add teacher request data:', data);
    return this.http.post(`${this.apiUrl}/add-teacher`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to add teacher');
          console.error('AddTeacher error:', error);
          return throwError(() => new Error(message));
        })
      );
  }

  updateTeacher(id: number, data: any): Observable<any> {
    console.log('Update request data:', data);
    return this.http.put(`${this.apiUrl}/teachers/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to update teacher');
          console.error(`UpdateTeacher error (ID: ${id}):`, error);
          return throwError(() => new Error(message));
        })
      );
  }

  deleteTeacher(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/teachers/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to delete teacher');
          console.error(`DeleteTeacher error (ID: ${id}):`, error);
          return throwError(() => new Error(message));
        })
      );
  }
}