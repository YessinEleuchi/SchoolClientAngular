import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required for Angular Material animations
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field'; // For mat-form-field
import { MatInputModule } from '@angular/material/input'; // For mat-input
import { MatSelectModule } from '@angular/material/select'; // For mat-select
import { MatDatepickerModule } from '@angular/material/datepicker'; // For date picker
import { MatNativeDateModule } from '@angular/material/core'; // Required for date picker
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from '../Dashboards/admin-dashboard/admin-dashboard.component';
import { TeacherDashboardComponent } from '../Dashboards/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from '../Dashboards/student-dashboard/student-dashboard.component';
import { ParentDashboardComponent } from '../Dashboards/parent-dashboard/parent-dashboard.component';
import { TeacherComponent } from './components/lists/teacher-list/teacher.component';
import { TeacherFormComponent } from './components/forms/teacher-form/teacher-form.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AuthGuard } from './guards/auth.guard';
import { ParentListComponent } from './components/lists/parent-list/parent-list.component';
import { ParentFormComponent } from './components/forms/parent-form/parent-form.component';
import { AdminManagementComponent } from './components/admin-management/admin-management.component';
import { EntityFormComponent } from './components/forms/entity-form/entity-form.component';
import { StudentFormComponent } from './components/forms/student-form/student-form.component';
import { StudentListComponent } from './components/lists/student-list/student-list.component';
import { StudentService } from '../services/student.service';
import { NgChartsModule } from 'ng2-charts';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminDashboardComponent,
    TeacherDashboardComponent,
    StudentDashboardComponent,
    ParentDashboardComponent,
    TeacherComponent,
    TeacherFormComponent,
    ConfirmDialogComponent,
    ParentListComponent,
    ParentFormComponent,
    AdminManagementComponent,
    EntityFormComponent,
    StudentFormComponent,
    StudentListComponent,
    OverviewComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule, // Added for animations
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule, // Added for mat-form-field
    MatInputModule, // Added for mat-input
    MatSelectModule, // Added for mat-select
    MatDatepickerModule, // Added for date picker
    MatNativeDateModule, // Added for date picker
    NgChartsModule,
    FormsModule,

  ],
  providers: [AuthGuard, StudentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
