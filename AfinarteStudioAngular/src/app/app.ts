import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatLabel } from '@angular/material/form-field';
import { LoginService } from './services/login';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MatLabel
  ]
})
export class AppComponent {
  isSidenavExpanded = signal(false);

  constructor(public loginService: LoginService) {}

  toggleSidenav() {
    this.isSidenavExpanded.set(!this.isSidenavExpanded());
  }

  collapseSidenav() {
    this.isSidenavExpanded.set(false);
  }
}
