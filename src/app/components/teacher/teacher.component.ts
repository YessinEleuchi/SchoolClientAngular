import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TeacherService } from '../../../services/teacher.service';
import { AuthService } from '../../../services/auth.service';
import { Teacher } from '../../../models/teacher.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html'
})
export class TeacherComponent implements OnInit {
  dataSource: Teacher[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'admission_no', 'status', 'action'];
  errorMessage: string = '';

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

  loadTeachers(): void {
    this.teacherService.getAllTeachers().subscribe({
      next: (teachers) => {
        this.dataSource = teachers;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  delete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      height: '200px',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teacherService.deleteTeacher(id).subscribe({
          next: () => {
            this.loadTeachers();
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
    this.router.navigate(['/admin/teachers/add']);
  }
}