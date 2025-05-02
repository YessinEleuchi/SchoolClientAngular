import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from '../../../services/teacher.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html'
})
export class TeacherFormComponent implements OnInit {
  form!: FormGroup;
  teacherStatuses = ['permanent', 'temporary', 'contractual'];
  isEditMode: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private teacherService: TeacherService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user?.role.toLowerCase() !== 'admin') {
      this.authService.logout();
      return;
    }

    const id = this.activatedRoute.snapshot.params['id'];
    this.isEditMode = !!id;

    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
      email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(255)]),
      password: new FormControl(null, this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]),
      gender: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]), // Basic phone validation
      address: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
      dateofbirth: new FormControl(null, [Validators.required]),
      admission_no: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      status: new FormControl(null, [Validators.required])
    });

    if (id) {
      this.loadTeacher(id);
    }
  }

  loadTeacher(id: string): void {
    this.isLoading = true;
    this.teacherService.getTeacherById(+id).subscribe({
      next: (teacher) => {
        console.log('Teacher data loaded:', teacher);
        this.form.patchValue({
          name: teacher.user.name || '',
          email: teacher.user.email || '',
          gender: teacher.user.gender || '',
          phone: teacher.user.phone || '',
          address: teacher.user.address || '',
          dateofbirth: teacher.user.date_of_birth || '',
          admission_no: teacher.admission_no || '',
          status: teacher.status || ''
        });
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.form.markAllAsTouched();
      console.log('Form errors:', this.form.errors, 'Form value:', this.form.value); // Debug: Log form state
      return;
    }

    this.isLoading = true;
    const id = this.activatedRoute.snapshot.params['id'];
    const teacherData: any = {
      name: this.form.get('name')?.value,
      email: this.form.get('email')?.value,
      gender: this.form.get('gender')?.value,
      phone: this.form.get('phone')?.value,
      address: this.form.get('address')?.value,
      dateofbirth: this.form.get('dateofbirth')?.value,
      admission_no: this.form.get('admission_no')?.value,
      status: this.form.get('status')?.value
    };

    const password = this.form.get('password')?.value;
    if (password) {
      teacherData.password = password;
    }

    console.log('Teacher data to send:', teacherData);

    if (id) {
      this.teacherService.updateTeacher(+id, teacherData).subscribe({
        next: (response) => {
          console.log('Update response:', response);
          this.successMessage = response.message || 'Teacher updated successfully';
          this.errorMessage = '';
          this.isLoading = false;
          this.router.navigate(['/admin/teachers']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to update teacher';
          this.successMessage = '';
          this.isLoading = false;
        }
      });
    } else {
      this.teacherService.addTeacher(teacherData).subscribe({
        next: (response) => {
          console.log('Add response:', response);
          this.successMessage = response.message || 'Teacher added successfully';
          this.errorMessage = '';
          this.isLoading = false;
          this.router.navigate(['/admin/teachers']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to add teacher';
          this.successMessage = '';
          this.isLoading = false;
        }
      });
    }
  }
}