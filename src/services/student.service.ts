import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
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

  getAllStudents(): Observable<any[]> {
    return this.http.get<{ students: any[] }>(`${this.apiUrl}/students`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.students),
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to fetch students');
          console.error('GetAllStudents error:', error);
          return throwError(() => new Error(message));
        })
      );
  }

  getStudentById(id: number): Observable<any> {
    return this.http.get<{ student: any }>(`${this.apiUrl}/student/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.student),
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to fetch student');
          console.error(`GetStudentById error (ID: ${id}):`, error);
          return throwError(() => new Error(message));
        })
      );
  }

  addStudent(data: any): Observable<any> {
    console.log('Add student request data:', data);
    return this.http.post(`${this.apiUrl}/add-student`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('AddStudent error:', error);
          const message = this.extractErrorMessage(error, 'Failed to add student');
          return throwError(() => ({
            message,
            error: error.error // Pass full error for field-specific errors
          }));
        })
      );
  }

  updateStudent(id: number, data: any): Observable<any> {
    console.log('Update student request data:', data);
    return this.http.put(`${this.apiUrl}/student/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error(`UpdateStudent error (ID: ${id}):`, error);
          const message = this.extractErrorMessage(error, 'Failed to update student');
          return throwError(() => ({
            message,
            error: error.error
          }));
        })
      );
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/student/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          const message = this.extractErrorMessage(error, 'Failed to delete student');
          console.error(`DeleteStudent error (ID: ${id}):`, error);
          return throwError(() => new Error(message));
        })
      );
  }
}