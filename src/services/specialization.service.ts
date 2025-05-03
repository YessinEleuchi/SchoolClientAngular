import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { Specialization } from '../models/specialization.model';

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {
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

  getAllSpecializations(): Observable<Specialization[]> {
    return this.http
      .get<{ data: Specialization[] }>(`${this.apiUrl}/specializations`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error, 'Failed to fetch specializations'))
      );
  }

  getSpecializationById(id: number): Observable<Specialization> {
    return this.http
      .get<{ data: Specialization }>(`${this.apiUrl}/specializations/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error, `Failed to fetch specialization (ID: ${id})`))
      );
  }

  addSpecialization(data: Partial<Specialization>): Observable<void> {
    console.log('Add specialization request data:', data);
    return this.http
      .post<void>(`${this.apiUrl}/specializations`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, 'Failed to add specialization'))
      );
  }

  updateSpecialization(id: number, data: Partial<Specialization>): Observable<void> {
    console.log('Update specialization request data:', data);
    return this.http
      .put<void>(`${this.apiUrl}/specializations/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to update specialization (ID: ${id})`))
      );
  }

  deleteSpecialization(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/specializations/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to delete specialization (ID: ${id})`))
      );
  }
}
