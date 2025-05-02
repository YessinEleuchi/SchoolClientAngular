import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { AuthService } from '../../../services/auth.service';
import { GroupService } from '../../../services/group.service';
import { ParentService } from '../../../services/parent.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html'
})
export class StudentFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode: boolean = false;
  errorMessage: string = '';
  fieldErrors: { [key: string]: string } = {};
  successMessage: string = '';
  isLoading: boolean = false;
  groups: any[] = [];
  parents: any[] = [];
  statuses: string[] = ['Active', 'Inactive', 'Graduated', 'DroppedOut'];

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private groupService: GroupService,
    private parentService: ParentService,
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
      name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]),
      password: new FormControl('', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]),
      gender: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      address: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      dateofbirth: new FormControl('', [Validators.required]),
      admission_no: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      status: new FormControl('', [Validators.required]),
      group_id: new FormControl('', [Validators.required]),
      parent_id: new FormControl('')
    });

    this.loadRelatedData();
    if (id) {
      this.loadStudent(id);
    }
  }

  loadRelatedData(): void {
    this.groupService.getAllGroups().subscribe({
      next: (groups) => this.groups = groups,
      error: (err) => this.errorMessage = err.message || 'Failed to load groups'
    });
    this.parentService.getAllParents().subscribe({
      next: (parents) => this.parents = parents,
      error: (err) => this.errorMessage = err.message || 'Failed to load parents'
    });
  }

  loadStudent(id: string): void {
    this.isLoading = true;
    this.studentService.getStudentById(+id).subscribe({
      next: (student) => {
        console.log('Student data loaded:', student);
        this.form.patchValue({
          name: student.user.name || '',
          email: student.user.email || '',
          gender: student.user.gender || '',
          phone: student.user.phone || '',
          address: student.user.address || '',
          dateofbirth: student.user.dateofbirth || '',
          admission_no: student.admission_no || '',
          status: student.status || '',
          group_id: student.group_id || '',
          parent_id: student.parent_id || ''
        });
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load student data';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.fieldErrors = {};

    if (this.form.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.form.markAllAsTouched();
      console.log('Form invalid. Current form value:', this.form.value);
      return;
    }

    this.isLoading = true;
    const id = this.activatedRoute.snapshot.params['id'];
    const studentData = {
      name: this.form.get('name')?.value,
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value || undefined,
      gender: this.form.get('gender')?.value,
      phone: this.form.get('phone')?.value,
      address: this.form.get('address')?.value,
      dateofbirth: this.form.get('dateofbirth')?.value,
      admission_no: this.form.get('admission_no')?.value,
      status: this.form.get('status')?.value,
      group_id: this.form.get('group_id')?.value,
      parent_id: this.form.get('parent_id')?.value || null
    };

    console.log('Student data to send:', studentData);

    if (id) {
      this.studentService.updateStudent(+id, studentData).subscribe({
        next: (response) => {
          console.log('Update response:', response);
          this.successMessage = response.message || 'Student updated successfully';
          this.errorMessage = '';
          this.fieldErrors = {};
          this.isLoading = false;
          this.router.navigate(['/admin/students']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to update student';
          if (err.error?.errors) {
            this.fieldErrors = err.error.errors;
          }
          this.successMessage = '';
          this.isLoading = false;
        }
      });
    } else {
      this.studentService.addStudent(studentData).subscribe({
        next: (response) => {
          console.log('Add response:', response);
          this.successMessage = response.message || 'Student added successfully';
          this.errorMessage = '';
          this.fieldErrors = {};
          this.isLoading = false;
          this.router.navigate(['/admin/students']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to add student';
          if (err.error?.errors) {
            this.fieldErrors = err.error.errors;
          }
          this.successMessage = '';
          this.isLoading = false;
        }
      });
    }
  }

  // Add the cancel method
  cancel(): void {
    this.router.navigate(['/admin/students']);
  }
}