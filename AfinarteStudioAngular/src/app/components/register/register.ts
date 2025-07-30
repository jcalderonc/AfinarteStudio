import { Component, OnInit, signal, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent implements OnInit {
  @Output() switchToLogin = new EventEmitter<void>();
  
  registerForm!: FormGroup;
  isLoading = signal(false);
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{3}-[0-9]{4}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      const formData = { ...this.registerForm.value };
      delete formData.confirmPassword;
      formData.createdAt = new Date();
      
      console.log('Datos de registro:', formData);
      // Aquí implementarías el servicio de registro
      
      setTimeout(() => {
        this.isLoading.set(false);
        // Simular éxito y volver al login
        this.switchToLogin.emit();
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} es requerido`;
    }
    if (field?.hasError('email')) {
      return 'Ingresa un email válido';
    }
    if (field?.hasError('minlength')) {
      return `${this.getFieldDisplayName(fieldName)} debe tener al menos ${field.errors?.['minlength']?.requiredLength} caracteres`;
    }
    if (field?.hasError('pattern')) {
      return 'Formato de teléfono inválido (ej: 555-1234)';
    }
    if (field?.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden';
    }
    if (field?.hasError('required') && fieldName === 'acceptTerms') {
      return 'Debes aceptar los términos y condiciones';
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const names: { [key: string]: string } = {
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Email',
      phone: 'Teléfono',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña'
    };
    return names[fieldName] || fieldName;
  }

  onBackToLogin(): void {
    this.switchToLogin.emit();
  }
}
