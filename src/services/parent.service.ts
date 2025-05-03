import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { Parents } from '../models/parent.model';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
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

  getAllParents(): Observable<Parents[]> {
    return this.http
      .get<{ parents: Parents[] }>(`${this.apiUrl}/parents`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.parents),
        catchError(error => this.handleError(error, 'Failed to fetch parents'))
      );
  }

  getParentById(id: number): Observable<Parents> {
    return this.http
      .get<{ parent: Parents }>(`${this.apiUrl}/parents/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.parent),
        catchError(error => this.handleError(error, `Failed to fetch parent (ID: ${id})`))
      );
  }

  addParent(data: Partial<Parents>): Observable<void> {
    console.log('Add parent request data:', data);
    return this.http
      .post<void>(`${this.apiUrl}/add-parents`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, 'Failed to add parent'))
      );
  }

  updateParent(id: number, data: Partial<Parents>): Observable<void> {
    console.log('Update parent request data:', data);
    return this.http
      .put<void>(`${this.apiUrl}/parents/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to update parent (ID: ${id})`))
      );
  }

  deleteParent(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/parents/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to delete parent (ID: ${id})`))
      );
  }
}
