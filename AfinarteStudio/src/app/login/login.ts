import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { STRINGS } from '../shared/strings';

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  strings = STRINGS.login;
  sharedStrings = STRINGS.shared;
  loginData: LoginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (this.isValidForm()) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Simulamos una llamada a la API
      setTimeout(() => {
        this.performLogin();
      }, 1500);
    }
  }

  private performLogin() {
    // Aquí iría la lógica real de autenticación
    // Por ahora, simulamos un login exitoso con credenciales específicas
    
    if (this.loginData.email === 'admin@afinartestudio.com' && this.loginData.password === 'admin123') {
      this.successMessage = this.strings.messages.loginSuccess;
      this.isLoading = false;
      
      // Guardar sesión si "recordarme" está marcado
      if (this.loginData.rememberMe && typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('rememberUser', 'true');
        localStorage.setItem('userEmail', this.loginData.email);
      }
      
      // Simular guardado de token de sesión
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('authToken', 'fake-jwt-token-' + Date.now());
        sessionStorage.setItem('userRole', 'admin');
      }
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 2000);
      
    } else if (this.loginData.email === 'juan.calderon@afinartestudio.com' && this.loginData.password === 'juan123') {
      this.successMessage = this.strings.messages.welcomeJuan;
      this.isLoading = false;
      
      if (this.loginData.rememberMe && typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('rememberUser', 'true');
        localStorage.setItem('userEmail', this.loginData.email);
      }
      
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('authToken', 'fake-jwt-token-' + Date.now());
        sessionStorage.setItem('userRole', 'owner');
      }
      
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 2000);
      
    } else {
      this.errorMessage = this.strings.messages.invalidCredentials;
      this.isLoading = false;
    }
  }

  private isValidForm(): boolean {
    return this.loginData.email.length > 0 && 
           this.loginData.password.length >= 6 &&
           this.isValidEmail(this.loginData.email);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onForgotPassword(event: Event) {
    event.preventDefault();
    alert(this.strings.modals.forgotPassword);
  }

  onRegister() {
    this.router.navigate(['/register']);
  }

  ngOnInit() {
    // Verificar si hay datos guardados para "recordarme" (solo en el navegador)
    if (typeof window !== 'undefined' && window.localStorage) {
      const rememberUser = localStorage.getItem('rememberUser');
      const savedEmail = localStorage.getItem('userEmail');
      
      if (rememberUser === 'true' && savedEmail) {
        this.loginData.email = savedEmail;
        this.loginData.rememberMe = true;
      }
    }
  }
}
