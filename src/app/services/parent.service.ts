import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { Parent } from '../models/parent.model';

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

  getParentsPaginated(page: number = 1, perPage: number = 6, searchQuery: string = ''): Observable<{ parents: Parent[], pagination: { current_page: number, last_page: number, per_page: number, total: number } }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    if (searchQuery.trim()) {
      params = params.set('search', searchQuery.trim());
    }

    return this.http
      .get<{ parents: Parent[], pagination: { current_page: number, last_page: number, per_page: number, total: number } }>(
        `${this.apiUrl}/parents`,
        { headers: this.getHeaders(), params }
      )
      .pipe(
        map(response => ({
          parents: response.parents,
          pagination: response.pagination
        })),
        catchError(error => this.handleError(error, 'Failed to fetch paginated parents'))
      );
  }
  getParentById(id: number): Observable<Parent> {
    return this.http
      .get<{ parent: Parent}>(`${this.apiUrl}/parents/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.parent),
        catchError(error => this.handleError(error, `Failed to fetch parent (ID: ${id})`))
      );
  }
  getAllParents(): Observable<Parent[]> {
    return this.http
      .get<{ parents: Parent[] }>(`${this.apiUrl}/parents`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.parents),
        catchError(error => this.handleError(error, 'Failed to fetch parents'))
      );
  }
  getAllParentsnp(): Observable<Parent[]> {
    return this.http
      .get<{ parents: Parent[] }>(`${this.apiUrl}/parentsnp`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.parents),
        catchError(error => this.handleError(error, 'Failed to fetch parents'))
      );
  }
  addParent(data: Partial<Parent>): Observable<void> {
    console.log('Add parent request data:', data);
    return this.http
      .post<void>(`${this.apiUrl}/add-parents`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, 'Failed to add parent'))
      );
  }

  updateParent(id: number, data: Partial<Parent>): Observable<void> {
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
