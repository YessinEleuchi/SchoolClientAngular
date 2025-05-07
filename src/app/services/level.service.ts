import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { Level } from '../models/level.model';
import {Group} from "../models/group.model";

@Injectable({
  providedIn: 'root'
})
export class LevelService {
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

  getAllLevels(): Observable<Level[]> {
    return this.http
      .get<Level[]>(`${this.apiUrl}/levels`, { headers: this.getHeaders() })
      .pipe(
        tap(levels => console.log('levels API Response:', levels)), // Log the response
        catchError(error => this.handleError(error, 'Failed to fetch levels'))
      );
  }

  getLevelById(id: number): Observable<Level> {
    return this.http
      .get<{ data: Level }>(`${this.apiUrl}/levels/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error, `Failed to fetch level (ID: ${id})`))
      );
  }

  addLevel(data: Partial<Level>): Observable<void> {
    console.log('Add level request data:', data);
    return this.http
      .post<void>(`${this.apiUrl}/levels`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, 'Failed to add level'))
      );
  }

  updateLevel(id: number, data: Partial<Level>): Observable<void> {
    console.log('Update level request data:', data);
    return this.http
      .put<void>(`${this.apiUrl}/levels/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to update level (ID: ${id})`))
      );
  }

  deleteLevel(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/levels/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to delete level (ID: ${id})`))
      );
  }
}
