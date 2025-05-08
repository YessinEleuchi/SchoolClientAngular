import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParentService } from '../../../services/parent.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-parent-form',
  templateUrl: './parent-form.component.html',
  styleUrls: ['./parent-form.component.css'] // Optional, if you have styles
})
export class ParentFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode: boolean = false;
  errorMessage: string = '';
  fieldErrors: { [key: string]: string } = {};
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private readonly parentService: ParentService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if user is admin
    const user = this.authService.getUser();
    if (user?.role.toLowerCase() !== 'admin') {
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }

    // Determine if in edit mode
    const id = this.activatedRoute.snapshot.params['id'];
    this.isEditMode = !!id;

    // Initialize form with correct field names
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]),
      password: new FormControl('', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]),
      gender: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      address: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      date_of_birth: new FormControl('', [Validators.required]), // Correct field name
      admission_no: new FormControl('', [Validators.required, Validators.maxLength(50)])
    });

    console.log('Form initialized with default values:', this.form.value);

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
          date_of_birth: parent.user.dateofbirth ||'',
          admission_no: parent.admission_no || ''
        });
        console.log('Form after patching with parent data:', this.form.value);
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load parent data';
        console.error('Error loading parent data:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.fieldErrors = {};
    this.successMessage = '';

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
      gender: this.form.get('gender')?.value.charAt(0).toUpperCase() +
        this.form.get('gender')?.value.slice(1), // Capitalize gender (e.g., male -> Male)
      phone: this.form.get('phone')?.value,
      address: this.form.get('address')?.value,
      date_of_birth: this.form.get('date_of_birth')?.value,
      admission_no: this.form.get('admission_no')?.value
    };

    console.log('Data being sent to backend:', parentData);

    if (id) {
      this.parentService.updateParent(+id, parentData).subscribe({
        next: () => {
          console.log('Parent updated successfully');
          this.isLoading = false;
          this.successMessage = 'Parent updated successfully';
          this.router.navigate(['/admin/parents']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to update parent';
          if (err.details?.errors) {
            this.fieldErrors = err.details.errors;
          }
          console.error('Error updating parent:', err);
          this.isLoading = false;
        }
      });
    } else {
      this.parentService.addParent(parentData).subscribe({
        next: () => {
          console.log('Parent added successfully');
          this.isLoading = false;
          this.successMessage = 'Parent added successfully';
          this.router.navigate(['/admin/parents']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to add parent';
          if (err.details?.errors) {
            this.fieldErrors = err.details.errors;
          }
          console.error('Error adding parent:', err);
          this.isLoading = false;
        }
      });
    }
  }
}
