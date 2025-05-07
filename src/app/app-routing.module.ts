import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Modules/Auth/login/login.component';
import { AdminDashboardComponent } from './components/sidebar/admin-dashboard.component';
import { TeacherDashboardComponent } from '../Dashboards/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from '../Dashboards/student-dashboard/student-dashboard.component';
import { ParentDashboardComponent } from '../Dashboards/parent-dashboard/parent-dashboard.component';
import { TeacherComponent } from './Modules/Users/lists/teacher-list/teacher.component';
import { TeacherFormComponent } from './Modules/Auth/add-teacher/teacher-form.component';
import { ParentListComponent } from './Modules/Users/lists/parent-list/parent-list.component';
import { ParentFormComponent } from './Modules/Auth/add-parent/parent-form.component';
import { AuthGuard } from './Modules/Auth/guards/auth.guard';
import { AdminManagementComponent } from './Modules/entities/admin-entities/admin-management.component';
import { StudentListComponent } from './Modules/Users/lists/student-list/student-list.component';
import { StudentFormComponent } from './Modules/Auth/add-student/student-form.component';
import {OverviewComponent} from "./components/overview/overview.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'teachers', pathMatch: 'full' },
      { path: 'teachers', component: TeacherComponent },
      { path: 'overview', component: OverviewComponent },
      { path: 'teachers/add', component: TeacherFormComponent },
      { path: 'teachers/edit/:id', component: TeacherFormComponent },
      { path: 'parents', component: ParentListComponent },
      { path: 'parents/add', component: ParentFormComponent },
      { path: 'parents/edit/:id', component: ParentFormComponent },
      { path: 'management', component: AdminManagementComponent },
      { path: 'students', component: StudentListComponent }, // Fixed: Removed redundant "admin/" prefix
      { path: 'students/add', component: StudentFormComponent }, // Fixed
      { path: 'students/edit/:id', component: StudentFormComponent }, // Fixed
    ]
  },
  { path: 'teacher', component: TeacherDashboardComponent, canActivate: [AuthGuard] },
  { path: 'student', component: StudentDashboardComponent, canActivate: [AuthGuard] },
  { path: 'parent', component: ParentDashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
