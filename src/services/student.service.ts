import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';
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
      details: error.error?.details || null
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

  getStudentsPaginated(page: number = 1, perPage: number = 6): Observable<{ students: Student[], pagination: any }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http
      .get<{ students: Student[], pagination: { current_page: number, last_page: number, per_page: number, total: number } }>(
        `${this.apiUrl}/studentsPaginated`,
        { headers: this.getHeaders(), params }
      )
      .pipe(
        map(response => ({
          students: response.students,
          pagination: response.pagination
        })),
        catchError(error => this.handleError(error, 'Failed to fetch paginated students'))
      );
  }
  getTotalStudents(): Observable<number> {
    return this.http
      .get<{ success: boolean; total_students: number }>(`${this.apiUrl}/students/total`, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log(response)), // Log the full response
        map(response => response.total_students), // Extract correct field
        catchError(error => this.handleError(error, 'Failed to fetch total students'))
      );
  }





  getTotalStudentsByCycle(cycleId: number): Observable<number> {
    return this.http
      .get<{  success: boolean; total_students: number }>(`${this.apiUrl}/cycles/${cycleId}/students/total`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.total_students),
        catchError(error => this.handleError(error, `Failed to fetch total students for cycle (ID: ${cycleId})`))
      );
  }

  getTotalStudentsByField(fieldId: number): Observable<number> {
    return this.http
      .get<{ total: number }>(`${this.apiUrl}/fields/${fieldId}/students/total`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.total),
        catchError(error => this.handleError(error, `Failed to fetch total students for field (ID: ${fieldId})`))
      );
  }

  getTotalStudentsBySpecialization(specializationId: number): Observable<number> {
    return this.http
      .get<{ total: number }>(`${this.apiUrl}/specializations/${specializationId}/students/total`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.total),
        catchError(error => this.handleError(error, `Failed to fetch total students for specialization (ID: ${specializationId})`))
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
