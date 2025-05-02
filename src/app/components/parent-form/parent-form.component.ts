import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParentService } from '../../../services/parent.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-parent-form',
  templateUrl: './parent-form.component.html'
})
export class ParentFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode: boolean = false;
  errorMessage: string = '';
  fieldErrors: { [key: string]: string } = {};
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private parentService: ParentService,
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
      name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]),
      password: new FormControl('', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]),
      gender: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      address: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      dateofbirth: new FormControl('', [Validators.required]),
      admission_no: new FormControl('', [Validators.required, Validators.maxLength(50)])
    });

    if (id) {
      this.loadParent(id);
    }
  }

  loadParent(id: string): void {
    this.isLoading = true;
    this.parentService.getParentById(+id).subscribe({
      next: (parent) => {
        console.log('Parent data loaded:', parent);
        this.form.patchValue({
          name: parent.user.name || '',
          email: parent.user.email || '',
          gender: parent.user.gender || '',
          phone: parent.user.phone || '',
          address: parent.user.address || '',
          dateofbirth: parent.user.date_of_birth || '',
          admission_no: parent.admission_no || ''
        });
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load parent data';
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
    const parentData = {
      name: this.form.get('name')?.value,
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value || undefined,
      gender: this.form.get('gender')?.value,
      phone: this.form.get('phone')?.value,
      address: this.form.get('address')?.value,
      dateofbirth: this.form.get('dateofbirth')?.value,
      admission_no: this.form.get('admission_no')?.value
    };

    console.log('Parent data to send:', parentData);

    if (id) {
      this.parentService.updateParent(+id, parentData).subscribe({
        next: (response) => {
          console.log('Update response:', response);
          this.successMessage = response.message || 'Parent updated successfully';
          this.errorMessage = '';
          this.fieldErrors = {};
          this.isLoading = false;
          this.router.navigate(['/admin/parents']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to update parent';
          if (err.error?.errors) {
            this.fieldErrors = err.error.errors;
          }
          this.successMessage = '';
          this.isLoading = false;
        }
      });
    } else {
      this.parentService.addParent(parentData).subscribe({
        next: (response) => {
          console.log('Add response:', response);
          this.successMessage = response.message || 'Parent added successfully';
          this.errorMessage = '';
          this.fieldErrors = {};
          this.isLoading = false;
          this.router.navigate(['/admin/parents']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to add parent';
          if (err.error?.errors) {
            this.fieldErrors = err.error.errors;
          }
          this.successMessage = '';
          this.isLoading = false;
        }
      });
    }
  }
}