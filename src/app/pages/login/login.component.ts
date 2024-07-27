import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
// Import necessary contract
import { catchError, of } from 'rxjs';
import { AccountService, AuthenticationRequest } from '../../core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  showTooltip: boolean = false;
  errorMessage: string | null = null; // For displaying error messages
  router: Router = inject(Router);

  constructor(private fb: FormBuilder, private accountService: AccountService) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}'
        ),
      ]),
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginRequest: AuthenticationRequest = this.loginForm.value;
      this.accountService
        .authenticate(loginRequest)
        .pipe(
          catchError((error) => {
            this.errorMessage = 'Login failed. Please try again.';
            console.error(error);
            return of(null); // Return an empty observable in case of error
          })
        )
        .subscribe((response) => {
          if (response?.data) {
            // Handle successful login (e.g., store tokens, redirect, etc.)
            console.log('Login successful', response.data);
            this.router.navigate(['/todo']);
          }
        });
    } else {
      this.loginForm.markAllAsTouched();
      console.error('Form is invalid');
    }
  }
}
