import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { Group } from '../models/group.model';
import {Cycle} from "../models/cycle.model";
import {Field} from "../models/field.model";

@Injectable({
  providedIn: 'root'
})
export class GroupService {
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

  getAllGroups(): Observable<Group[]> {
    return this.http
      .get<Group[]>(`${this.apiUrl}/groups`, { headers: this.getHeaders() })
      .pipe(
        tap(groups => console.log('Groups API Response:', groups)), // Log the response
        catchError(error => this.handleError(error, 'Failed to fetch groups'))
      );
  }

  getGroupById(id: number): Observable<Group> {
    return this.http
      .get<{ data: Group }>(`${this.apiUrl}/groups/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error, `Failed to fetch group (ID: ${id})`))
      );
  }

  addGroup(data: Partial<Group>): Observable<void> {
    console.log('Add group request data:', data);
    return this.http
      .post<void>(`${this.apiUrl}/groups`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, 'Failed to add group'))
      );
  }

  updateGroup(id: number, data: Partial<Group>): Observable<void> {
    console.log('Update group request data:', data);
    return this.http
      .put<void>(`${this.apiUrl}/groups/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to update group (ID: ${id})`))
      );
  }

  deleteGroup(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/groups/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to delete group (ID: ${id})`))
      );
  }
}
