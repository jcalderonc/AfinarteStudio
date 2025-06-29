import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { STRINGS } from '../shared/strings';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  strings = STRINGS.register;
  sharedStrings = STRINGS.shared;

  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (this.isValidForm()) {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Simulate registration process
      setTimeout(() => {
        this.isLoading = false;
        
        // Check if email already exists (simulation)
        if (this.registerData.email === 'admin@afinartestudio.com' || 
            this.registerData.email === 'juan.calderon@afinartestudio.com') {
          this.errorMessage = this.strings.messages.emailExists;
          return;
        }
        
        this.successMessage = this.strings.messages.registerSuccess;
        
        // Redirect to login after successful registration
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        
      }, 2000);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  private isValidForm(): boolean {
    return !!(
      this.registerData.firstName.trim() &&
      this.registerData.lastName.trim() &&
      this.registerData.email.trim() &&
      this.registerData.phone.trim() &&
      this.registerData.password.length >= 8 &&
      this.registerData.confirmPassword === this.registerData.password &&
      this.registerData.acceptTerms
    );
  }
}
