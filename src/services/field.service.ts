import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { Field } from '../models/field.model';
import {Cycle} from "../models/cycle.model";

@Injectable({
  providedIn: 'root'
})
export class FieldService {
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

  getAllFields(): Observable<Cycle[]> {
    return this.http
      .get<Field[]>(`${this.apiUrl}/fields`, { headers: this.getHeaders() })
      .pipe(
        tap(fields => console.log('Fields API Response:', fields)), // Log the response
        catchError(error => this.handleError(error, 'Failed to fetch fields'))
      );
  }

  getFieldById(id: number): Observable<Field> {
    return this.http
      .get<{ data: Field }>(`${this.apiUrl}/fields/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error, `Failed to fetch field (ID: ${id})`))
      );
  }

  addField(data: Partial<Field>): Observable<void> {
    console.log('Add field request data:', data);
    return this.http
      .post<void>(`${this.apiUrl}/fields`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, 'Failed to add field'))
      );
  }

  updateField(id: number, data: Partial<Field>): Observable<void> {
    console.log('Update field request data:', data);
    return this.http
      .put<void>(`${this.apiUrl}/fields/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to update field (ID: ${id})`))
      );
  }

  deleteField(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/fields/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to delete field (ID: ${id})`))
      );
  }
}
