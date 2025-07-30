import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from '../login/login';
import { RegisterComponent } from '../register/register';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-user',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    LoginComponent,
    RegisterComponent
  ],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class UserComponent {
  currentView = signal<'login' | 'register'>('login');

  switchToLogin(): void {
    this.currentView.set('login');
  }

  switchToRegister(): void {
    this.currentView.set('register');
  }
}
