import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { StudentService } from '../../../../services/student.service';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';
import { Student } from 'app/models/student.model';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  pagination: { current_page: number; last_page: number; per_page: number; total: number } | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  isMobile: boolean = window.innerWidth < 640;
  searchQuery: string = '';
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription | null = null;

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user?.role.toLowerCase() !== 'admin') {
      this.authService.logout();
      return;
    }
    this.setupSearch();
    this.loadStudentsPaginated();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth < 640;
  }

  private setupSearch(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((query) => {
        this.searchQuery = query;
        this.loadStudentsPaginated(1);
      });
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  loadStudentsPaginated(page: number = 1, perPage: number = 6): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.studentService.getStudentsPaginated(page, perPage, this.searchQuery).subscribe({
      next: (response) => {
        this.students = response.students;
        this.pagination = response.pagination;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load students';
        this.isLoading = false;
        this.students = [];
      }
    });
  }

  getPageNumbers(): number[] {
    if (!this.pagination) return [];
    const currentPage = this.pagination.current_page;
    const lastPage = this.pagination.last_page;
    const maxPagesToShow = 5;
    const pages: number[] = [];

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(lastPage, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.pagination!.last_page) {
      this.loadStudentsPaginated(page);
    }
  }

  addStudent(): void {
    this.router.navigate(['/admin/students/add']);
  }

  editStudent(id: number): void {
    this.router.navigate([`/admin/students/edit/${id}`]);
  }

  deleteStudent(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: this.isMobile ? '90%' : '300px',
      data: { message: 'Are you sure you want to delete this student?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.deleteStudent(id).subscribe({
          next: () => {
            this.loadStudentsPaginated(this.pagination!.current_page);
            this.errorMessage = '';
          },
          error: (err) => {
            this.errorMessage = err.message || 'Failed to delete student';
          }
        });
      }
    });
  }
}
