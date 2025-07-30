import { Component } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { LoginService } from './services/login';



@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule
  ]
})
export class AppComponent {
  isSidenavExpanded = false;

  /**
   *
   */
  constructor(public loginService: LoginService) {}

  toggleSidenav() {
    this.isSidenavExpanded = !this.isSidenavExpanded;
  }

  collapseSidenav() {
    this.isSidenavExpanded = false;
  }
}
