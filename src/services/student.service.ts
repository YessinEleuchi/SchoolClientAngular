import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
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

  getAllStudents(): Observable<Student[]> {
    return this.http
      .get<{ students: Student[] }>(`${this.apiUrl}/students`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.students),
        catchError(error => this.handleError(error, 'Failed to fetch students'))
      );
  }

  getStudentById(id: number): Observable<Student> {
    return this.http
      .get<{ student: Student }>(`${this.apiUrl}/students/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.student),
        catchError(error => this.handleError(error, `Failed to fetch student (ID: ${id})`))
      );
  }

  addStudent(data: Partial<Student>): Observable<void> {
    console.log('Add student request data:', data);
    return this.http
      .post<void>(`${this.apiUrl}/students`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, 'Failed to add student'))
      );
  }

  updateStudent(id: number, data: Partial<Student>): Observable<void> {
    console.log('Update student request data:', data);
    return this.http
      .put<void>(`${this.apiUrl}/students/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to update student (ID: ${id})`))
      );
  }

  deleteStudent(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/students/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, `Failed to delete student (ID: ${id})`))
      );
  }
}
