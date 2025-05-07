import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TeacherService } from '../../../../services/teacher.service';
import { AuthService } from '../../../../services/auth.service';
import { Teacher } from '../../../../models/teacher.model';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  dataSource: Teacher[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'admission_no', 'status', 'action'];
  pagination: { current_page: number; last_page: number; per_page: number; total: number } | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  isMobile: boolean = window.innerWidth < 640; // Mobile breakpoint (sm)

  constructor(
    private teacherService: TeacherService,
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
    this.loadTeachers();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth < 640;
  }

  loadTeachers(page: number = 1, perPage: number = 6): void {
    this.isLoading = true;
    this.teacherService.getTeacherPaginated(page, perPage).subscribe({
      next: (response) => {
        this.dataSource = response.teachers;
        this.pagination = response.pagination;
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.pagination!.last_page) {
      this.loadTeachers(page);
    }
  }

  getPageNumbers(): number[] {
    if (!this.pagination) return [];
    const currentPage = this.pagination.current_page;
    const lastPage = this.pagination.last_page;
    const maxPagesToShow = 5; // Show up to 5 page numbers
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

  delete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: this.isMobile ? '90%' : '300px',
      height: '200px',
      data: { message: 'Are you sure you want to delete this teacher?' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teacherService.deleteTeacher(id).subscribe({
          next: () => {
            // Reload the current page to maintain pagination
            this.loadTeachers(this.pagination!.current_page);
            this.errorMessage = '';
          },
          error: (err) => {
            this.errorMessage = err.message;
          }
        });
      }
    });
  }

  edit(id: number): void {
    this.router.navigate([`/admin/teachers/edit/${id}`]);
  }

  add(): void {
    this.router.navigate([`/admin/teachers/add`]);
  }
}
