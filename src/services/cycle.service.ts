import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { Cycle } from '../models/cycle.model';

@Injectable({
  providedIn: 'root'
})
export class CycleService {
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

  getAllCycles(): Observable<Cycle[]> {
    return this.http
      .get<Cycle[]>(`${this.apiUrl}/cycles`, { headers: this.getHeaders() })
      .pipe(
        tap(cycles => console.log('Cycles API Response:', cycles)), // Log the response
        catchError(error => this.handleError(error, 'Failed to fetch cycles'))
      );
  }
  getCycleById(id: number): Observable<Cycle> {
    return this.http
      .get<{ data: Cycle }>(`${this.apiUrl}/cycles/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error, `Failed to fetch cycle (ID: ${id})`))
      );
  }

  addCycle(data: Partial<Cycle>): Observable<void> {
    console.log('Add cycle request data:', data);
    return this.http
      .post<void>(`${this.apiUrl}/cycles`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, 'Failed to add cycle'))
      );
  }

  updateCycle(id: number, data: Partial<Cycle>): Observable<void> {
    console.log('Update cycle request data:', data);
    return this.http
      .put<void>(`${this.apiUrl}/cycles/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to update cycle (ID: ${id})`))
      );
  }

  deleteCycle(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/cycles/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to delete cycle (ID: ${id})`))
      );
  }
}
