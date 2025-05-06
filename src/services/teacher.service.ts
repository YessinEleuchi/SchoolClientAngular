import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { Teacher } from '../models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private readonly apiUrl = `${environment.apiUrl}/api`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: any, defaultMessage: string): Observable<never> {
    const message = error.error?.message || error.message || defaultMessage;
    console.error(`${defaultMessage}:`, error);
    return throwError(() => ({
      message,
      details: error.error?.details || null // Include detailed error info if available
    }));
  }

  getAllTeachers(): Observable<Teacher[]> {
    return this.http
      .get<{ data: Teacher[] }>(`${this.apiUrl}/teachers`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error, 'Failed to fetch teachers'))
      );
  }

  getTeacherById(id: number): Observable<Teacher> {
    return this.http
      .get<{ data: Teacher }>(`${this.apiUrl}/teachers/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error, `Failed to fetch teacher (ID: ${id})`))
      );
  }
  getTotalTeachers(): Observable<number> {
    return this.http
      .get<{ total: number }>(`${this.apiUrl}/teachers/total`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.total),
        catchError(error => this.handleError(error, 'Failed to fetch total teachers'))
      );
  }

  addTeacher(data: Partial<Teacher>): Observable<void> {
    console.log('Add teacher request data:', data);
    return this.http
      .post<void>(`${this.apiUrl}/add-teacher`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, 'Failed to add teacher'))
      );
  }

  updateTeacher(id: number, data: Partial<Teacher>): Observable<void> {
    console.log('Update teacher request data:', data);
    return this.http
      .put<void>(`${this.apiUrl}/teachers/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to update teacher (ID: ${id})`))
      );
  }

  deleteTeacher(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/teachers/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to delete teacher (ID: ${id})`))
      );
  }
}
