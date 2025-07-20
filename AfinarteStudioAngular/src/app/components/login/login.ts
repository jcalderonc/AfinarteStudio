import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Snackbar } from '../../services/snackbar';
import { LoginService } from '../../services/login';
import { LoginRequest } from '../../interfaces/login.request';
import { LoginResponse } from '../../interfaces/login.response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = signal(false);
  hidePassword = true; // Para ocultar/mostrar la contraseña

  constructor(
    private fb: FormBuilder, 
    private snackbar: Snackbar, 
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    this.loginForm.markAsUntouched();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const request: LoginRequest = this.loginForm.value;
      this.isLoading.set(true);
      this.loginService.login(request).subscribe({
        next: (response: LoginResponse) => {
          if(response.success)
          {
            this.loginService.userSignedIn.set(response.data.user);
            this.loginService.userToken.set(response.data.token);
            this.router.navigate(['/scheduler']);
          }
          
          this.snackbar.showError(response.message, 'Cerrar');
          this.isLoading.set(false);
          
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Login error:', error);
          this.snackbar.showError('Login fallido', 'Cerrar');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  getEmailErrorMessage(): string {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'El email es requerido';
    }
    if (emailControl?.hasError('email')) {
      return 'Ingresa un email válido';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'La contraseña es requerida';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }

  onForgotPassword(): void {
    this.snackbar.showInfo('Funcionalidad no implementada', 'Cerrar');
  }
}
