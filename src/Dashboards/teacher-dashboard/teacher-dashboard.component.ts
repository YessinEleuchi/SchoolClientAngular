// src/app/components/teacher-dashboard/teacher-dashboard.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../app/services/auth.service';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent {
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
