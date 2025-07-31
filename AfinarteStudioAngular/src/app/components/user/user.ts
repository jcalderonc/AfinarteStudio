import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from '../login/login';
import { RegisterComponent } from '../register/register';
import { MatCardModule } from '@angular/material/card';
import { trigger, animate, transition, style } from '@angular/animations';

const heightAnimation = trigger('heightAnimation', [
  transition('* => *', [
    style({ opacity: 0, transform: 'scale(0.8) translateY(-20px)' }),
    animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
  ])
]);

@Component({
  selector: 'app-user',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    LoginComponent,
    RegisterComponent
  ],
  animations: [heightAnimation],
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


