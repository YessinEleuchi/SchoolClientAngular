import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.authService.redirectBasedOnRole();
      },
      error: (err) => {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}
