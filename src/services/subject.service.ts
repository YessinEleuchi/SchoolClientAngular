import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { Subject } from '../models/subject.model';
import {Specialization} from "../models/specialization.model";

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
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

  getAllSubjects(): Observable<Subject[]> {
    return this.http
      .get<Subject[]>(`${this.apiUrl}/subjects`, { headers: this.getHeaders() })
      .pipe(
        tap(Subjects => console.log('Subject API Response:', Subjects)), // Log the response
        catchError(error => this.handleError(error, 'Failed to fetch Subject'))
      );
  }

  getSubjectById(id: number): Observable<Subject> {
    return this.http
      .get<{ data: Subject }>(`${this.apiUrl}/subjects/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error, `Failed to fetch subject (ID: ${id})`))
      );
  }

  addSubject(data: Partial<Subject>): Observable<void> {
    console.log('Add subject request data:', data);
    return this.http
      .post<void>(`${this.apiUrl}/subjects`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, 'Failed to add subject'))
      );
  }

  updateSubject(id: number, data: Partial<Subject>): Observable<void> {
    console.log('Update subject request data:', data);
    return this.http
      .put<void>(`${this.apiUrl}/subjects/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to update subject (ID: ${id})`))
      );
  }

  deleteSubject(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/subjects/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to delete subject (ID: ${id})`))
      );
  }
}
